from fastapi import APIRouter, Depends, HTTPException, Request, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from api.deps import get_db
from crud import flashcard as crud
from schemas.flashcard import FlashcardCreate, FlashcardUpdate, FlashcardOut, FlashcardListResponse

router = APIRouter()


def _get_user_id(request: Request) -> int:
    user = request.state.user
    uid = user.get("sub") or user.get("user_id")
    if not uid:
        raise HTTPException(status_code=401, detail="Không xác định được user.")
    return int(uid)


@router.post("/", response_model=FlashcardOut, status_code=status.HTTP_201_CREATED)
def create_flashcard(request: Request, body: FlashcardCreate, db: Session = Depends(get_db)):
    user_id = _get_user_id(request)
    return crud.create(db, user_id=user_id, data=body)


@router.get("/", response_model=FlashcardListResponse)
def list_flashcards(
    request: Request,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    text_type: Optional[str] = Query(None, description="word | phrase | sentence"),
    search: Optional[str] = Query(None, description="Search in original or translated text"),
):
    user_id = _get_user_id(request)
    result = crud.get_by_user(
        db, user_id=user_id, page=page, page_size=page_size,
        text_type=text_type, search=search,
    )
    return FlashcardListResponse(**result)


@router.get("/{card_id}", response_model=FlashcardOut)
def get_flashcard(card_id: int, request: Request, db: Session = Depends(get_db)):
    user_id = _get_user_id(request)
    card = crud.get_by_id(db, card_id=card_id, user_id=user_id)
    if not card:
        raise HTTPException(status_code=404, detail="Không tìm thấy flashcard.")
    return card


@router.put("/{card_id}", response_model=FlashcardOut)
def update_flashcard(card_id: int, request: Request, body: FlashcardUpdate, db: Session = Depends(get_db)):
    user_id = _get_user_id(request)
    card = crud.get_by_id(db, card_id=card_id, user_id=user_id)
    if not card:
        raise HTTPException(status_code=404, detail="Không tìm thấy flashcard.")
    return crud.update(db, card=card, data=body)


@router.patch("/{card_id}/mark", response_model=FlashcardOut)
def mark_flashcard(
    card_id: int,
    request: Request,
    db: Session = Depends(get_db),
    is_known: bool = Query(...),
):
    user_id = _get_user_id(request)
    card = crud.get_by_id(db, card_id=card_id, user_id=user_id)
    if not card:
        raise HTTPException(status_code=404, detail="Không tìm thấy flashcard.")
    return crud.mark_known(db, card=card, is_known=is_known)


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard(card_id: int, request: Request, db: Session = Depends(get_db)):
    user_id = _get_user_id(request)
    card = crud.get_by_id(db, card_id=card_id, user_id=user_id)
    if not card:
        raise HTTPException(status_code=404, detail="Không tìm thấy flashcard.")
    crud.delete(db, card=card)
