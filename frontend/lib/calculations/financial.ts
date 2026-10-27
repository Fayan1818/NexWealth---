import { Goal } from "@/types/contract";

/**
 * Standardized Financial Calculations
 * Implements logic specified in NEXWEALTH_DATA_CONTRACT.md Section 6
 */

export function calculateGoalProgress(goal: Goal): number {
  if (!goal || typeof goal.targetAmount !== "number" || goal.targetAmount <= 0) {
    return 0;
  }
  const current = typeof goal.currentAmount === "number" ? goal.currentAmount : 0;
  const progress = (current / goal.targetAmount) * 100;
  return Math.max(0, Math.min(progress, 100));
}

export function calculateAvailableSavings(totalIncome: number, totalExpenses: number): number {
  return (totalIncome || 0) - (totalExpenses || 0);
}

export function calculateSavingsRate(totalIncome: number, totalExpenses: number): number {
  if (!totalIncome || totalIncome <= 0) {
    return 0;
  }
  const available = calculateAvailableSavings(totalIncome, totalExpenses);
  return Math.max(0, (available / totalIncome) * 100);
}
