from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from crud import user as user_crud
from schemas.user import UserCreate, UserLogin
from core.security import (
    hash_password,
    verify_password,
    create_access_token
)

def register_user(db: Session, user_in: UserCreate):
    if user_crud.get_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )

    password_hash = hash_password(user_in.password)
    return user_crud.create(db, user_in, password_hash)


def login_user(db: Session, user_in: UserLogin):
    user = user_crud.get_by_email(db, user_in.email)
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
