from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    source_type: str = "exam"
    source_id: Optional[int] = None


class TranslateResult(BaseModel):
    original_text: str
    translated_text: str
    word_type: Optional[str] = None
    text_type: str  # word | phrase | sentence
    ipa: Optional[str] = None
    example: Optional[str] = None
    example_translation: Optional[str] = None
    explanation: Optional[str] = None


class FlashcardCreate(BaseModel):
    original_text: str = Field(..., min_length=1, max_length=500)
    translated_text: Optional[str] = None
    explanation: Optional[str] = None
    example: Optional[str] = None
    example_translation: Optional[str] = None
    ipa: Optional[str] = None
    word_type: Optional[str] = None
    text_type: Optional[str] = None
    source_type: str = "exam"
    source_id: Optional[int] = None


class FlashcardUpdate(BaseModel):
    original_text: Optional[str] = None
    translated_text: Optional[str] = None
    explanation: Optional[str] = None
    example: Optional[str] = None
    example_translation: Optional[str] = None
    ipa: Optional[str] = None
    word_type: Optional[str] = None
    text_type: Optional[str] = None
    is_known: Optional[bool] = None


class FlashcardOut(BaseModel):
    id: int
    user_id: int
    original_text: str
    translated_text: Optional[str]
    explanation: Optional[str]
    example: Optional[str]
    example_translation: Optional[str]
    ipa: Optional[str]
    word_type: Optional[str]
    text_type: Optional[str]
    source_type: str
    source_id: Optional[int]
    is_known: bool
    review_count: int
    next_review: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FlashcardListResponse(BaseModel):
    items: list[FlashcardOut]
    total: int
    page: int
    page_size: int
    total_pages: int
