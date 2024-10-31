"use client";
import { useEffect, useState } from "react";
import { TRIAGE_ECONOMIC_QUESTIONS_FEATURE_FLAG } from "@/lib";
import MonthlyIncome from "./MonthlyIncome";
import FinancialNeed from "./FinancialNeed";
import MonthlyIncomeRange from "./MonthlyIncomeRange";
import EmploymentStatus from "./EmploymentStatus";

export default function FinancialBlock() {
	const [
		isTriageEconomicQuestionsEnabled,
		setIsTriageEconomicQuestionsEnabled,
	] = useState(false);

	useEffect(() => {
		async function fetchFeatureFlag() {
			const response = await fetch(
				`/api/feature-flag?flag=${TRIAGE_ECONOMIC_QUESTIONS_FEATURE_FLAG}`
			);

			if (!response.ok) {
				setIsTriageEconomicQuestionsEnabled(false);
			}

			const data = await response.json();

			setIsTriageEconomicQuestionsEnabled(data.isFeatureFlagEnabled);
		}

		fetchFeatureFlag();
	}, []);

	return isTriageEconomicQuestionsEnabled
		? [MonthlyIncome(), MonthlyIncomeRange(), EmploymentStatus()]
		: FinancialNeed();
}
