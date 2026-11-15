import { MaterialSymbol } from "@/components/MaterialSymbol";
import { StatusPill } from "@/components/StatusPill";
import { useLanguage } from "@/components/LanguageProvider";

const statusDetails = [
  { status: "GREEN", message: "greenMeaning", icon: "check_circle" },
  { status: "YELLOW", message: "yellowMeaning", icon: "warning" },
  { status: "RED", message: "redMeaning", icon: "error" },
] as const;

export function StatusGuide() {
  const { t } = useLanguage();

  return (
    <section className="status-guide" aria-labelledby="status-guide-title">
      <div className="status-guide-heading">
        <MaterialSymbol name="info" size={21} />
        <div>
          <h2 id="status-guide-title">{t("statusGuideTitle")}</h2>
          <p>{t("noNumericThresholds")}</p>
        </div>
      </div>
      <div className="status-guide-list">
        {statusDetails.map((item) => (
          <article className={`status-guide-item status-guide-${item.status.toLowerCase()}`} key={item.status}>
            <div className="status-guide-item-heading">
              <MaterialSymbol name={item.icon} size={19} />
              <StatusPill status={item.status} />
            </div>
            <p>{t(item.message)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}