from fastapi import FastAPI
from app.api.routes import router
from app.utils.sanitize import clean_floats

app = FastAPI()

app.include_router(router)

@app.get("/")
def root():
    return {"message": "CoT Hybrid AV Backend Running"}

@app.get("/health")
def health():
    return {"status": "OK"}

from sqlalchemy import func
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import DecisionLog


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/analytics/summary")
def analytics_summary(db: Session = Depends(get_db)):

    total_runs = db.query(func.count(DecisionLog.id)).scalar()

    override_count = db.query(func.count(DecisionLog.id))\
        .filter(DecisionLog.override == True).scalar()

    avg_risk = db.query(func.avg(DecisionLog.risk_score)).scalar()
    avg_ttc = db.query(func.avg(DecisionLog.min_ttc)).scalar()
    avg_latency = db.query(func.avg(DecisionLog.total_latency_ms)).scalar()

    decision_distribution = db.query(
        DecisionLog.final_decision,
        func.count(DecisionLog.id)
    ).group_by(DecisionLog.final_decision).all()

    decision_dict = {d[0]: d[1] for d in decision_distribution}

    return {
        "total_runs": total_runs,
        "override_rate": round(override_count / total_runs, 3) if total_runs else 0,
        "average_risk_score": round(avg_risk, 3) if avg_risk else 0,
        "average_ttc": round(avg_ttc, 3) if avg_ttc else 0,
        "average_latency_ms": round(avg_latency, 2) if avg_latency else 0,
        "decision_distribution": decision_dict
    }


@app.get("/analytics/risk-analysis")
def risk_analysis(db: Session = Depends(get_db)):

    high_risk = db.query(func.count(DecisionLog.id))\
        .filter(DecisionLog.risk_score > 1.0).scalar()

    medium_risk = db.query(func.count(DecisionLog.id))\
        .filter(DecisionLog.risk_score.between(0.5, 1.0)).scalar()

    low_risk = db.query(func.count(DecisionLog.id))\
        .filter(DecisionLog.risk_score < 0.5).scalar()

    high_risk_overrides = db.query(func.count(DecisionLog.id))\
        .filter(
            DecisionLog.risk_score > 1.0,
            DecisionLog.override == True
        ).scalar()

    return {
        "risk_distribution": {
            "high": high_risk,
            "medium": medium_risk,
            "low": low_risk
        },
        "high_risk_override_rate": (
            round(high_risk_overrides / high_risk, 3)
            if high_risk else 0
        )
    }

@app.get("/analytics/weather")
def analytics_weather(db: Session = Depends(get_db)):

    results = db.query(
        DecisionLog.weather,
        DecisionLog.final_decision,
        func.count(DecisionLog.id)
    ).filter(
        DecisionLog.weather != None
    ).group_by(
        DecisionLog.weather,
        DecisionLog.final_decision
    ).all()

    # Build nested dict: { "clear": {"STOP": 5, "CONTINUE": 3}, "rain": {...} }
    breakdown = {}
    for weather, decision, count in results:
        if weather not in breakdown:
            breakdown[weather] = {}
        breakdown[weather][decision or "UNKNOWN"] = count

    # Also get override rate per weather
    weather_overrides = db.query(
        DecisionLog.weather,
        func.count(DecisionLog.id)
    ).filter(
        DecisionLog.override == True,
        DecisionLog.weather != None
    ).group_by(DecisionLog.weather).all()

    override_by_weather = {w: c for w, c in weather_overrides}

    weather_totals = db.query(
        DecisionLog.weather,
        func.count(DecisionLog.id)
    ).filter(
        DecisionLog.weather != None
    ).group_by(DecisionLog.weather).all()

    override_rates = {}
    for w, total in weather_totals:
        overrides = override_by_weather.get(w, 0)
        override_rates[w] = round(overrides / total, 3) if total else 0

    return clean_floats({
        "decision_by_weather": breakdown,
        "override_rate_by_weather": override_rates
    })

@app.get("/analytics/disagreements")
def analytics_disagreements(db: Session = Depends(get_db)):

    results = db.query(
        DecisionLog.disagreement_level,
        func.count(DecisionLog.id)
    ).filter(
        DecisionLog.disagreement_level != None
    ).group_by(
        DecisionLog.disagreement_level
    ).all()

    distribution = {level: count for level, count in results}

    # Fill in zeros for any missing levels
    for level in ["NONE", "LOW", "MODERATE", "CRITICAL"]:
        if level not in distribution:
            distribution[level] = 0

    total = sum(distribution.values())

    # How often does CRITICAL disagreement happen?
    critical_count = distribution.get("CRITICAL", 0)
    critical_rate = round(critical_count / total, 3) if total else 0

    # Of CRITICAL disagreements, how many were overridden?
    critical_overrides = db.query(func.count(DecisionLog.id)).filter(
        DecisionLog.disagreement_level == "CRITICAL",
        DecisionLog.override == True
    ).scalar()

    return clean_floats({
        "disagreement_distribution": distribution,
        "total_with_disagreement": total,
        "critical_rate": critical_rate,
        "critical_override_rate": round(critical_overrides / critical_count, 3) if critical_count else 0
    })

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)