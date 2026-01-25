from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.session import get_db
from crud import user_attempt as crud
from schemas.user_attempt import (
    UserAttemptCreate,
    UserAttemptUpdate,
    UserAttemptOut
)

router = APIRouter()

@router.post("/", response_model=UserAttemptOut)
def create_attempt(
    data: UserAttemptCreate,
    db: Session = Depends(get_db)
):
    exist = crud.get_by_question(db, data.question_id)
    if exist:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attempt already exists for this question"
        )

    return crud.create(db, data)

@router.get("/user/{user_id}", response_model=list[UserAttemptOut])
def get_attempts_by_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return crud.get_by_user(db, user_id)



@router.get("/question/{question_id}", response_model=UserAttemptOut)
def get_attempt_by_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    attempt = crud.get_by_question(db, question_id)
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return attempt



@router.put("/{attempt_id}", response_model=UserAttemptOut)
def update_attempt(
    attempt_id: int,
    data: UserAttemptUpdate,
    db: Session = Depends(get_db)
):
    attempt = crud.get_by_id(db, attempt_id)
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    return crud.update(db, attempt, data)




@router.delete("/{attempt_id}", status_code=204)
def delete_attempt(
    attempt_id: int,
    db: Session = Depends(get_db)
):
    attempt = crud.get_by_id(db, attempt_id)
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    crud.delete(db, attempt)
