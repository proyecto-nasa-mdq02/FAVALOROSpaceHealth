"use client";

import { useEffect, useState } from "react";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useLanguage } from "@/components/LanguageProvider";
import type { MessageKey } from "@/services/i18n";

const tasks: { id: string; label: MessageKey }[] = [
  { id: "water", label: "hydrationTask" },
  { id: "exercise", label: "exerciseTask" },
];

const medals: {
  id: string;
  title: MessageKey;
  description: MessageKey;
  icon: string;
  tone: string;
  cost: number;
}[] = [
  { id: "granite", title: "medalGranite", description: "medalGraniteDescription", icon: "terrain", tone: "granite", cost: 5 },
  { id: "rodocrosite", title: "medalRodocrosite", description: "medalRodocrositeDescription", icon: "diamond", tone: "rodocrosite", cost: 10 },
  { id: "basalt", title: "medalBasalt", description: "medalBasaltDescription", icon: "landscape", tone: "basalt", cost: 15 },
];

interface WellbeingPlanState {
  date: string;
  completedToday: string[];
  creditedToday: string[];
  points: number;
  redeemedRewards: string[];
}

const PLAN_STORAGE_KEY = "spacehealth-wellbeing-rewards";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readValidIds(value: unknown, allowedIds: string[]) {
  return Array.isArray(value)
    ? value.filter((id): id is string => typeof id === "string" && allowedIds.includes(id))
    : [];
}

export function SupportTasks() {
  const { t } = useLanguage();
  const [plan, setPlan] = useState<WellbeingPlanState>({
    date: getTodayKey(),
    completedToday: [],
    creditedToday: [],
    points: 0,
    redeemedRewards: [],
  });
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(PLAN_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const savedPlan = parsed as Partial<WellbeingPlanState>;
          const today = getTodayKey();
          const isSameDay = savedPlan.date === today;
          setPlan({
            date: today,
            completedToday: isSameDay ? readValidIds(savedPlan.completedToday, tasks.map((task) => task.id)) : [],
            creditedToday: isSameDay ? readValidIds(savedPlan.creditedToday, tasks.map((task) => task.id)) : [],
            points: typeof savedPlan.points === "number" && Number.isFinite(savedPlan.points)
              ? Math.max(0, savedPlan.points)
              : 0,
            redeemedRewards: readValidIds(savedPlan.redeemedRewards, medals.map((medal) => medal.id)),
          });
        }
      }
    } catch {}
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
    } catch {}
  }, [plan, storageReady]);

  function toggleTask(id: string) {
    setPlan((current) => {
      const today = getTodayKey();
      const currentDay = current.date === today
        ? current
        : { ...current, date: today, completedToday: [], creditedToday: [] };
      const isComplete = currentDay.completedToday.includes(id);
      const shouldCredit = !isComplete && !currentDay.creditedToday.includes(id);

      return {
        ...currentDay,
        completedToday: isComplete
          ? currentDay.completedToday.filter((task) => task !== id)
          : [...currentDay.completedToday, id],
        creditedToday: shouldCredit ? [...currentDay.creditedToday, id] : currentDay.creditedToday,
        points: currentDay.points + (shouldCredit ? 5 : 0),
      };
    });
  }

  function redeemReward(rewardId: string, cost: number) {
    setPlan((current) => {
      if (current.points < cost || current.redeemedRewards.includes(rewardId)) return current;
      return {
        ...current,
        points: current.points - cost,
        redeemedRewards: [...current.redeemedRewards, rewardId],
      };
    });
  }

  const completedCount = plan.completedToday.length;
  const earnedToday = plan.creditedToday.length * 5;

  return (
    <section className="tasks-panel" id="bienestar" aria-labelledby="tasks-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{t("atYourPace")}</p>
          <h2 id="tasks-title">{t("dailyPlan")}</h2>
        </div>
        <span className="optional-label">{t("optional")}</span>
      </div>
      <p className="panel-subtitle">{t("selfCareIdeas")}</p>
      <div className="plan-wallet">
        <span className="plan-wallet-icon"><MaterialSymbol name="stars" size={22} /></span>
        <span><small>{t("pointsBalance")}</small><strong>{plan.points} <span>{t("pointsUnit")}</span></strong></span>
        <span className="plan-earned" aria-live="polite">{t("pointsEarnedToday").replace("{count}", String(earnedToday))}</span>
      </div>
      <div className="plan-progress-copy">
        <strong>{t("planProgress").replace("{done}", String(completedCount)).replace("{total}", String(tasks.length))}</strong>
        <span>{completedCount === tasks.length ? t("planComplete") : t("planPrompt")}</span>
      </div>
      <div
        className="plan-progress-track"
        role="progressbar"
        aria-label={t("dailyPlan")}
        aria-valuemin={0}
        aria-valuemax={tasks.length}
        aria-valuenow={completedCount}
      >
        <span style={{ width: `${(completedCount / tasks.length) * 100}%` }} />
      </div>
      <div className="task-list">
        {tasks.map((task) => {
          const isCompleted = plan.completedToday.includes(task.id);
          return (
            <button
              className={`task-row ${isCompleted ? "task-completed" : ""}`}
              key={task.id}
              type="button"
              aria-pressed={isCompleted}
              onClick={() => toggleTask(task.id)}
            >
              <span className="task-checkbox">{isCompleted && <MaterialSymbol name="check" size={14} />}</span>
              <span>{t(task.label)}</span>
            </button>
          );
        })}
      </div>
      <p className="points-per-action">{t("pointsPerAction")}</p>
      <div className="rewards-heading">
        <div><p className="eyebrow">{t("collectionLabel")}</p><h3>{t("rewardsTitle")}</h3><p>{t("collectionSubtitle")}</p><small>{t("medalIllustrationNote")}</small></div>
      </div>
      <div className="rewards-grid">
        {medals.map((medal) => {
          const isRedeemed = plan.redeemedRewards.includes(medal.id);
          const canRedeem = plan.points >= medal.cost && !isRedeemed;
          return (
            <article className={`medal-card medal-card-${medal.tone} ${isRedeemed ? "medal-card-collected" : ""}`} key={medal.id}>
              <span className={`medal-emblem medal-emblem-${medal.tone}`} aria-hidden="true">
                <span className={`medal-stone medal-stone-${medal.tone}`} />
              </span>
              <strong>{t(medal.title)}</strong>
              <p>{t(medal.description)}</p>
              <span className="medal-cost"><MaterialSymbol name="stars" size={14} /> {medal.cost} {t("pointsUnit")}</span>
              <button
                className="medal-button"
                type="button"
                disabled={!canRedeem}
                onClick={() => redeemReward(medal.id, medal.cost)}
              >
                {isRedeemed ? t("rewardRedeemed") : t("redeemReward")}
              </button>
              {!isRedeemed && !canRedeem && <small className="medal-lock-note">{t("insufficientPoints")}</small>}
            </article>
          );
        })}
      </div>
      <p className="medal-collection-count"><MaterialSymbol name="military_tech" size={17} />
        {t("medalsCollected").replace("{count}", String(plan.redeemedRewards.length)).replace("{total}", String(medals.length))}
      </p>
      <p className="task-note">{t("pointDisclaimer")}</p>
    </section>
  );
}