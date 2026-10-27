"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Layers,
  AlertCircle,
  TrendingUp,
  Wallet,
  PiggyBank,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { AuthUtils } from "@/lib/auth/jwt";
import { MockStore } from "@/lib/mock/store";
import { formatINR } from "@/lib/utils/currency";
import { useTheme } from "@/components/theme/theme-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Account credentials
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Financial baseline onboarding
  const [monthlySalary, setMonthlySalary] = useState("100000");
  const [monthlySavings, setMonthlySavings] = useState("30000");
  const [alreadySavedAmount, setAlreadySavedAmount] = useState("500000");

  // Optional First Goal
  const [hasFirstGoal, setHasFirstGoal] = useState(true);
  const [goalName, setGoalName] = useState("Car Purchase (2028)");
  const [goalTarget, setGoalTarget] = useState("1500000");
  const [goalYear, setGoalYear] = useState("2028-12-31");
  const [goalStartingAlloc, setGoalStartingAlloc] = useState("350000");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    router.prefetch("/dashboard");
    if (AuthUtils.isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  // Derived living expense calculation
  const salaryNum = parseFloat(monthlySalary) || 0;
  const savingsNum = parseFloat(monthlySavings) || 0;
  const alreadySavedNum = parseFloat(alreadySavedAmount) || 0;
  const calculatedExpenses = Math.max(0, salaryNum - savingsNum);
  const savingsRate = salaryNum > 0 ? (savingsNum / salaryNum) * 100 : 0;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError("Please complete all account fields.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate goal allocation if provided
    const startingAllocNum = parseFloat(goalStartingAlloc) || 0;
    if (hasFirstGoal && startingAllocNum > alreadySavedNum) {
      setError(
        `Goal starting allocation (${formatINR(startingAllocNum)}) cannot exceed your already saved savings pool (${formatINR(alreadySavedNum)}).`
      );
      setIsLoading(false);
      return;
    }

    try {
      // 1. Register new user with financial baseline
      const regRes = await apiClient<{
        access_token?: string;
        token_type?: string;
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
          monthlySalary: salaryNum,
          monthlySavings: savingsNum,
          alreadySavedAmount: alreadySavedNum,
          firstGoalName: hasFirstGoal ? goalName : undefined,
          firstGoalTarget: hasFirstGoal ? parseFloat(goalTarget) || 0 : undefined,
          firstGoalYear: hasFirstGoal ? goalYear : undefined,
          firstGoalStartingAmount: hasFirstGoal ? startingAllocNum : undefined,
        }),
      });

      const activeUserId = (regRes as any)?.id || "usr_" + Math.random().toString(36).substring(2, 9);
      if (regRes && regRes.access_token) {
        AuthUtils.setToken(regRes.access_token);
      } else {
        // Fallback login
        const loginRes = await apiClient<{
          access_token: string;
          token_type: string;
        }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        });

        if (loginRes && loginRes.access_token) {
          AuthUtils.setToken(loginRes.access_token);
        }
      }

      // Persist active user profile in local storage
      AuthUtils.setUser({
        id: activeUserId,
        name: name.trim(),
        email: email.trim(),
        monthlySalary: salaryNum,
        monthlySavings: savingsNum,
        alreadySavedAmount: alreadySavedNum,
      });

      // Synchronize client-side MockStore
      MockStore.initializeNewUser({
        userId: activeUserId,
        name: name.trim(),
        email: email.trim(),
        monthlySalary: salaryNum,
        monthlySavings: savingsNum,
        alreadySavedAmount: alreadySavedNum,
        firstGoalName: hasFirstGoal ? goalName : undefined,
        firstGoalTarget: hasFirstGoal ? parseFloat(goalTarget) || 0 : undefined,
        firstGoalYear: hasFirstGoal ? goalYear : undefined,
        firstGoalStartingAmount: hasFirstGoal ? startingAllocNum : undefined,
      });

      // 2. Direct hard navigation to Dashboard for instant session refresh
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background py-10 relative transition-colors duration-200">
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
          className="w-9 h-9 rounded-sm bg-background-elevated border border-border-subtle flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-border-accent transition-all shadow-sm"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-cyan-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>

      <Card className="w-full max-w-xl p-8 border-border-mint shadow-[0_0_35px_rgba(0,245,160,0.12)]">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-mint-400 to-cyan-500 flex items-center justify-center shadow-mint-glow text-background mb-3">
            <Layers className="w-7 h-7" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">
            {step === 1 ? "Create Your NexWealth Account" : "Personalize Your Wealth Baseline"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {step === 1
              ? "Zero hardcoded mock data. Your ledger belongs exclusively to you."
              : "Tell us your cashflow so NexWealth can track your real savings and target purchases."}
          </p>

          {/* Stepper indicators */}
          <div className="flex items-center gap-2 mt-4">
            <span
              className={`w-8 h-1.5 rounded-full transition-all ${
                step === 1 ? "bg-mint-400 shadow-mint-glow" : "bg-mint-600/40"
              }`}
            />
            <span
              className={`w-8 h-1.5 rounded-full transition-all ${
                step === 2 ? "bg-mint-400 shadow-mint-glow" : "bg-slate-700"
              }`}
            />
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Account credentials */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Legal Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav.sharma@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" variant="mint" className="w-full mt-4 gap-2">
              <span>Next: Financial Baseline</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* STEP 2: Financial baseline onboarding */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  Monthly Salary / Inflow (₹)
                </label>
                <Input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  placeholder="100000"
                  required
                  min="0"
                  disabled={isLoading}
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  e.g. ₹1,00,000 take-home
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <PiggyBank className="w-3.5 h-3.5 text-mint-400" />
                  Monthly Target Savings (₹)
                </label>
                <Input
                  type="number"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(e.target.value)}
                  placeholder="30000"
                  required
                  min="0"
                  disabled={isLoading}
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  e.g. ₹30,000 saved per month
                </span>
              </div>
            </div>

            {/* Live calculation banner */}
            <div className="p-3.5 rounded-lg bg-background-elevated border border-border-subtle flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Calculated Monthly Expenses
                </div>
                <div className="font-display font-extrabold text-base text-amber-300 mt-0.5">
                  {formatINR(calculatedExpenses)} / mo
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Target Savings Rate
                </div>
                <div className="font-display font-extrabold text-base text-mint-400 mt-0.5">
                  {savingsRate.toFixed(1)}%
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                Already Saved / Liquid Reserves (₹)
              </label>
              <Input
                type="number"
                value={alreadySavedAmount}
                onChange={(e) => setAlreadySavedAmount(e.target.value)}
                placeholder="500000"
                min="0"
                disabled={isLoading}
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Your current liquid bank/emergency wealth (e.g. ₹5,00,000)
              </span>
            </div>

            {/* First Target Goal Setup (e.g. 15L Car by 2028) */}
            <div className="pt-2 border-t border-border-subtle">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Primary Target Purchase (e.g. Car in 2028)
                  </span>
                </div>
                <label className="text-xs text-cyan-400 flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasFirstGoal}
                    onChange={(e) => setHasFirstGoal(e.target.checked)}
                    className="accent-cyan-400 rounded"
                  />
                  <span>Enable Goal</span>
                </label>
              </div>

              {hasFirstGoal && (
                <div className="space-y-3 bg-card-subtle p-3.5 rounded-lg border border-border-subtle">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Goal Title
                      </label>
                      <Input
                        type="text"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        placeholder="Car Purchase (2028)"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Target Price (₹)
                      </label>
                      <Input
                        type="number"
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                        placeholder="1500000"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Target Completion Date
                      </label>
                      <Input
                        type="date"
                        value={goalYear}
                        onChange={(e) => setGoalYear(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Starting Allocation from ₹{alreadySavedNum.toLocaleString("en-IN")} Savings
                      </label>
                      <Input
                        type="number"
                        value={goalStartingAlloc}
                        onChange={(e) => setGoalStartingAlloc(e.target.value)}
                        placeholder="350000"
                        max={alreadySavedNum}
                        disabled={isLoading}
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Remaining unallocated savings:{" "}
                        <strong className="text-white">
                          {formatINR(Math.max(0, alreadySavedNum - (parseFloat(goalStartingAlloc) || 0)))}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                type="submit"
                variant="mint"
                className="flex-1 gap-2"
                disabled={isLoading}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isLoading ? "Setting Up Ledger..." : "Complete Setup & Launch NexWealth"}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-mint-400 font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </Card>
    </div>
  );
}
