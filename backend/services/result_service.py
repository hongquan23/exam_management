from sqlalchemy.orm import Session
from fastapi import HTTPException

from crud import done_test as done_test_crud
from crud import test as test_crud

def get_test_result(db: Session, done_test_id: int):
    done_test = done_test_crud.get_by_id(db, done_test_id)
    if not done_test:
        raise HTTPException(status_code=404, detail="Result not found")

    test = test_crud.get_by_id(db, done_test.test_id)

    return {
        "test": test,
        "result": done_test
    }


def get_user_results(db: Session, user_id: int):
    return done_test_crud.get_by_user_id(db, user_id)
