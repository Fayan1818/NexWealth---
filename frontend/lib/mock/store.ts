/**
 * Dynamic Multi-User Financial State & Mock Store
 * - Demo account: demoreal@gmail.com / demoreal (password: demoreal@123) retains full static demo dataset.
 * - New accounts: Start with zero values (or custom onboarding baseline), strictly dynamic calculations.
 * - Savings allocation: Investments and Goal starting amounts are deducted from the user's actual savings pool.
 * - AI Advisor: Highly detailed, personalized financial intelligence tailored to real user goals.
 */

import {
  Income,
  Expense,
  Transaction,
  Goal,
  Document,
  BankStatement,
  Investment,
  Notification,
} from "@/types/contract";
import { UserProfile } from "@/types/profile";
import { DashboardSummary } from "@/types/dashboard";
import { AnalyticsSummary } from "@/types/analytics";
import {
  AdvisorInsightsResponse,
  AdvisorQueryResponse,
  AdvisorInsightCard,
  FinancialContextSummary,
  ChatMessage,
} from "@/types/ai_advisor";
import { AuthUtils } from "@/lib/auth/jwt";

export interface UserFinancialMeta {
  monthlySalary: number;
  monthlySavings: number;
  monthlyExpenses: number;
  initialSavingsPool: number; // e.g. 5,00,000 already saved
}

const STORAGE_PREFIX = "nexwealth_store_v2_";

function getActiveUserIdentifier(): string {
  const user = AuthUtils.getUser();
  if (!user || !user.email) {
    return "demoreal@gmail.com";
  }
  return user.email.toLowerCase().trim();
}

export function isDemoAccount(email?: string): boolean {
  const target = (email || getActiveUserIdentifier()).toLowerCase().trim();
  return (
    target === "demoreal@gmail.com" ||
    target === "demoreal" ||
    target === "demo@example.com"
  );
}

function getStorage<T>(userKey: string, key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const fullKey = `${STORAGE_PREFIX}${userKey}_${key}`;
    const item = localStorage.getItem(fullKey);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(userKey: string, key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    const fullKey = `${STORAGE_PREFIX}${userKey}_${key}`;
    localStorage.setItem(fullKey, JSON.stringify(value));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

// -------------------------------------------------------------
// DEMO DATASET (Exclusively for demoreal / demoreal@gmail.com)
// -------------------------------------------------------------
const DEMO_INCOMES: Income[] = [
  {
    id: "inc_001",
    userId: "usr_demoreal",
    source: "Monthly Tech Salary",
    amount: 185000,
    date: "2026-10-01",
    createdAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "inc_002",
    userId: "usr_demoreal",
    source: "Software Consulting Retainer",
    amount: 65000,
    date: "2026-10-05",
    createdAt: "2026-10-05T11:30:00.000Z",
  },
  {
    id: "inc_003",
    userId: "usr_demoreal",
    source: "Mutual Fund Dividend (Quarterly)",
    amount: 18500,
    date: "2026-10-08",
    createdAt: "2026-10-08T14:15:00.000Z",
  },
];

const DEMO_EXPENSES: Expense[] = [
  {
    id: "exp_001",
    userId: "usr_demoreal",
    description: "Supermarket Grocery & Household Supplies",
    amount: 14200,
    category: "Food",
    date: "2026-10-03",
    createdAt: "2026-10-03T10:15:00.000Z",
  },
  {
    id: "exp_002",
    userId: "usr_demoreal",
    description: "Apartment Electricity & Utility Maintenance",
    amount: 6800,
    category: "Bills",
    date: "2026-10-05",
    createdAt: "2026-10-05T12:00:00.000Z",
  },
  {
    id: "exp_003",
    userId: "usr_demoreal",
    description: "Weekend Fine Dining & Bistro",
    amount: 4500,
    category: "Food",
    date: "2026-10-07",
    createdAt: "2026-10-07T20:30:00.000Z",
  },
  {
    id: "exp_004",
    userId: "usr_demoreal",
    description: "Uber & Metro Card Commute",
    amount: 3400,
    category: "Transport",
    date: "2026-10-08",
    createdAt: "2026-10-08T09:45:00.000Z",
  },
];

const DEMO_GOALS: Goal[] = [
  {
    id: "gol_001",
    userId: "usr_demoreal",
    name: "Emergency Reserve Fund (6 Months)",
    targetAmount: 600000,
    currentAmount: 450000,
    targetDate: "2027-03-31",
    monthlyContribution: 35000,
    createdAt: "2026-08-01T08:00:00.000Z",
  },
  {
    id: "gol_002",
    userId: "usr_demoreal",
    name: "Tata Harrier EV Down Payment",
    targetAmount: 800000,
    currentAmount: 380000,
    targetDate: "2027-08-15",
    monthlyContribution: 40000,
    createdAt: "2026-08-15T10:00:00.000Z",
  },
];

const DEMO_INVESTMENTS: Investment[] = [
  {
    id: "inv_001",
    userId: "usr_demoreal",
    name: "Parag Parikh Flexi Cap Fund Direct-G",
    type: "Mutual Fund",
    investedAmount: 350000,
    currentValue: 472500,
    date: "2025-06-15",
    createdAt: "2025-06-15T10:00:00.000Z",
  },
  {
    id: "inv_002",
    userId: "usr_demoreal",
    name: "UTI Nifty 50 Index Fund Direct Growth",
    type: "Mutual Fund",
    investedAmount: 400000,
    currentValue: 512000,
    date: "2025-04-10",
    createdAt: "2025-04-10T10:00:00.000Z",
  },
];

const DEMO_DOCUMENTS: Document[] = [
  {
    id: "doc_001",
    userId: "usr_demoreal",
    fileName: "ITR_Acknowledgement_AY2026_27.pdf",
    documentType: "Tax Return",
    status: "verified",
    uploadedAt: "2026-08-10T11:00:00.000Z",
    createdAt: "2026-08-10T11:00:00.000Z",
  },
];

const DEMO_STATEMENTS: BankStatement[] = [
  {
    id: "bst_001",
    userId: "usr_demoreal",
    fileName: "HDFC_Salary_Account_Sep2026.pdf",
    accountName: "HDFC Salary Account (..4081)",
    status: "parsed",
    uploadedAt: "2026-10-02T09:30:00.000Z",
    createdAt: "2026-10-02T09:30:00.000Z",
  },
];

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "ntf_001",
    userId: "usr_demoreal",
    type: "budget_alert",
    title: "Food Budget Milestone Reached",
    message: "You have utilized ₹18,700 of your ₹22,000 monthly food allowance.",
    isRead: false,
    createdAt: "2026-10-12T18:30:00.000Z",
  },
];

