from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uuid
import asyncio
from datetime import datetime
import os
import json
import sys

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from database import engine, SessionLocal, init_db, AuditJob, AuditResult, get_db
from crawler import Crawler
from auditor import ADAAuditor
from report_generator import ReportGenerator

init_db()

app = FastAPI(title="ADA Compliance Auditor API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuditRequest(BaseModel):
    urls: List[str]
    enable_ai: bool = True

class EmailRequest(BaseModel):
    organization: str
    recipient: str
    subject: str
    message: str

class AuditStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: Optional[str] = None

job_progress = {}

def update_job_status(db, job_id, status, error=None):
    job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
    if job:
        job.status = status
        if error:
            job.error_message = str(error)
        db.commit()

def run_audit_task(job_id: str, start_urls: List[str], enable_ai: bool = True):
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(run_audit_task_async(job_id, start_urls, enable_ai))

async def run_audit_task_async(job_id: str, start_urls: List[str], enable_ai: bool = True):
    db = SessionLocal()
    auditor = ADAAuditor(enable_ai=enable_ai)
    report_gen = ReportGenerator()
    
    try:
        update_job_status(db, job_id, "Processing")
        
        all_pages_to_audit = []
        all_edges = []
        for url in start_urls:
            crawler = Crawler(url, max_pages=5)
            crawl_data = await crawler.crawl()
            all_pages_to_audit.extend(crawl_data["pages"])
            all_edges.extend(crawl_data["edges"])
        
        all_pages_to_audit = list(set(all_pages_to_audit))
        
        job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
        if job:
            job.graph_data = {"edges": all_edges}
            db.commit()

        job_progress[job_id] = f"0/{len(all_pages_to_audit)} pages audited"
        
        results = []
        for i, page_url in enumerate(all_pages_to_audit):
            job_progress[job_id] = f"{i+1}/{len(all_pages_to_audit)} pages audited"
            audit_data = await auditor.audit_page(page_url)
            
            result_entry = AuditResult(job_id=job_id, url=page_url, compliance_data=audit_data)
            db.add(result_entry)
            db.commit()
            results.append(audit_data)
            
        update_job_status(db, job_id, "Completed")
        
    except Exception as e:
        print(f"Audit failed for {job_id}: {e}")
        update_job_status(db, job_id, "Failed", error=str(e))
    finally:
        db.close()

@app.post("/audit/start", response_model=AuditStatusResponse)
async def start_audit(request: AuditRequest, background_tasks: BackgroundTasks, db = Depends(get_db)):
    job_id = str(uuid.uuid4())
    new_job = AuditJob(id=job_id, status="Pending", urls=request.urls)
    db.add(new_job)
    db.commit()
    
    background_tasks.add_task(run_audit_task, job_id, request.urls, request.enable_ai)
    return {"job_id": job_id, "status": "Pending"}

@app.post("/email/send")
async def send_email(request: EmailRequest):
    # Simulate network delay for realistic presentation effect
    await asyncio.sleep(1.5)
    return {"status": "success", "message": f"Email successfully sent to {request.recipient}"}

@app.get("/audit/{job_id}/status")
async def get_status(job_id: str, db = Depends(get_db)):
    job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    progress = job_progress.get(job_id, "")
    return {"job_id": job_id, "status": job.status, "progress": progress, "error": job.error_message}

@app.get("/audit/jobs/completed")
async def get_completed_jobs(db = Depends(get_db)):
    jobs = db.query(AuditJob).filter(AuditJob.status == "Completed").all()
    from urllib.parse import urlparse
    import re
    completed = []
    for job in jobs:
        domain = "website"
        if job.urls and len(job.urls) > 0:
            parsed = urlparse(job.urls[0])
            extracted_domain = parsed.netloc if parsed.netloc else parsed.path.split('/')[0]
            domain = extracted_domain.replace('www.', '')
            domain = re.sub(r'[^a-zA-Z0-9]', '_', domain)
        filename = f"Aria_Audit_Report_{domain}.pdf"
        completed.append({"job_id": job.id, "filename": filename})
    return completed


@app.get("/audit/{job_id}/results")
async def get_results(job_id: str, db = Depends(get_db)):
    job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    results = db.query(AuditResult).filter(AuditResult.job_id == job_id).all()
    data = [res.compliance_data for res in results]
    
    return {"job_id": job_id, "status": job.status, "results": data, "graph_data": job.graph_data}

@app.get("/audit/{job_id}/report/pdf")
async def get_pdf_report(job_id: str, db = Depends(get_db)):
    job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != "Completed":
        raise HTTPException(status_code=400, detail="Audit not completed yet")
        
    results = db.query(AuditResult).filter(AuditResult.job_id == job_id).all()
    job_data = {
        "id": job.id,
        "created_at": str(job.created_at),
        "results": [res.compliance_data for res in results]
    }
    
    report_gen = ReportGenerator()
    
    # Extract domain name for the PDF filename
    domain = "website"
    if job.urls and len(job.urls) > 0:
        from urllib.parse import urlparse
        import re
        parsed = urlparse(job.urls[0])
        extracted_domain = parsed.netloc if parsed.netloc else parsed.path.split('/')[0]
        domain = extracted_domain.replace('www.', '')
        domain = re.sub(r'[^a-zA-Z0-9]', '_', domain)

    filename = f"Aria_Audit_Report_{domain}.pdf"
    file_path = os.path.join(os.getcwd(), 'reports', filename)
    report_gen.generate_pdf(job_data, file_path)
    
    return FileResponse(file_path, filename=filename, media_type='application/pdf')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
