from pydantic import BaseModel

class ReadingQuestionOut(BaseModel):
    id: int
    passage: str
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str | None

    class Config:
        from_attributes = True

class ReadingQuestionCreate(BaseModel):
    passage: str
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str | None = None

    class Config:
        from_attributes = True

class ReadingBulkUpload(BaseModel):
    title: str
    time_limit: int
    questions: list[ReadingQuestionCreate]
