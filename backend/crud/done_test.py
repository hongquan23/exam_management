from sqlalchemy.orm import Session
from models.done_test import DoneTest

def create(db: Session, user_id: int, test_id: int, correct: int, wrong: int):
    result = DoneTest(
        user_id=user_id,
        test_id=test_id,
        correct_answer=correct,
        false_answer=wrong
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result

def get_by_user(db: Session, user_id: int):
    return db.query(DoneTest)\
        .filter(DoneTest.user_id == user_id)\
        .all()
