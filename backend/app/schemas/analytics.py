from decimal import Decimal
from typing import Annotated, List
from pydantic import BaseModel, ConfigDict, PlainSerializer

DecimalFloat = Annotated[
    Decimal,
    PlainSerializer(lambda x: float(x) if x is not None else 0.0, return_type=float),
]

class FinancialOverview(BaseModel):
    totalIncome: DecimalFloat
    totalExpenses: DecimalFloat
    availableSavings: DecimalFloat
    savingsRate: DecimalFloat

class CategoryBreakdownItem(BaseModel):
    category: str
    amount: DecimalFloat
    percentage: DecimalFloat

class MonthlyCashflowItem(BaseModel):
    month: str  # YYYY-MM format suitable for chronological charting
    income: DecimalFloat
    expenses: DecimalFloat
    savings: DecimalFloat

class InvestmentOverview(BaseModel):
    totalInvested: DecimalFloat
    currentValue: DecimalFloat
    gainLoss: DecimalFloat
    returnPercent: DecimalFloat

class AnalyticsSummaryResponse(BaseModel):
    overview: FinancialOverview
    categoryBreakdown: List[CategoryBreakdownItem]
    monthlyCashflow: List[MonthlyCashflowItem]
    investmentOverview: InvestmentOverview

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )
