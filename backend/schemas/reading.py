from pydantic import BaseModel

class ReadingQuestionOut(BaseModel):
    id: int
    passage: str
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
 

class ReadingQuestionCreate(BaseModel):
    passage: str
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
  


    class Config:
        from_attributes = True
