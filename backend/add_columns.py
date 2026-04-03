from app.db.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE decision_logs ADD COLUMN IF NOT EXISTS disagreement_level VARCHAR"))
    conn.execute(text("ALTER TABLE decision_logs ADD COLUMN IF NOT EXISTS weather VARCHAR"))
    conn.commit()
    print("✅ Columns added!")