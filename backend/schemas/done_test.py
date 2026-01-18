from pydantic import BaseModel
from datetime import datetime

class DoneTestOut(BaseModel):
    id: int
    user_id: int
    test_id: int
    correct_answer: int
    false_answer: int
    created_at: datetime

class DoneTestCreate(BaseModel):
    user_id: int
    test_id: int
    correct_answer: int
    false_answer: int
    created_at: datetime



    class Config:
        from_attributes = True
