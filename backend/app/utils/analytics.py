import os
import json
import math

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_FILE = os.path.join(BASE_DIR, "decision_logs.json")

def sanitize(value):
    if isinstance(value, float) and not math.isfinite(value):
        return None
    return value

def compute_analytics():
    if not os.path.exists(LOG_FILE):
        return {"message": "No logs found"}

    with open(LOG_FILE, "r") as f:
        logs = json.load(f)

    total = len(logs)
    if total == 0:
        return {"message": "No data available"}

    # Safe override count
    overrides = sum(1 for log in logs if log.get("decisions", {}).get("override", False))

    # Safe numeric extraction
    risk_values = []
    ttc_values = []

    for log in logs:
        risk = log.get("metrics", {}).get("risk_score", 0)
        ttc = log.get("metrics", {}).get("min_ttc", 0)

        # Avoid infinity or invalid numbers
        if isinstance(risk, (int, float)) and math.isfinite(risk):
            risk_values.append(risk)

        if isinstance(ttc, (int, float)) and math.isfinite(ttc):
            ttc_values.append(ttc)

    avg_risk = sum(risk_values) / len(risk_values) if risk_values else 0
    avg_ttc = sum(ttc_values) / len(ttc_values) if ttc_values else 0

    return {
        "total_runs": total,
        "total_overrides": overrides,
        "override_rate": round(overrides / total, 2),
        "average_risk_score": round(avg_risk, 2),
        "average_ttc": round(avg_ttc, 2)
    }