export class MockStore {
  // Financial metadata (Monthly Salary, Monthly Savings, Initial Liquid Savings)
  static getUserFinancialMeta(): UserFinancialMeta {
    const user = AuthUtils.getUser();
    const email = getActiveUserIdentifier();
    if (isDemoAccount(email)) {
      return {
        monthlySalary: 268500,
        monthlySavings: 85000,
        monthlyExpenses: 28900,
        initialSavingsPool: 1600000,
      };
    }
    return getStorage<UserFinancialMeta>(email, "meta", {
      monthlySalary: user?.monthlySalary || 0,
      monthlySavings: user?.monthlySavings || 0,
      monthlyExpenses: user?.monthlyExpenses || 0,
      initialSavingsPool: user?.initialSavingsPool || 0,
    });
  }

  static setUserFinancialMeta(meta: UserFinancialMeta): void {
    const email = getActiveUserIdentifier();
    setStorage(email, "meta", meta);
  }

  // ---------------- Incomes ----------------
  static getIncomes(): Income[] {
    const email = getActiveUserIdentifier();
    if (isDemoAccount(email)) {
      return getStorage("demoreal", "incomes", DEMO_INCOMES);
    }
    return getStorage(email, "incomes", []);
  }

  static setIncomes(data: Income[]): void {
    const email = getActiveUserIdentifier();
    setStorage(isDemoAccount(email) ? "demoreal" : email, "incomes", data);
  }

  // ---------------- Expenses ----------------
  static getExpenses(): Expense[] {
    const email = getActiveUserIdentifier();
    if (isDemoAccount(email)) {
      return getStorage("demoreal", "expenses", DEMO_EXPENSES);
    }
    return getStorage(email, "expenses", []);
  }

  static setExpenses(data: Expense[]): void {
    const email = getActiveUserIdentifier();
    setStorage(isDemoAccount(email) ? "demoreal" : email, "expenses", data);
  }

  // ---------------- Goals ----------------
  static getGoals(): Goal[] {
    const email = getActiveUserIdentifier();
    if (isDemoAccount(email)) {
      return getStorage("demoreal", "goals", DEMO_GOALS);
    }
    return getStorage(email, "goals", []);
  }

  static setGoals(data: Goal[]): void {
    const email = getActiveUserIdentifier();
    setStorage(isDemoAccount(email) ? "demoreal" : email, "goals", data);
  }

  // ---------------- Investments ----------------
  static getInvestments(): Investment[] {
    const email = getActiveUserIdentifier();
    if (isDemoAccount(email)) {
      return getStorage("demoreal", "investments", DEMO_INVESTMENTS);
    }
    return getStorage(email, "investments", []);
  }

  static setInvestments(data: Investment[]): void {
    const email = getActiveUserIdentifier();
    setStorage(isDemoAccount(email) ? "demoreal" : email, "investments", data);
  }

  // ---------------- Documents ----------------
  static getDocuments(): Document[] {
    const email = getActiveUserIdentifier();
    if (isDemoAccount(email)) {
      return getStorage("demoreal", "documents", DEMO_DOCUMENTS);
    }
    return getStorage(email, "documents", []);
  }

  static setDocuments(data: Document[]): void {
    const email = getActiveUserIdentifier();
    setStorage(isDemoAccount(email) ? "demoreal" : email, "documents", data);
  }

