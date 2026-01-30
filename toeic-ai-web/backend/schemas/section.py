from pydantic import BaseModel

class SectionBase(BaseModel):
    skill: str
    part: int
    time_limit: int

class SectionOut(SectionBase):
    id: int
    test_id: int

    class Config:
        from_attributes = True

class SectionCreate(SectionBase):
    pass
