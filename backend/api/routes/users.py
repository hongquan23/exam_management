from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_db
from crud import user as user_crud
from schemas.user import UserOut

router = APIRouter()

@router.get("/", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db)):
    return user_crud.get_all(db)
