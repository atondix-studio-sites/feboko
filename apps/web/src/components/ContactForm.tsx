"use client";

import { useState } from "react";
import type { Lang } from "@feboko/shared";
import { t } from "@feboko/shared";

export function ContactForm({ lang }: { lang: Lang }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !email || !message) {
      setError(
        lang === "en"
          ? "Please fill in all required fields correctly."
          : "Bitte füllen Sie alle erforderlichen Felder korrekt aus.",
      );
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, language: lang }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError(lang === "en" ? "Something went wrong. Please try again." : "Es ist ein Fehler aufgetreten.");
    }
  }

  return (
    <div className="footer-contact-form-wrapper">
      <div className="wpcf7">
        <form className="wpcf7-form" onSubmit={onSubmit}>
          <input type="text" name="website" className="hidden-fields-container" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
          <div className="cf7-row">
            <p>
              <label>
                {lang === "en" ? "Name" : "Name"}
                <span className="wpcf7-form-control-wrap">
                  <input type="text" name="name" className="wpcf7-form-control wpcf7-text" required />
                </span>
              </label>
            </p>
            <p>
              <label>
                {lang === "en" ? "Email" : "E-Mail"}
                <span className="wpcf7-form-control-wrap">
                  <input type="email" name="email" className="wpcf7-form-control wpcf7-email" required />
                </span>
              </label>
            </p>
          </div>
          <p>
            <label>
              {lang === "en" ? "Message" : "Nachricht"}
              <span className="wpcf7-form-control-wrap">
                <textarea name="message" className="wpcf7-form-control wpcf7-textarea" rows={5} required />
              </span>
            </label>
          </p>
          <p>
            <input
              type="submit"
              className="wpcf7-form-control wpcf7-submit"
              value={lang === "en" ? "Send message" : "Nachricht senden"}
              disabled={status === "loading"}
            />
          </p>
          {error && <p className="wpcf7-response-output">{error}</p>}
          {status === "success" && (
            <p className="wpcf7-response-output">
              {lang === "en" ? "Thank you! We will get back to you soon." : "Vielen Dank! Wir melden uns in Kürze."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