  // ---------------- Bank Statements ----------------
  static getStatements(): BankStatement[] {
    const email = getActiveUserIdentifier();
    if (isDemoAccount(email)) {
      return getStorage("demoreal", "statements", DEMO_STATEMENTS);
    }
    return getStorage(email, "statements", []);
  }

  static setStatements(data: BankStatement[]): void {
    const email = getActiveUserIdentifier();
    setStorage(isDemoAccount(email) ? "demoreal" : email, "statements", data);
  }

  // ---------------- Notifications ----------------
  static getNotifications(): Notification[] {
    const email = getActiveUserIdentifier();
    if (isDemoAccount(email)) {
      return getStorage("demoreal", "notifications", DEMO_NOTIFICATIONS);
    }
    return getStorage(email, "notifications", []);
  }

  static setNotifications(data: Notification[]): void {
    const email = getActiveUserIdentifier();
    setStorage(isDemoAccount(email) ? "demoreal" : email, "notifications", data);
  }

  // ---------------- User Profile ----------------
  static getProfile(): UserProfile {
    const user = AuthUtils.getUser();
    const email = getActiveUserIdentifier();
    if (isDemoAccount(email)) {
      return {
        id: "usr_demoreal",
        name: "demoreal",
        email: "demoreal@gmail.com",
        createdAt: "2026-10-01T08:00:00.000Z",
      };
    }
    return (
      getStorage<UserProfile | null>(email, "profile", null) || {
        id: user?.id || "usr_new",
        name: user?.name || "New User",
        email: user?.email || email,
        createdAt: new Date().toISOString(),
      }
    );
  }

  static setProfile(data: UserProfile): void {
    const email = getActiveUserIdentifier();
    setStorage(isDemoAccount(email) ? "demoreal" : email, "profile", data);
  }

  // ---------------- Available Savings Calculations ----------------
  /**
   * Calculates the unallocated liquid savings available to the user for:
   * 1. Allocating starting capital to a new Goal (deducts from savings)
   * 2. Making a new Investment (deducts investedAmount from savings)
   * 3. Adding net valuation gains when currentValue > investedAmount
   * 4. Deducting monthly contributions
   *
   * Formula:
   * Total Liquid Base = initialSavingsPool + (totalIncome - totalExpenses)
   * Deductions = sum(goal.currentAmount) + sum(investment.investedAmount)
   * Net Gains = sum(max(0, investment.currentValue - investment.investedAmount))
   * Available Savings = max(0, Total Liquid Base - Deductions + Net Gains)
   */
  static getSavingsOverview() {
    const meta = this.getUserFinancialMeta();
    const incomes = this.getIncomes();
    const expenses = this.getExpenses();
    const goals = this.getGoals();
    const investments = this.getInvestments();

    const totalIncome = incomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const cashflowSavings = totalIncome - totalExpenses;

    const initialSavings = meta.initialSavingsPool || 0;
    const totalLiquidBase = initialSavings + cashflowSavings;

    const allocatedToGoals = goals.reduce((sum, g) => sum + (Number(g.currentAmount) || 0), 0);

    let totalInvested = 0;
    let totalNetGain = 0;
    for (const inv of investments) {
      const invested = Number(inv.investedAmount) || 0;
      const current = Number(inv.currentValue) || 0;
      totalInvested += invested;
      if (current > invested) {
        totalNetGain += (current - invested);
      }
    }

    const unallocatedSavings = Math.max(
      0,
      totalLiquidBase - allocatedToGoals - totalInvested + totalNetGain
    );

    // Monthly savings buffer
    const monthlyIncome = totalIncome;
    const monthlyExpense = totalExpenses;
    const monthlySavings = meta.monthlySavings || Math.max(0, monthlyIncome - monthlyExpense);
    const allocatedMonthlyToGoals = goals.reduce(
      (sum, g) => sum + (Number(g.monthlyContribution) || 0),
      0
    );
    const unallocatedMonthlySavings = Math.max(0, monthlySavings - allocatedMonthlyToGoals);

    return {
      initialSavingsPool: initialSavings,
      totalIncome,
      totalExpenses,
      cashflowSavings,
      totalLiquidBase,
      allocatedToGoals,
      totalInvested,
      totalNetGain,
      unallocatedSavings,
      monthlySavings,
      allocatedMonthlyToGoals,
      unallocatedMonthlySavings,
    };
  }

  // ---------------- Unified Transactions Ledger ----------------
  static getTransactions(): Transaction[] {
    const incomes = this.getIncomes();
    const expenses = this.getExpenses();

    const incomeTxns: Transaction[] = incomes.map((inc) => ({
      id: `txn_${inc.id}`,
      userId: inc.userId,
      type: "income" as const,
      description: inc.source,
      amount: inc.amount,
      category: inc.source,
      date: inc.date,
      source: "Salary / Bank Deposit",
      createdAt: inc.createdAt,
    }));

    const expenseTxns: Transaction[] = expenses.map((exp) => ({
      id: `txn_${exp.id}`,
      userId: exp.userId,
      type: "expense" as const,
      description: exp.description,
      amount: exp.amount,
      category: exp.category,
      date: exp.date,
      source: "UPI / Living Expense",
      createdAt: exp.createdAt,
    }));

    const combined = [...incomeTxns, ...expenseTxns];
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return combined;
  }

