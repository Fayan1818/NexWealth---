from decimal import Decimal
from typing import Annotated
from pydantic import BaseModel, Field, ConfigDict, PlainSerializer

DecimalFloat = Annotated[
    Decimal,
    PlainSerializer(lambda x: float(x) if x is not None else 0.0, return_type=float),
]

class DashboardSummaryResponse(BaseModel):
    totalIncome: DecimalFloat = Field(
        ...,
        description="Total income amount in INR",
    )
    totalExpenses: DecimalFloat = Field(
        ...,
        description="Total expenses amount in INR",
    )
    availableSavings: DecimalFloat = Field(
        ...,
        description="Available savings amount (totalIncome - totalExpenses) in INR",
    )
    savingsRate: DecimalFloat = Field(
        ...,
        description="Savings rate percentage ((availableSavings / totalIncome) * 100)",
    )
    previousSavings: DecimalFloat = Field(
        default=Decimal("0.00"),
        description="Previous savings pool amount in INR",
    )
    monthlySalary: DecimalFloat = Field(
        default=Decimal("0.00"),
        description="Monthly salary in INR",
    )

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )
