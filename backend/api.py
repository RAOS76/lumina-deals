from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import sys

# Add current directory to path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scraper_live import live_search

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "online", "service": "Lumina Scraper API"}

@app.get("/search")
def search_endpoint(q: str):
    print(f"[API] Searching for: {q}")
    try:
        results = live_search(q)
        return results
    except Exception as e:
        print(f"[API] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
