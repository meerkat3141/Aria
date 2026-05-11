from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

# Database configuration and SQLAlchemy ORM models
DATABASE_URL = "sqlite:///./ada_audit.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Model representing a single audit execution and its overall status
class AuditJob(Base):
    __tablename__ = "audit_jobs"

    id = Column(String, primary_key=True, index=True)
    status = Column(String, default="Pending") 
    urls = Column(JSON) 
    graph_data = Column(JSON, nullable=True) 
    created_at = Column(DateTime, default=datetime.utcnow)
    error_message = Column(Text, nullable=True)

# Model representing the compliance results for a specific page
class AuditResult(Base):
    __tablename__ = "audit_results"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, index=True)
    url = Column(String)
    compliance_data = Column(JSON) 

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
