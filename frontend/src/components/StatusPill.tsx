import type { HealthStatus } from "@/services/mockData";
import { useLanguage } from "@/components/LanguageProvider";

const statusMessage: Record<HealthStatus, "statusGreen" | "statusYellow" | "statusRed"> = {
  GREEN: "statusGreen",
  YELLOW: "statusYellow",
  RED: "statusRed",
};

export function StatusPill({ status }: { status: HealthStatus }) {
  const { t } = useLanguage();

  return (
    <span className={`status-pill status-${status.toLowerCase()}`}>
      <span className="status-dot" aria-hidden="true" />
      {t(statusMessage[status])}
    </span>
  );
}