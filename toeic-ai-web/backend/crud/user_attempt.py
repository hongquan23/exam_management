from sqlalchemy.orm import Session
from models.user_attempt import UserAttempt
from schemas.user_attempt import UserAttemptCreate, UserAttemptUpdate


def create(db: Session, data: UserAttemptCreate):
    attempt = UserAttempt(**data.dict())
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt


def get_by_id(db: Session, attempt_id: int):
    return db.query(UserAttempt).filter(UserAttempt.id == attempt_id).first()


def get_by_user(db: Session, user_id: int):
    return (
        db.query(UserAttempt)
        .filter(UserAttempt.user_id == user_id)
        .order_by(UserAttempt.created_at.desc())
        .all()
    )


def get_by_question(db: Session, question_id: int):
    return (
        db.query(UserAttempt)
        .filter(UserAttempt.question_id == question_id)
        .first()
    )


def update(db: Session, attempt: UserAttempt, data: UserAttemptUpdate):
    for field, value in data.dict(exclude_unset=True).items():
        setattr(attempt, field, value)

    db.commit()
    db.refresh(attempt)
    return attempt


def delete(db: Session, attempt: UserAttempt):
    db.delete(attempt)
    db.commit()
