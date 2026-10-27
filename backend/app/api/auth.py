from datetime import datetime, timezone, date as date_type
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.income import Income
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.transaction import Transaction
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
)

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

@auth_router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
def register_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
):
    """
    Register a new user in the PostgreSQL database.
    - Validates email format.
    - Rejects duplicate emails (400 Bad Request).
    - Securely hashes password via bcrypt.
    - Never returns or stores plaintext password or passwordHash.
    - Initializes financial baseline (incomes, expenses, goals, transactions) from onboarding.
    - Returns JWT access token for immediate session activation.
    """
    normalized_email = user_in.email.lower().strip()

    # Check for existing duplicate email
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists.",
        )

    # Hash password securely
    hashed_password = get_password_hash(user_in.password)

    # Create new User model instance
    now_utc = datetime.now(timezone.utc)
    new_user = User(
        name=user_in.name.strip(),
        email=normalized_email,
        passwordHash=hashed_password,
        createdAt=now_utc,
    )

    db.add(new_user)
    db.flush()

    today_date = date_type.today()

    # 1. Previous Savings & Liquid Reserves Baseline
    if user_in.alreadySavedAmount and user_in.alreadySavedAmount > Decimal("0.00"):
        prev_income = Income(
            userId=new_user.id,
            source="Previous Savings & Liquid Reserves",
            amount=user_in.alreadySavedAmount,
            date=today_date,
        )
        db.add(prev_income)

        prev_txn = Transaction(
            userId=new_user.id,
            type="income",
            description="Previous Savings & Liquid Reserves",
            amount=user_in.alreadySavedAmount,
            category="Savings",
            date=today_date,
            source="Previous Savings & Liquid Reserves",
        )
        db.add(prev_txn)

    # 2. Monthly Salary & Professional Income Stream
    if user_in.monthlySalary and user_in.monthlySalary > Decimal("0.00"):
        salary_income = Income(
            userId=new_user.id,
            source="Monthly Salary & Professional Income",
            amount=user_in.monthlySalary,
            date=today_date,
        )
        db.add(salary_income)

        salary_txn = Transaction(
            userId=new_user.id,
            type="income",
            description="Monthly Salary & Professional Income",
            amount=user_in.monthlySalary,
            category="Income",
            date=today_date,
            source="Salary Account",
        )
        db.add(salary_txn)

    # 3. Monthly Living Expenses (Monthly Salary - Target Monthly Savings)
    if user_in.monthlySalary is not None and user_in.monthlySavings is not None:
        living_expense_amt = max(Decimal("0.00"), user_in.monthlySalary - user_in.monthlySavings)
        if living_expense_amt > Decimal("0.00"):
            living_expense = Expense(
                userId=new_user.id,
                description="Monthly Household & Living Outflows",
                amount=living_expense_amt,
                category="Bills",
                date=today_date,
            )
            db.add(living_expense)

            living_txn = Transaction(
                userId=new_user.id,
                type="expense",
                description="Monthly Household & Living Outflows",
                amount=living_expense_amt,
                category="Bills",
                date=today_date,
                source="Living Budget",
            )
            db.add(living_txn)

    # 4. Primary Target Goal Allocation
    if user_in.firstGoalName and user_in.firstGoalTarget and user_in.firstGoalTarget > Decimal("0.00"):
        target_goal_date = date_type(2028, 12, 31)
        if user_in.firstGoalYear:
            year_str = str(user_in.firstGoalYear).strip()
            try:
                if len(year_str) == 4 and year_str.isdigit():
                    target_goal_date = date_type(int(year_str), 12, 31)
                elif "-" in year_str:
                    target_goal_date = datetime.strptime(year_str[:10], "%Y-%m-%d").date()
            except Exception:
                target_goal_date = date_type(2028, 12, 31)

        start_alloc = Decimal("0.00")
        if user_in.firstGoalStartingAmount and user_in.firstGoalStartingAmount > Decimal("0.00"):
            max_avail = user_in.alreadySavedAmount or Decimal("0.00")
            start_alloc = min(user_in.firstGoalStartingAmount, max_avail)

        monthly_contrib = (
            user_in.monthlySavings
            if (user_in.monthlySavings and user_in.monthlySavings > Decimal("0.00"))
            else Decimal("0.00")
        )

        goal = Goal(
            userId=new_user.id,
            name=user_in.firstGoalName.strip(),
            targetAmount=user_in.firstGoalTarget,
            currentAmount=start_alloc,
            targetDate=target_goal_date,
            monthlyContribution=monthly_contrib,
        )
        db.add(goal)

    db.commit()
    db.refresh(new_user)

    # Generate JWT access token for immediate seamless login
    access_token = create_access_token(subject=new_user.id)

    return UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        createdAt=new_user.createdAt,
        access_token=access_token,
        token_type="bearer",
    )

@auth_router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and return JWT access token",
)
def login_user(
    login_in: UserLogin,
    db: Session = Depends(get_db),
):
    """
    Authenticate user credentials.
    - Verifies password against stored bcrypt hash.
    - Returns JWT bearer access token with userId encoded as subject.
    - Returns safe UserResponse without exposing passwordHash.
    """
    normalized_email = login_in.email.lower().strip()

    user = db.query(User).filter(User.email == normalized_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(login_in.password, user.passwordHash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT token with user's ID as subject
    access_token = create_access_token(subject=user.id)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )

@auth_router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user identity",
)
def get_authenticated_user_profile(
    current_user: User = Depends(get_current_user),
):
    """
    Protected route demonstrating the reusable authentication dependency.
    Returns current user details excluding passwordHash.
    """
    return current_user
