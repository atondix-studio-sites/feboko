import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Section = {
  pageKey: string;
  sectionKey: string;
  data: Record<string, unknown>;
};

export default function FrontpagePage({ pageKey, title }: { pageKey: string; title: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => {
        if (r.status === 401) {
          navigate("/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setSections(data.sections.filter((s: Section) => s.pageKey === pageKey));
      });
  }, [pageKey, navigate]);

  async function save(section: Section) {
    setStatus("Saving...");
    await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageKey: section.pageKey,
        sectionKey: section.sectionKey,
        data: section.data,
      }),
    });
    setStatus("Saved");
  }

  return (
    <div>
      <h1>{title}</h1>
      {status && <p>{status}</p>}
      {sections.map((section) => (
        <div className="admin-section" key={section.sectionKey}>
          <h2>{section.sectionKey}</h2>
          {Object.entries(section.data as Record<string, unknown>).map(([field, val]) => {
            if (field === "image") return null;
            const bilingual = val as { de?: string; en?: string };
            if (!bilingual || typeof bilingual !== "object") return null;
            return (
              <div className="admin-form-flex" key={field}>
                <h4>{field}</h4>
                <div className="admin-form-flex">
                  <div className="column1">
                    <h5>Deutsch</h5>
                    <textarea
                      rows={4}
                      value={bilingual.de ?? ""}
                      onChange={(e) => {
                        const next = { ...section, data: { ...section.data, [field]: { ...bilingual, de: e.target.value } } };
                        setSections((prev) => prev.map((s) => (s.sectionKey === section.sectionKey ? next : s)));
                      }}
                    />
                  </div>
                  <div className="column2">
                    <h5>English</h5>
                    <textarea
                      rows={4}
                      value={bilingual.en ?? ""}
                      onChange={(e) => {
                        const next = { ...section, data: { ...section.data, [field]: { ...bilingual, en: e.target.value } } };
                        setSections((prev) => prev.map((s) => (s.sectionKey === section.sectionKey ? next : s)));
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <button type="button" onClick={() => save(section)}>Save section</button>
        </div>
      ))}
    </div>
  );
}
