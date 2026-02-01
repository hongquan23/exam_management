from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.listening import ListeningQuestionCreate, ListeningQuestionOut
from crud import listening as listening_crud

router = APIRouter()



@router.post(
    "/section/{section_id}",
    response_model=ListeningQuestionOut
)
def create_listening_question(
    section_id: int,
    q: ListeningQuestionCreate,
    db: Session = Depends(get_db)
):
    return listening_crud.create(
        db=db,
        data=q.dict(),
        section_id=section_id
    )



@router.get(
    "/section/{section_id}",
    response_model=list[ListeningQuestionOut]
)
def get_listening_questions_by_section(
    section_id: int,
    db: Session = Depends(get_db)
):
    return listening_crud.get_by_section(db, section_id)


@router.delete("/{question_id}")
def delete_listening_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    q = listening_crud.delete(db, question_id)
    if not q:
        raise HTTPException(status_code=404, detail="Listening question not found")
    return {"message": "Deleted successfully"}
