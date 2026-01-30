from pydantic import BaseModel

class ListeningQuestionOut(BaseModel):
    id: int
    passage: str | None
    question: str
    audio_url: str | None
    image_url: str | None
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    section_id: int

class ListeningQuestionCreate(BaseModel):
    passage: str | None
    question: str
    audio_url: str | None
    image_url: str | None
    option_a: str   
    option_b: str
    option_c: str
    option_d: str
    section_id: int

    

    class Config:
        from_attributes = True
