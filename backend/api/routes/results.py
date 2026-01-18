from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.done_test import DoneTestCreate, DoneTestOut
from crud import done_test as done_test_crud

router = APIRouter()

@router.post("/", response_model=DoneTestOut)
def submit_test(data: DoneTestCreate, db: Session = Depends(get_db)):
    return done_test_crud.create(db, data)

@router.get("/user/{user_id}", response_model=list[DoneTestOut])
def get_results(user_id: int, db: Session = Depends(get_db)):
    return done_test_crud.get_by_user(db, user_id)
