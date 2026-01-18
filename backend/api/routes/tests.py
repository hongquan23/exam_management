from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.test import TestCreate, TestOut
from crud import test as test_crud

router = APIRouter()

@router.post("/", response_model=TestOut)
def create_test(test_in: TestCreate, db: Session = Depends(get_db)):
    return test_crud.create(db, test_in)

@router.get("/", response_model=list[TestOut])
def get_tests(db: Session = Depends(get_db)):
    return test_crud.get_all(db)
