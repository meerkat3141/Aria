import httpx
import time
import sys
import os

BASE_URL = "http://localhost:8000"

def test_audit():
    print("Starting audit test...")
    
    # 1. Start Audit
    try:
        response = httpx.post(f"{BASE_URL}/audit/start", json={"urls": ["https://plantpico.com"]})
        response.raise_for_status()
        data = response.json()
        job_id = data["job_id"]
        print(f"Job started with ID: {job_id}")
    except Exception as e:
        print(f"Failed to start audit: {e}")
        return

    # 2. Poll Status
    status = "Pending"
    while status in ["Pending", "Processing"]:
        time.sleep(2)
        try:
            res = httpx.get(f"{BASE_URL}/audit/{job_id}/status")
            res.raise_for_status()
            status_data = res.json()
            status = status_data["status"]
            progress = status_data.get("progress", "")
            print(f"Status: {status} - {progress}")
            
            if status == "Failed":
                print(f"Audit failed with error: {status_data.get('error')}")
                return
        except Exception as e:
            print(f"Polling failed: {e}")
            return

    # 3. Get Results
    try:
        res = httpx.get(f"{BASE_URL}/audit/{job_id}/results")
        res.raise_for_status()
        results = res.json()
        print("\n Audit Results JSON (Summary):")
        # Print a snippet
        print(str(results)[:500] + "...")
    except Exception as e:
        print(f"Failed to get results: {e}")

    # 4. Download PDF
    try:
        print("\nDownloading PDF Report...")
        res = httpx.get(f"{BASE_URL}/audit/{job_id}/report/pdf")
        if res.status_code == 200:
            filename = f"verified_report_{job_id}.pdf"
            with open(filename, "wb") as f:
                f.write(res.content)
            print(f"PDF saved to {filename}")
        else:
            print(f"Failed to download PDF: {res.status_code} {res.text}")
    except Exception as e:
        print(f"Failed to download PDF: {e}")

if __name__ == "__main__":
    test_audit()
