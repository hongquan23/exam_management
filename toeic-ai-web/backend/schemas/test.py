from pydantic import BaseModel
from datetime import datetime

class TestBase(BaseModel):
    title: str
    year: int
    time_limit: int

class TestCreate(TestBase):
    pass

class TestOut(TestBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
