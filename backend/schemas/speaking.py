from pydantic import BaseModel

class SpeakingQuestionOut(BaseModel):
    id: int
    direction: str | None
    information: str | None
    image_url: str | None
    image_describe: str | None
    question: str
    sample_answer: str | None
    section_id: int

class SpeakingQuestionCreate(BaseModel):
    direction: str | None
    information: str | None
    image_url: str | None
    image_describe: str | None
    question: str
    sample_answer: str | None
    section_id: int

    

    class Config:
        from_attributes = True
