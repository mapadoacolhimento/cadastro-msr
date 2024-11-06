"use client";
import { PropsWithChildren } from "react";
import MonthlyIncome from "./MonthlyIncome";
import FinancialNeed from "./FinancialNeed";
import MonthlyIncomeRange from "./MonthlyIncomeRange";
import EmploymentStatus from "./EmploymentStatus";
import Dependants from "./Dependants";
import FamilyProvider from "./FamilyProvider";
import PropertyOwnership from "./PropertyOwnership";

export default function FinancialBlock({
	isNewFinancialTriageEnabled,
}: PropsWithChildren<{ isNewFinancialTriageEnabled: boolean }>) {
	function renderNewFinancialTriage() {
		return [
			MonthlyIncome(),
			MonthlyIncomeRange(),
			EmploymentStatus(),
			Dependants(),
			FamilyProvider(),
			PropertyOwnership(),
		];
	}

	function renderFinancialNeed() {
		return FinancialNeed();
	}

	return isNewFinancialTriageEnabled
		? renderNewFinancialTriage()
		: renderFinancialNeed();
}
