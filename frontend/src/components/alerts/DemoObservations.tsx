"use client";

import { useState, type FormEvent } from "react";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useLanguage } from "@/components/LanguageProvider";

interface DemoNote {
  id: number;
  text: string;
  timestamp: string;
}

export function DemoObservations() {
  const { locale, t } = useLanguage();
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState<DemoNote[]>([]);

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const timestamp = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    setNotes((current) => [{ id: Date.now(), text, timestamp }, ...current]);
    setDraft("");
  }

  return (
    <section className="panel observations-panel" id="observaciones" aria-labelledby="observations-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{t("demoNotesLabel")}</p>
          <h2 id="observations-title">{t("observationsTitle")}</h2>
          <p className="panel-subtitle">{t("observationsDisclaimer")}</p>
        </div>
      </div>
      <form className="observation-form" onSubmit={addNote}>
        <label className="visually-hidden" htmlFor="demo-observation">{t("observationInputLabel")}</label>
        <textarea
          id="demo-observation"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={500}
          placeholder={t("observationPlaceholder")}
          rows={3}
        />
        <button className="admin-test-button" type="submit" disabled={!draft.trim()}>
          <MaterialSymbol name="add" size={17} /> {t("saveObservation")}
        </button>
      </form>
      <ol className="observation-list" aria-live="polite">
        {notes.length === 0 ? (
          <li className="observation-empty">{t("noObservations")}</li>
        ) : notes.map((note) => (
          <li className="observation-item" key={note.id}>
            <time>{note.timestamp}</time>
            <p>{note.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}