  // ---------------- Dashboard Summary ----------------
  static getDashboardSummary(): DashboardSummary {
    const savings = this.getSavingsOverview();
    const meta = this.getUserFinancialMeta();
    const availableSavings = savings.unallocatedSavings;
    const totalIncome = savings.totalIncome;
    const totalExpenses = savings.totalExpenses;
    const savingsRate =
      totalIncome > 0
        ? (availableSavings / totalIncome) * 100
        : availableSavings > 0
        ? 100
        : 0;

    return {
      totalIncome,
      totalExpenses,
      availableSavings,
      savingsRate,
      previousSavings: meta.initialSavingsPool || 0,
      monthlySalary: meta.monthlySalary || 0,
    };
  }

  // ---------------- Analytics Summary ----------------
  static getAnalyticsSummary(): AnalyticsSummary {
    const dashboard = this.getDashboardSummary();
    const expenses = this.getExpenses();
    const investments = this.getInvestments();
    const email = getActiveUserIdentifier();

    const catMap: Record<string, number> = {};
    for (const exp of expenses) {
      catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount;
    }
    const categoryBreakdown = Object.entries(catMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: dashboard.totalExpenses > 0 ? (amount / dashboard.totalExpenses) * 100 : 0,
    }));
    categoryBreakdown.sort((a, b) => b.amount - a.amount);

    let monthlyCashflow = [];
    if (isDemoAccount(email)) {
      monthlyCashflow = [
        { month: "May", income: 210000, expenses: 78000, savings: 132000 },
        { month: "Jun", income: 225000, expenses: 84000, savings: 141000 },
        { month: "Jul", income: 215000, expenses: 91000, savings: 124000 },
        { month: "Aug", income: 240000, expenses: 88000, savings: 152000 },
        { month: "Sep", income: 260000, expenses: 95000, savings: 165000 },
        {
          month: "Oct",
          income: dashboard.totalIncome,
          expenses: dashboard.totalExpenses,
          savings: dashboard.availableSavings,
        },
      ];
    } else {
      // Dynamic multi-month projection for actual user based on real metrics
      const inc = dashboard.totalIncome;
      const exp = dashboard.totalExpenses;
      const sav = dashboard.availableSavings;

      monthlyCashflow = [
        {
          month: "Jun",
          income: Math.round(inc * 0.88),
          expenses: Math.round(exp * 0.92),
          savings: Math.max(0, Math.round(sav * 0.85)),
        },
        {
          month: "Jul",
          income: Math.round(inc * 0.92),
          expenses: Math.round(exp * 0.95),
          savings: Math.max(0, Math.round(sav * 0.9)),
        },
        {
          month: "Aug",
          income: Math.round(inc * 0.95),
          expenses: Math.round(exp * 0.94),
          savings: Math.max(0, Math.round(sav * 0.96)),
        },
        {
          month: "Sep",
          income: Math.round(inc * 0.98),
          expenses: Math.round(exp * 0.98),
          savings: Math.max(0, Math.round(sav * 0.98)),
        },
        {
          month: "Current",
          income: inc,
          expenses: exp,
          savings: sav,
        },
      ];
    }

    const totalInvested = investments.reduce((sum, inv) => sum + (Number(inv.investedAmount) || 0), 0);
    const currentValue = investments.reduce((sum, inv) => sum + (Number(inv.currentValue) || 0), 0);
    const gainLoss = currentValue - totalInvested;
    const returnPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

    return {
      overview: {
        totalIncome: dashboard.totalIncome,
        totalExpenses: dashboard.totalExpenses,
        availableSavings: dashboard.availableSavings,
        savingsRate: dashboard.savingsRate,
      },
      categoryBreakdown,
      monthlyCashflow,
      investmentOverview: {
        totalInvested,
        currentValue,
        gainLoss,
        returnPercent,
      },
    };
  }

  // ---------------- AI Advisor Financial Intelligence ----------------
  static getAdvisorSummary(): FinancialContextSummary {
    const dash = this.getDashboardSummary();
    const investments = this.getInvestments();
    const goals = this.getGoals();
    const expenses = this.getExpenses();

    const totalInvestments = investments.reduce((sum, i) => sum + (Number(i.currentValue) || 0), 0);
    const totalGoalsTarget = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);
    const totalGoalsSaved = goals.reduce((sum, g) => sum + (Number(g.currentAmount) || 0), 0);

    const catMap: Record<string, number> = {};
    for (const exp of expenses) {
      catMap[exp.category] = (catMap[exp.category] || 0) + (Number(exp.amount) || 0);
    }
    let topExpenseCategory = "Living / Bills";
    let maxSpent = 0;
    for (const [c, amt] of Object.entries(catMap)) {
      if (amt > maxSpent) {
        maxSpent = amt;
        topExpenseCategory = c;
      }
    }

    return {
      totalIncome: dash.totalIncome,
      totalExpenses: dash.totalExpenses,
      availableSavings: dash.availableSavings,
      savingsRate: dash.savingsRate,
      totalInvestments,
      totalGoalsTarget,
      totalGoalsSaved,
      topExpenseCategory,
    };
  }

  static getAdvisorInsights(): AdvisorInsightsResponse {
    const summary = this.getAdvisorSummary();
    const goals = this.getGoals();
    const savings = this.getSavingsOverview();

    // Check if user has a vehicle or big ticket goal
    const carGoal = goals.find(
      (g) =>
        g.name.toLowerCase().includes("car") ||
        g.name.toLowerCase().includes("vehicle") ||
        g.targetAmount >= 1000000
    );

    const insights: AdvisorInsightCard[] = [];

    if (carGoal) {
      const remainingAmount = Math.max(0, carGoal.targetAmount - carGoal.currentAmount);
      insights.push({
        id: "ins_car",
        type: "strategy",
        title: `Vehicle Milestone: ${carGoal.name}`,
        description: `Targeting ₹${carGoal.targetAmount.toLocaleString("en-IN")}. You have allocated ₹${carGoal.currentAmount.toLocaleString("en-IN")}. At ₹${(carGoal.monthlyContribution || savings.monthlySavings).toLocaleString("en-IN")}/mo savings, you will bridge the ₹${remainingAmount.toLocaleString("en-IN")} gap smoothly.`,
        tag: "Priority Goal",
        impact: `Target: ₹${carGoal.targetAmount.toLocaleString("en-IN")}`,
      });
    }

    insights.push({
      id: "ins_savings_flow",
      type: "optimization",
      title: "Monthly Savings Allocation & Investment",
      description: `Your monthly savings are ₹${savings.monthlySavings.toLocaleString("en-IN")} (out of ₹${savings.totalIncome.toLocaleString("en-IN")} salary). Investing from this monthly savings into a 10-12% Index SIP compounds aggressively while protecting your living budget.`,
      tag: "Budget Discipline",
      impact: `+₹${savings.monthlySavings.toLocaleString("en-IN")}/mo Growth`,
    });

    insights.push({
      id: "ins_liquid_buffer",
      type: "achievement",
      title: "Liquid Wealth Security Buffer",
      description: `You have ₹${savings.unallocatedSavings.toLocaleString("en-IN")} in unallocated liquid savings remaining for emergency reserves and immediate opportunities.`,
      tag: "Capital Safety",
      impact: "Safe Reserves",
    });

    return {
      insights,
      summary,
    };
  }

  static queryAdvisor(message: string, history?: ChatMessage[]): AdvisorQueryResponse {
    const summary = this.getAdvisorSummary();
    const savings = this.getSavingsOverview();
    const goals = this.getGoals();
    const investments = this.getInvestments();
    const user = AuthUtils.getUser();
    const query = message.toLowerCase().trim();

    const carGoal = goals.find(
      (g) =>
        g.name.toLowerCase().includes("car") ||
        g.name.toLowerCase().includes("vehicle") ||
        g.targetAmount >= 1000000
    );

    let reply = "";

    // 1. Vehicle / Car Purchase Scenario (e.g. ₹15L by 2028 or any vehicle goal)
    if (
      query.includes("car") ||
      query.includes("15") ||
      query.includes("2028") ||
      query.includes("vehicle") ||
      query.includes("auto")
    ) {
      const targetPrice = carGoal ? carGoal.targetAmount : 1500000;
      const initialSaved = savings.initialSavingsPool || 500000;
      const allocatedInitial = carGoal ? carGoal.currentAmount : 350000;
      const monthlySave = savings.monthlySavings || 30000;
      const monthlyExp = savings.totalExpenses || 70000;

      const remainingAfterAllocation = Math.max(0, initialSaved - allocatedInitial);
      const shortfall = Math.max(0, targetPrice - allocatedInitial);
      const monthsTo2028 = 26; // approx 26 months to end of 2028
      const cashSavedBy2028 = monthlySave * monthsTo2028;
      const totalCorpusAt2028 = allocatedInitial + cashSavedBy2028;
      const financingNeeded = Math.max(0, targetPrice - totalCorpusAt2028);

      reply = `### Comprehensive 2028 Car Acquisition Blueprint (₹${targetPrice.toLocaleString("en-IN")} Target)

Hello **${user?.name || "Friend"}**! Here is your custom mathematical roadmap for buying your dream car by 2028:

---

#### 1. Current Financial Foundation
- **Monthly Inflow / Salary:** ₹${savings.totalIncome > 0 ? savings.totalIncome.toLocaleString("en-IN") : "1,00,000"}
- **Monthly Living Expenses:** ₹${monthlyExp.toLocaleString("en-IN")}
- **Monthly Savings Buffer:** ₹${monthlySave.toLocaleString("en-IN")} *(Savings Rate: ${summary.savingsRate > 0 ? summary.savingsRate.toFixed(1) : "30.0"}%)*
- **Total Initial Savings Pool:** ₹${initialSaved.toLocaleString("en-IN")}
- **Allocated Starting Capital:** ₹${allocatedInitial.toLocaleString("en-IN")} *(leaving **₹${remainingAfterAllocation.toLocaleString("en-IN")}** as an untouched emergency safety buffer)*

---

#### 2. Projection to 2028 (26 Months)
| Strategy Component | Value (INR) | Notes |
| :--- | :--- | :--- |
| **Initial Allocated Capital** | ₹${allocatedInitial.toLocaleString("en-IN")} | Seeded directly from your savings pool |
| **Pure Cash Saved (₹${(monthlySave / 1000).toFixed(0)}k × 26 mos)** | ₹${cashSavedBy2028.toLocaleString("en-IN")} | Direct monthly contribution from salary |
| **Projected Pure Cash Corpus** | **₹${totalCorpusAt2028.toLocaleString("en-IN")}** | Fully accumulated without market risk |
| **Shortfall to ₹${(targetPrice / 100000).toFixed(0)} Lakh** | ₹${financingNeeded.toLocaleString("en-IN")} | Easily bridged with the 3 options below |

---

#### 3. Recommended Multi-Pillar Action Plan
1. **Trim Discretionary Expenses by 10%:**
   - Reducing your **₹${monthlyExp.toLocaleString("en-IN")}** monthly expenses by just **₹7,000** increases your monthly savings to **₹${(monthlySave + 7000).toLocaleString("en-IN")}**.
   - Over 26 months, this generates an additional **₹1,82,000** in cash!

2. **Deploy Monthly Savings into a Moderate Hybrid SIP:**
   - Rather than letting monthly contributions sit idle in 3% savings, allocate ₹20,000/mo into a **Multi-Asset Allocation Fund** (~8-10% expected annual return).
   - This yields approximately **₹60,000 - ₹85,000** in compound returns by 2028.

3. **Smart Down Payment & Financing Strategy:**
   - In 2028, put down **₹10,50,000 - ₹11,00,000** as down payment from your accumulated corpus.
   - Finance the remaining **₹${financingNeeded.toLocaleString("en-IN")}** with a 36-month auto loan (~8.65% interest). The EMI will be just **~₹12,800/month**, which fits comfortably inside your monthly savings buffer without exhausting your liquid reserves!`;

    // 2. Investment Portfolio & Asset Allocation Queries
    } else if (
      query.includes("invest") ||
      query.includes("portfolio") ||
      query.includes("sip") ||
      query.includes("mutual fund") ||
      query.includes("stock") ||
      query.includes("equity")
    ) {
      const unalloc = savings.unallocatedSavings;
      const monthly = savings.monthlySavings;
      const totalInv = summary.totalInvestments;

      reply = `### Strategic Investment & Portfolio Roadmap

Hello **${user?.name || "Friend"}**! Here is an institutional-grade investment strategy calibrated to your live numbers:

---

#### 1. Available Capital for Deployment
- **Unallocated Liquid Savings Pool:** ₹${unalloc.toLocaleString("en-IN")}
- **Fresh Monthly Savings Flow:** ₹${monthly.toLocaleString("en-IN")}/month
- **Current Portfolio Valuation:** ₹${totalInv.toLocaleString("en-IN")}

---

#### 2. Recommended Asset Allocation Matrix
| Asset Class | Target Weight | Monthly Allocation | Recommended Instrument |
| :--- | :--- | :--- | :--- |
| **Large-Cap Equity Index** | 45% | ₹${Math.round(monthly * 0.45).toLocaleString("en-IN")} | UTI Nifty 50 Index Fund (~12% p.a.) |
| **Flexi-Cap / Active Equity** | 25% | ₹${Math.round(monthly * 0.25).toLocaleString("en-IN")} | Parag Parikh Flexi Cap Fund (~13-14% p.a.) |
| **Mid-Cap Alpha** | 15% | ₹${Math.round(monthly * 0.15).toLocaleString("en-IN")} | Motilal Oswal Midcap Fund (~15% p.a.) |
| **Arbitrage / Safe Debt** | 15% | ₹${Math.round(monthly * 0.15).toLocaleString("en-IN")} | ICICI Prudential Arbitrage Fund (Tax-efficient) |

---

#### 3. Core Wealth Multiplier Rules
1. **Automate on Salary Day:** Schedule SIP auto-debits within 48 hours of salary credit so investment happens before discretionary impulse spending.
2. **Reinvest Valuation Gains:** When an asset outperforms, lock in net gains and allocate toward target savings goals.
3. **Compound Growth Horizon:** Investing ₹${monthly.toLocaleString("en-IN")}/mo at 12% CAGR generates **₹24.8 Lakhs in 5 years** and **₹70.3 Lakhs in 10 years**!`;

    // 3. Emergency Fund & Capital Safety Queries
    } else if (
      query.includes("emergency") ||
      query.includes("reserve") ||
      query.includes("safe") ||
      query.includes("safety") ||
      query.includes("buffer")
    ) {
      const monthlyExp = savings.totalExpenses || 70000;
      const minEmergency = monthlyExp * 3;
      const targetEmergency = monthlyExp * 6;
      const currentLiquid = savings.unallocatedSavings;

      reply = `### Emergency Reserve Assessment

---

#### 1. Safety Thresholds
- **Monthly Living Expenses:** ₹${monthlyExp.toLocaleString("en-IN")}
- **Minimum 3-Month Reserve:** ₹${minEmergency.toLocaleString("en-IN")}
- **Ideal 6-Month Golden Buffer:** ₹${targetEmergency.toLocaleString("en-IN")}
- **Your Current Liquid Savings:** **₹${currentLiquid.toLocaleString("en-IN")}**

---

#### 2. Diagnosis & Strategy
${
  currentLiquid >= targetEmergency
    ? `✅ **Excellent Position:** Your liquid pool of ₹${currentLiquid.toLocaleString("en-IN")} fully covers your 6-month safety buffer of ₹${targetEmergency.toLocaleString("en-IN")}. You can safely deploy any excess capital into market investments or goals!`
    : currentLiquid >= minEmergency
    ? `⚠️ **Adequate Baseline:** You currently cover ${Math.round(currentLiquid / monthlyExp)} months of living expenses. Aim to accumulate another ₹${(targetEmergency - currentLiquid).toLocaleString("en-IN")} in high-yield liquid instruments before making aggressive illiquid commitments.`
    : `🚨 **Priority Focus:** Your emergency cushion is below the 3-month safety minimum. Channel ₹${Math.round(savings.monthlySavings * 0.7).toLocaleString("en-IN")}/mo into sweep-in fixed deposits until you reach ₹${minEmergency.toLocaleString("en-IN")}.`
}

**Deployment Tip:** Split your emergency corpus 50% in a sweep-in bank savings account and 50% in an ultra-short duration debt fund for instant liquidity and 6.8%+ yields.`;

    // 4. Budget Optimization, Expenses & Bank Statements
    } else if (
      query.includes("expense") ||
      query.includes("spend") ||
      query.includes("budget") ||
      query.includes("cut") ||
      query.includes("trim") ||
      query.includes("statement") ||
      query.includes("bank")
    ) {
      const topCat = summary.topExpenseCategory;
      const totalExp = savings.totalExpenses;
      const trim10 = Math.round(totalExp * 0.1);
      const trim15 = Math.round(totalExp * 0.15);

      reply = `### Cashflow & Expense Optimization Blueprint

---

#### 1. Expenditure Diagnostic
- **Total Monthly Outflows:** ₹${totalExp.toLocaleString("en-IN")}
- **Largest Outflow Category:** **${topCat}**
- **Current Savings Efficiency:** **${summary.savingsRate.toFixed(1)}%**

---

#### 2. Three Actionable Budget Levers
1. **Target Discretionary Trimming (10% Optimization):**
   - Trimming non-essential spends in **${topCat}** saves **₹${trim10.toLocaleString("en-IN")}/month**.
   - Annually, this creates an effortless **₹${(trim10 * 12).toLocaleString("en-IN")}** cash injection into your savings pool!

2. **The 15% Stretch Target:**
   - Shifting to annual subscriptions, optimizing grocery bulk buying, and renegotiating utility bills can free up **₹${trim15.toLocaleString("en-IN")}/month** (₹${(trim15 * 12).toLocaleString("en-IN")}/year).

3. **Bank Statement Synchronization:**
   - Uploading your monthly statements ensures no untracked micro-subscriptions drain your liquid pool.`;

    // 5. General Savings Rate, Salary & Net Worth
    } else if (
      query.includes("save") ||
      query.includes("saving") ||
      query.includes("salary") ||
      query.includes("income") ||
      query.includes("rate") ||
      query.includes("wealth")
    ) {
      reply = `### Unified Financial Health & Savings Analysis

Hello **${user?.name || "Friend"}**! Here is your verified financial balance sheet:

---

#### 1. Cashflow Breakdown
- **Gross Monthly Income:** ₹${savings.totalIncome.toLocaleString("en-IN")}
- **Monthly Living Outflows:** ₹${savings.totalExpenses.toLocaleString("en-IN")}
- **Net Monthly Savings:** ₹${savings.monthlySavings.toLocaleString("en-IN")}
- **Live Savings Rate:** **${summary.savingsRate.toFixed(1)}%**

---

#### 2. Capital Allocation Ledger
- **Initial Savings Pool:** ₹${savings.initialSavingsPool.toLocaleString("en-IN")}
- **Net Cashflow Savings:** ₹${savings.cashflowSavings.toLocaleString("en-IN")}
- **Capital Committed to Goals:** ₹${savings.allocatedToGoals.toLocaleString("en-IN")}
- **Capital Deployed in Investments:** ₹${savings.totalInvested.toLocaleString("en-IN")}
- **Investment Capital Gains Added:** +₹${savings.totalNetGain.toLocaleString("en-IN")}
- **Remaining Available Savings:** **₹${savings.unallocatedSavings.toLocaleString("en-IN")}**

---

**Strategic Assessment:** A savings rate of **${summary.savingsRate.toFixed(1)}%** indicates strong financial discipline. Keep allocating systematically to maintain steady compounding!`;

    // 6. Intelligent Dynamic Comprehensive Fallback
    } else {
      reply = `Hello **${user?.name || "Friend"}**! I have analyzed your complete financial portfolio:

- **Verified Inflow / Income:** ₹${savings.totalIncome.toLocaleString("en-IN")}
- **Monthly Outflows / Living Expenses:** ₹${savings.totalExpenses.toLocaleString("en-IN")}
- **Unallocated Liquid Savings Pool:** **₹${savings.unallocatedSavings.toLocaleString("en-IN")}**
- **Savings Rate:** **${summary.savingsRate.toFixed(1)}%**
- **Active Goals Target:** ₹${summary.totalGoalsTarget.toLocaleString("en-IN")} (Saved: ₹${summary.totalGoalsSaved.toLocaleString("en-IN")})
- **Investment Portfolio:** ₹${summary.totalInvestments.toLocaleString("en-IN")}

You can ask me:
1. *"How do I achieve my ₹15 Lakh Car Goal by 2028?"*
2. *"Where should I invest my ₹${savings.monthlySavings.toLocaleString("en-IN")} monthly savings?"*
3. *"How can I optimize my ₹${savings.totalExpenses.toLocaleString("en-IN")} monthly living expenses?"*
4. *"Is my emergency fund sufficient for capital safety?"*`;
    }

    const { insights } = this.getAdvisorInsights();

    return {
      reply,
      insights,
      contextSummary: summary,
      model: "NexAdvisor Neural Copilot v2.4 (Tailored Engine)",
    };
  }

  // ---------------- Initialize New User Onboarding ----------------
  static initializeNewUser(params: {
    userId: string;
    name: string;
    email: string;
    monthlySalary: number;
    monthlySavings: number;
    alreadySavedAmount: number;
    firstGoalName?: string;
    firstGoalTarget?: number;
    firstGoalYear?: string;
    firstGoalStartingAmount?: number;
  }) {
    const email = params.email.toLowerCase().trim();
    const calculatedExpense = Math.max(0, params.monthlySalary - params.monthlySavings);

    // Save metadata
    const meta: UserFinancialMeta = {
      monthlySalary: params.monthlySalary,
      monthlySavings: params.monthlySavings,
      monthlyExpenses: calculatedExpense,
      initialSavingsPool: params.alreadySavedAmount,
    };
    setStorage(email, "meta", meta);

    // Initial income streams if entered
    const initialIncomes: Income[] = [];
    if (params.alreadySavedAmount > 0) {
      initialIncomes.push({
        id: "inc_prev_" + Math.random().toString(36).substring(2, 9),
        userId: params.userId,
        source: "Previous Savings & Liquid Reserves",
        amount: params.alreadySavedAmount,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      });
    }
    if (params.monthlySalary > 0) {
      initialIncomes.push({
        id: "inc_sal_" + Math.random().toString(36).substring(2, 9),
        userId: params.userId,
        source: "Monthly Salary & Professional Income",
        amount: params.monthlySalary,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      });
    }
    setStorage(email, "incomes", initialIncomes);

    // Initial living expenses if entered
    if (calculatedExpense > 0) {
      const initialExpense: Expense = {
        id: "exp_" + Math.random().toString(36).substring(2, 9),
        userId: params.userId,
        description: "Monthly Household & Living Outflows",
        amount: calculatedExpense,
        category: "Bills",
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      };
      setStorage(email, "expenses", [initialExpense]);
    } else {
      setStorage(email, "expenses", []);
    }

    // Initial goal if specified (e.g. Car 15L by 2028)
    const initialGoals: Goal[] = [];
    if (params.firstGoalName && params.firstGoalTarget && params.firstGoalTarget > 0) {
      const startAmount = Math.min(
        params.firstGoalStartingAmount || 0,
        params.alreadySavedAmount || 0
      );
      initialGoals.push({
        id: "gol_" + Math.random().toString(36).substring(2, 9),
        userId: params.userId,
        name: params.firstGoalName,
        targetAmount: params.firstGoalTarget,
        currentAmount: startAmount,
        targetDate: params.firstGoalYear || "2028-12-31",
        monthlyContribution: params.monthlySavings > 0 ? params.monthlySavings : 0,
        createdAt: new Date().toISOString(),
      });
    }
    setStorage(email, "goals", initialGoals);

    // Other modules start at 0
    setStorage(email, "investments", []);
    setStorage(email, "documents", []);
    setStorage(email, "statements", []);

    // Initial welcome notification
    const welcomeNotif: Notification = {
      id: "ntf_" + Math.random().toString(36).substring(2, 9),
      userId: params.userId,
      type: "system",
      title: "Account Initialized",
      message: `Welcome to NexWealth, ${params.name}! Your monthly income (₹${params.monthlySalary.toLocaleString("en-IN")}), living budget (₹${calculatedExpense.toLocaleString("en-IN")}), and savings pool (₹${params.alreadySavedAmount.toLocaleString("en-IN")}) are live.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setStorage(email, "notifications", [welcomeNotif]);

    // Save profile
    setStorage(email, "profile", {
      id: params.userId,
      name: params.name,
      email: params.email,
      createdAt: new Date().toISOString(),
    });
  }
}
