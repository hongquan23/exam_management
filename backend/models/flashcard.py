from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from db.base import Base


class Flashcard(Base):
    __tablename__ = "flashcard"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, index=True)
    original_text = Column(Text, nullable=False)
    translated_text = Column(Text)
    explanation = Column(Text)
    example = Column(Text)
    example_translation = Column(Text)
    ipa = Column(String(300))
    word_type = Column(String(50))   # noun / verb / adjective / phrase / sentence …
    text_type = Column(String(20))   # word | phrase | sentence  (for filtering)
    source_type = Column(String(50), default="exam")  # exam | chatbot | article
    source_id = Column(Integer, nullable=True)
    is_known = Column(Boolean, default=False)
    review_count = Column(Integer, default=0)
    next_review = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
