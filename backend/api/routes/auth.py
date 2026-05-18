from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.user import UserCreate, UserLogin, Token, ChangePassword, ForgotPasswordRequest, VerifyResetCode, ResetPassword
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

@router.put("/change-password/{user_id}")
def change_password(
    user_id: int,
    data: ChangePassword,
    db: Session = Depends(get_db)
):
    return auth_service.change_password(db, user_id, data)


@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    return auth_service.forgot_password(db, data.email)


@router.post("/verify-reset-code")
def verify_reset_code(data: VerifyResetCode):
    return auth_service.verify_forgot_code(data.email, data.code)


@router.post("/reset-password")
def reset_password(
    data: ResetPassword,
    db: Session = Depends(get_db)
):
    return auth_service.reset_password_with_code(db, data.email, data.code, data.new_password)
