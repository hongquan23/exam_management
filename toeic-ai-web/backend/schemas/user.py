from pydantic import BaseModel
from datetime import datetime
from pydantic import Field

class UserBase(BaseModel):
    name: str
    email: str
    role: str

class UserCreate(UserBase):
    password: str 

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
