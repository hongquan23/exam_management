from pydantic import BaseModel

class WritingQuestionOut(BaseModel):
    id: int
    image_url: str | None
    passage: str | None
    question: str
    sample_answer: str | None
    image_describe: str | None
    part: int   
    

class WritingQuestionCreate(BaseModel):
    image_url: str | None
    passage: str | None
    question: str
    sample_answer: str | None
    image_describe: str | None
    part: int
    

    

    class Config:
        from_attributes = True
