"use client";

import { CrewShell } from "@/components/CrewShell";
import { SupportTasks } from "@/components/alerts/SupportTasks";
import { useLanguage } from "@/components/LanguageProvider";

export default function WellbeingPlanPage() {
  const { t } = useLanguage();

  return (
    <CrewShell active="plan">
      <header className="screen-heading">
        <p className="eyebrow">{t("atYourPace")}</p>
        <h1>{t("dailyPlan")}</h1>
        <p className="page-intro">{t("planPageIntro")}</p>
      </header>
      <div className="plan-screen-content"><SupportTasks /></div>
    </CrewShell>
  );
}