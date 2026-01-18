from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.listening import ListeningQuestionCreate, ListeningQuestionOut
from crud import listening as listening_crud

router = APIRouter()

@router.post("/", response_model=ListeningQuestionOut)
def create_question(q: ListeningQuestionCreate, db: Session = Depends(get_db)):
    return listening_crud.create(db, q)

@router.get("/section/{section_id}", response_model=list[ListeningQuestionOut])
def get_questions(section_id: int, db: Session = Depends(get_db)):
    return listening_crud.get_by_section(db, section_id)
