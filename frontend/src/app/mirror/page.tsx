"use client";

import { CrewShell } from "@/components/CrewShell";
import { SmartMirrorPanel } from "@/components/smart_mirror/SmartMirrorPanel";
import { useLanguage } from "@/components/LanguageProvider";
import { MOCK_TELEMETRY } from "@/services/mockData";

export default function SmartMirrorPage() {
  const { t } = useLanguage();

  return (
    <CrewShell active="more">
      <header className="screen-heading">
        <p className="eyebrow">{t("visualIndicators")}</p>
        <h1>{t("smartMirror")}</h1>
        <p className="page-intro">{t("mirrorPageIntro")}</p>
      </header>
      <div className="single-panel-screen">
        <SmartMirrorPanel mirror={MOCK_TELEMETRY.data.smart_mirror_vision} />
      </div>
    </CrewShell>
  );
}