from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserAttemptBase(BaseModel):
    user_id: int
    section_id: int
    question_id: int
    user_ans: Optional[str] = None
    AI_ans: Optional[str] = None


class UserAttemptCreate(UserAttemptBase):
    pass


class UserAttemptUpdate(BaseModel):
    user_ans: Optional[str] = None
    AI_ans: Optional[str] = None


class UserAttemptOut(UserAttemptBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
