from app.db.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    # First check what's in there
    result = conn.execute(text("SELECT COUNT(*) FROM decision_logs WHERE risk_score = 'Infinity'"))
    print("Infinity risk_score rows:", result.scalar())
    
    result = conn.execute(text("SELECT COUNT(*) FROM decision_logs WHERE min_ttc = 'Infinity'"))
    print("Infinity min_ttc rows:", result.scalar())

    # Now clean
    conn.execute(text("UPDATE decision_logs SET risk_score = NULL WHERE risk_score = 'Infinity' OR risk_score = '-Infinity'"))
    conn.execute(text("UPDATE decision_logs SET min_ttc = NULL WHERE min_ttc = 'Infinity' OR min_ttc = '-Infinity'"))
    conn.execute(text("UPDATE decision_logs SET stopping_distance = NULL WHERE stopping_distance = 'Infinity' OR stopping_distance = '-Infinity'"))
    conn.execute(text("UPDATE decision_logs SET total_latency_ms = NULL WHERE total_latency_ms = 'Infinity' OR total_latency_ms = '-Infinity'"))
    conn.commit()
    
    # Verify
    result = conn.execute(text("SELECT COUNT(*) FROM decision_logs WHERE risk_score = 'Infinity'"))
    print("After fix - Infinity rows remaining:", result.scalar())
    print("✅ Done!")