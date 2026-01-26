from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.user import UserCreate, UserLogin, Token
from services import auth_service

router = APIRouter()


@router.post("/register")
def register(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    return auth_service.register_user(db, user_in)


@router.post("/login", response_model=Token)
def login(
    user_in: UserLogin,
    db: Session = Depends(get_db)
):
    return auth_service.login_user(db, user_in)
