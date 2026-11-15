import { MaterialSymbol } from "@/components/MaterialSymbol";
import type { TelemetryResponse } from "@/services/mockData";
import { StatusPill } from "@/components/StatusPill";
import { useLanguage } from "@/components/LanguageProvider";

export function StandardMeasures({ measures }: { measures: TelemetryResponse["data"]["standard_measures"] }) {
  const { t } = useLanguage();
  const sections = [
    {
      title: t("sleepActivity"),
      subtitle: t("actigraphy"),
      icon: "bedtime",
      tone: "sky",
      status: measures.actigraphy.status,
      values: [
        { label: t("sleepDuration"), value: `${measures.actigraphy.sleep_duration_hours} h`, explanation: t("totalSleepDuration") },
        { label: t("sleepEfficiency"), value: `${measures.actigraphy.sleep_efficiency_pct}%`, explanation: t("sleepEfficiencyDescription") },
      ],
    },
    {
      title: t("cognition"),
      subtitle: t("cognitiveTests"),
      icon: "psychology",
      tone: "lilac",
      status: measures.cognition.status,
      values: [
        { label: t("sustainedAttention"), value: String(measures.cognition.vigilant_attention_score), explanation: t("attentionTaskScore") },
        { label: t("spatialOrientation"), value: String(measures.cognition.spatial_orientation_score), explanation: t("orientationTaskScore") },
      ],
    },
    {
      title: t("behavioralWellbeing"),
      subtitle: t("wellbeingSurveys"),
      icon: "groups",
      tone: "lemon",
      status: measures.behavioral_health.status,
      values: [
        { label: t("moodPanas"), value: String(measures.behavioral_health.mood_score_panas), explanation: t("moodSurveyResult") },
        { label: t("teamCohesion"), value: String(measures.behavioral_health.team_cohesion_index), explanation: t("teamCohesionIndex") },
      ],
    },
    {
      title: t("sensorimotor"),
      subtitle: t("balanceMovement"),
      icon: "balance",
      tone: "coral",
      status: measures.sensorimotor.status,
      values: [
        { label: t("motionSickness"), value: `${measures.sensorimotor.motion_sickness_rating_0_to_20} / 20`, explanation: t("motionSicknessScale") },
        { label: t("posturalStability"), value: measures.sensorimotor.postural_stability === "STABLE" ? t("stable") : measures.sensorimotor.postural_stability, explanation: t("postureTestSummary") },
      ],
    },
  ];

  return (
    <section className="panel measures-panel" id="medidas" aria-labelledby="measures-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{t("standardMeasures")}</p>
          <h2 id="measures-title">{t("sleepMindMovement")}</h2>
        </div>
        <span className="section-index">{t("fourAreas")}</span>
      </div>
      <p className="panel-subtitle">{t("scoresExplanation")}</p>
      <div className="measure-list">
        {sections.map((section) => {
          return (
            <article className="measure-item" key={section.title}>
              <div className={`measure-icon metric-icon-${section.tone}`}><MaterialSymbol name={section.icon} size={17} /></div>
              <div className="measure-content">
                <div className="measure-title-row">
                  <div>
                    <h3>{section.title}</h3>
                    <span>{section.subtitle}</span>
                  </div>
                  <StatusPill status={section.status} />
                </div>
                <div className="measure-values">
                  {section.values.map((item) => (
                    <div className="measure-value" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <small>{item.explanation}</small>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}