"use client";

import { CrewShell } from "@/components/CrewShell";
import { StandardMeasures } from "@/components/standard_measures/StandardMeasures";
import { useLanguage } from "@/components/LanguageProvider";
import { MOCK_TELEMETRY } from "@/services/mockData";

export default function MeasuresPage() {
  const { t } = useLanguage();

  return (
    <CrewShell active="more">
      <header className="screen-heading">
        <p className="eyebrow">{t("standardMeasures")}</p>
        <h1>{t("sleepMindMovement")}</h1>
        <p className="page-intro">{t("measuresPageIntro")}</p>
      </header>
      <StandardMeasures measures={MOCK_TELEMETRY.data.standard_measures} />
    </CrewShell>
  );
}