from pydantic import BaseModel
from typing import List, Optional


class DetectedObject(BaseModel):
    type: str
    distance: float  # meters


class ScenarioInput(BaseModel):
    objects: List[DetectedObject]
    ego_speed: float  # km/h
    weather: Optional[str] = "clear"
    timestamp: Optional[str] = None