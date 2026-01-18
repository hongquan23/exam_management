from sqlalchemy.orm import Session
from models.listening_question import ListeningQuestion

def get_by_section(db: Session, section_id: int):
    return db.query(ListeningQuestion)\
        .filter(ListeningQuestion.section_id == section_id)\
        .all()

def create(db: Session, data: dict):
    q = ListeningQuestion(**data)
    db.add(q)
    db.commit()
    db.refresh(q)
    return q

def delete(db: Session, question_id: int):
    q = db.query(ListeningQuestion)\
        .filter(ListeningQuestion.id == question_id).first()
    if q:
        db.delete(q)
        db.commit()
    return q
