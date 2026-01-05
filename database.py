from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

DATABASE_URL = "sqlite:///./ada_audit.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AuditJob(Base):
    __tablename__ = "audit_jobs"

    id = Column(String, primary_key=True, index=True)
    status = Column(String, default="Pending") # Pending, Processing, Completed, Failed
    urls = Column(JSON) # List of URLs to audit
    created_at = Column(DateTime, default=datetime.utcnow)
    error_message = Column(Text, nullable=True)

class AuditResult(Base):
    __tablename__ = "audit_results"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, index=True)
    url = Column(String)
    compliance_data = Column(JSON) # The full JSON result for this page

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
