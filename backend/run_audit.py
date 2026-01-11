import httpx
import time
import sys
import os
from urllib.parse import urlparse

SERVER_URL = "http://localhost:8000"

def check_server():
    try:
        httpx.get(f"{SERVER_URL}/", timeout=2.0)
        return True
    except httpx.RequestError:
        return False

def get_valid_input(prompt, validator=None):
    while True:
        value = input(prompt).strip()
        if not value:
            continue
        if validator and not validator(value):
            continue
        return value

def spinner(text):
    chars = "|/-\\"
    for char in chars:
        sys.stdout.write(f'\r{text} {char}')
        sys.stdout.flush()
        time.sleep(0.1)

def main():
    print("\n=== ADA Compliance Auditor CLI ===\n")

    if not check_server():
        print(f"[ERROR] Could not connect to server at {SERVER_URL}")
        print("Please ensure the backend is running: 'python -m uvicorn main:app --port 8000'")
        return

    raw_input = get_valid_input("Enter website URL(s) to audit (comma separated, e.g., site1.com, site2.com): ")
    
    urls = [u.strip() for u in raw_input.split(',')]
    valid_urls = []
    
    for u in urls:
        if not u: continue
        if not u.startswith("http"):
            u = "https://" + u
        valid_urls.append(u)
    
    if not valid_urls:
        print("[ERROR] No valid URLs provided.")
        return

    ai_input = get_valid_input("Enable AI checks (Visual/ARIA/Alt)? (y/n): ", lambda x: x.lower() in ['y', 'n', 'yes', 'no'])
    enable_ai = ai_input.lower().startswith('y')

    print(f"\n[INFO] Queued {len(valid_urls)} sites for auditing (AI: {'ON' if enable_ai else 'OFF'}).")

    for idx, url in enumerate(valid_urls, 1):
        print(f"\n{'='*60}")
        print(f"Processing Site {idx}/{len(valid_urls)}: {url}")
        print(f"{'='*60}\n")
        
        try:
            payload = {"urls": [url], "enable_ai": enable_ai}
            response = httpx.post(f"{SERVER_URL}/audit/start", json=payload, timeout=10.0)
            
            if response.status_code != 200:
                print(f"[ERROR] Failed to start audit for {url}: {response.text}")
                continue
                
            data = response.json()
            job_id = data.get("job_id")
            print(f"[INFO] Job Started! ID: {job_id}")
            
            status = "processing"
            start_time = time.time()
            
            while status.lower() in ["pending", "processing"]:
                elapsed = int(time.time() - start_time)
                sys.stdout.write(f'\r[INFO] Status: {status.upper()} (Elapsed: {elapsed}s)... ')
                sys.stdout.flush()
                time.sleep(2)
                
                try:
                    status_res = httpx.get(f"{SERVER_URL}/audit/{job_id}/status", timeout=5.0)
                    if status_res.status_code == 200:
                        state_data = status_res.json()
                        status = state_data.get("status")
                    else:
                        pass
                except Exception:
                    pass
                    
            print(f"\n[INFO] Finished with status: {status.upper()}")
            
            if status.lower() == "completed":
                print("[INFO] Fetching PDF Report...")
                try:
                    pdf_res = httpx.get(f"{SERVER_URL}/audit/{job_id}/report/pdf", timeout=60.0)
                    
                    if pdf_res.status_code == 200:
                        domain = urlparse(url).netloc.replace("www.", "").replace(":", "_")
                        filename = f"audit_report_{domain}_{int(time.time())}.pdf"
                        
                        with open(filename, "wb") as f:
                            f.write(pdf_res.content)
                        
                        print(f"[SUCCESS] Report saved to: {os.path.abspath(filename)}")
                    else:
                        print(f"[ERROR] Failed to download report: {pdf_res.status_code}")
                except Exception as e:
                    print(f"[ERROR] Download failed: {e}")
            else:
                print("[ERROR] Audit failed. Check logs.")
                
        except Exception as e:
            print(f"\n[EXCEPTION] Error processing {url}: {e}")
        
        if idx < len(valid_urls):
            print("\nWaiting 5 seconds before next site...")
            time.sleep(5)

    print("\n[INFO] All audits finished.")

if __name__ == "__main__":
    main()
