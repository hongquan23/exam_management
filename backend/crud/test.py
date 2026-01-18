from sqlalchemy.orm import Session
from models.test import Test
from schemas.test import TestBase

def get_all(db: Session):
    return db.query(Test).all()

def get_by_id(db: Session, test_id: int):
    return db.query(Test).filter(Test.id == test_id).first()

def create(db: Session, test_in: TestBase):
    test = Test(**test_in.dict())
    db.add(test)
    db.commit()
    db.refresh(test)
    return test

def delete(db: Session, test_id: int):
    test = get_by_id(db, test_id)
    if test:
        db.delete(test)
        db.commit()
    return test


