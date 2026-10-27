from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Full name of user")
    email: EmailStr = Field(..., description="Unique user email address")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128, description="User password (will be securely hashed)")
    monthlySalary: Optional[Decimal] = Field(default=None, ge=0, description="Monthly salary in INR")
    monthlySavings: Optional[Decimal] = Field(default=None, ge=0, description="Target monthly savings in INR")
    alreadySavedAmount: Optional[Decimal] = Field(default=None, ge=0, description="Existing liquid savings in INR")
    firstGoalName: Optional[str] = Field(default=None, description="Initial financial goal name")
    firstGoalTarget: Optional[Decimal] = Field(default=None, ge=0, description="Initial goal target amount")
    firstGoalYear: Optional[str] = Field(default=None, description="Initial goal target year")
    firstGoalStartingAmount: Optional[Decimal] = Field(default=None, ge=0, description="Starting allocation from savings")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Registered email address")
    password: str = Field(..., min_length=1, description="Account password")

class UserResponse(UserBase):
    id: str
    createdAt: datetime
    access_token: Optional[str] = Field(default=None, description="JWT access token")
    token_type: Optional[str] = Field(default="bearer", description="Token type")

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

class TokenResponse(BaseModel):
    accessToken: str = Field(..., alias="access_token")
    tokenType: str = Field("bearer", alias="token_type")
    user: UserResponse

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )
