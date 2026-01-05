from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uuid
import asyncio
from datetime import datetime
import os
import json

from database import engine, SessionLocal, init_db, AuditJob, AuditResult, get_db
from crawler import Crawler
from auditor import ADAAuditor
from report_generator import ReportGenerator

# Initialize DB
init_db()

app = FastAPI(title="ADA Compliance Auditor API")

class AuditRequest(BaseModel):
    urls: List[str]
    enable_ai: bool = True

class AuditStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: Optional[str] = None

# Global state for simple progress tracking (in-memory for MVP)
# In production, use Redis or DB for granular progress
job_progress = {}

def update_job_status(db, job_id, status, error=None):
    job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
    if job:
        job.status = status
        if error:
            job.error_message = str(error)
        db.commit()

async def run_audit_task(job_id: str, start_urls: List[str], enable_ai: bool = True):
    db = SessionLocal()
    auditor = ADAAuditor(enable_ai=enable_ai)
    report_gen = ReportGenerator()
    
    try:
        update_job_status(db, job_id, "Processing")
        
        # 1. Crawl
        all_pages_to_audit = []
        for url in start_urls:
            crawler = Crawler(url, max_pages=5)
            pages = await crawler.crawl()
            all_pages_to_audit.extend(pages)
        
        # Deduplicate
        all_pages_to_audit = list(set(all_pages_to_audit))
        job_progress[job_id] = f"0/{len(all_pages_to_audit)} pages audited"
        
        # 2. Audit
        results = []
        for i, page_url in enumerate(all_pages_to_audit):
            job_progress[job_id] = f"{i+1}/{len(all_pages_to_audit)} pages audited"
            audit_data = await auditor.audit_page(page_url)
            
            # Save result
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

@app.get("/audit/{job_id}/status")
async def get_status(job_id: str, db = Depends(get_db)):
    job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    progress = job_progress.get(job_id, "")
    return {"job_id": job_id, "status": job.status, "progress": progress, "error": job.error_message}

@app.get("/audit/{job_id}/results")
async def get_results(job_id: str, db = Depends(get_db)):
    job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    results = db.query(AuditResult).filter(AuditResult.job_id == job_id).all()
    data = [res.compliance_data for res in results]
    
    return {"job_id": job_id, "status": job.status, "results": data}

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
    filename = f"audit_report_{job_id}.pdf"
    file_path = os.path.join(os.getcwd(), filename)
    report_gen.generate_pdf(job_data, file_path)
    
    return FileResponse(file_path, filename=filename, media_type='application/pdf')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
