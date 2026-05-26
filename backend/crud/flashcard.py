from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from models.flashcard import Flashcard
from schemas.flashcard import FlashcardCreate, FlashcardUpdate


def create(db: Session, user_id: int, data: FlashcardCreate) -> Flashcard:
    card = Flashcard(
        user_id=user_id,
        original_text=data.original_text,
        translated_text=data.translated_text,
        explanation=data.explanation,
        example=data.example,
        example_translation=data.example_translation,
        ipa=data.ipa,
        word_type=data.word_type,
        text_type=data.text_type or _infer_text_type(data.original_text),
        source_type=data.source_type,
        source_id=data.source_id,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


def get_by_user(
    db: Session,
    user_id: int,
    page: int = 1,
    page_size: int = 20,
    text_type: Optional[str] = None,
    search: Optional[str] = None,
) -> dict:
    q = db.query(Flashcard).filter(Flashcard.user_id == user_id)
    if text_type:
        q = q.filter(Flashcard.text_type == text_type)
    if search:
        pattern = f"%{search}%"
        q = q.filter(
            or_(
                Flashcard.original_text.ilike(pattern),
                Flashcard.translated_text.ilike(pattern),
            )
        )
    total = q.count()
    items = (
        q.order_by(Flashcard.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    total_pages = (total + page_size - 1) // page_size
    return {"items": items, "total": total, "page": page, "page_size": page_size, "total_pages": total_pages}


def get_by_id(db: Session, card_id: int, user_id: int) -> Optional[Flashcard]:
    return db.query(Flashcard).filter(Flashcard.id == card_id, Flashcard.user_id == user_id).first()


def update(db: Session, card: Flashcard, data: FlashcardUpdate) -> Flashcard:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(card, field, value)
    card.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(card)
    return card


def mark_known(db: Session, card: Flashcard, is_known: bool) -> Flashcard:
    card.is_known = is_known
    card.review_count += 1
    # Simple spaced repetition: double interval each time it's marked known
    interval_days = 1 if card.review_count <= 1 else min(2 ** (card.review_count - 1), 30)
    card.next_review = datetime.utcnow() + timedelta(days=interval_days)
    card.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(card)
    return card


def delete(db: Session, card: Flashcard) -> None:
    db.delete(card)
    db.commit()


def _infer_text_type(text: str) -> str:
    words = text.strip().split()
    if len(words) == 1:
        return "word"
    if len(words) <= 6:
        return "phrase"
    return "sentence"
