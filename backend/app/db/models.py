from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class DecisionLog(Base):
    __tablename__ = "decision_logs"

    id = Column(Integer, primary_key=True, index=True)

    scenario = Column(JSONB)
    llm_decision = Column(String)
    rule_decision = Column(String)
    final_decision = Column(String)

    override = Column(Boolean)

    risk_score = Column(Float)
    min_ttc = Column(Float)
    stopping_distance = Column(Float)

    confidence = Column(Float)
    total_latency_ms = Column(Float)
    disagreement_level = Column(String)    
    weather = Column(String) 
    
    created_at = Column(DateTime, default=datetime.utcnow)