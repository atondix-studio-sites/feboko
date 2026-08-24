"use client";

import { useState } from "react";
import type { Lang } from "@feboko/shared";

export function ContactForm({ lang }: { lang: Lang }) {
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const copy = lang === "en"
    ? {
        firstName: "First Name", firstPlaceholder: "Enter First Name",
        lastName: "Last Name", lastPlaceholder: "Enter Last Name",
        email: "Email", emailPlaceholder: "Enter Email",
        subject: "Your Subject", subjectPlaceholder: "Enter Subject",
        message: "Your Message", messagePlaceholder: "Your Message to us",
        acceptancePrefix: "I accept the ", privacy: "Privacy Policy", submit: "Submit message",
      }
    : {
        firstName: "Vorname", firstPlaceholder: "Vorname eingeben",
        lastName: "Nachname", lastPlaceholder: "Nachname eingeben",
        email: "Email", emailPlaceholder: "Email eingeben",
        subject: "Ihr Betreff", subjectPlaceholder: "Betreff eingeben",
        message: "Ihre Nachricht", messagePlaceholder: "Ihre Nachricht an uns",
        acceptancePrefix: "Ich akzeptiere die ", privacy: "Datenschutzerklärung", submit: "Nachricht absenden",
      };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = String(fd.get("your-first-name") || "").trim();
    const lastName = String(fd.get("your-last-name") || "").trim();
    const email = String(fd.get("your-email") || "").trim();
    const subject = String(fd.get("your-subject") || "").trim();
    const message = String(fd.get("your-message") || "").trim();

    if (!firstName || !lastName || !email || !subject || !message || !accepted) {
      setError(lang === "en" ? "Please fill in all required fields correctly." : "Bitte füllen Sie alle erforderlichen Felder korrekt aus.");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          subject,
          message,
          language: lang,
          website: String(fd.get("website") || ""),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
      setAccepted(false);
    } catch {
      setStatus("error");
      setError(lang === "en" ? "Something went wrong. Please try again." : "Es ist ein Fehler aufgetreten.");
    }
  }

  return (
    <div className="footer-contact-form-wrapper">
      <div className="wpcf7">
        <form className="wpcf7-form init" aria-label="Contact form" noValidate onSubmit={onSubmit}>
          <fieldset className="hidden-fields-container">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </fieldset>

          <div className="cf7-row">
            <p><label>{copy.firstName}<br /><span className="wpcf7-form-control-wrap" data-name="your-first-name"><input size={40} maxLength={400} className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" autoComplete="given-name" aria-required="true" placeholder={copy.firstPlaceholder} type="text" name="your-first-name" required /></span><br /></label></p>
            <p><label>{copy.lastName}<br /><span className="wpcf7-form-control-wrap" data-name="your-last-name"><input size={40} maxLength={400} className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" autoComplete="family-name" aria-required="true" placeholder={copy.lastPlaceholder} type="text" name="your-last-name" required /></span><br /></label></p>
          </div>

          <div className="cf7-row">
            <p><label>{copy.email}<br /><span className="wpcf7-form-control-wrap" data-name="your-email"><input size={40} maxLength={400} className="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email" autoComplete="email" aria-required="true" placeholder={copy.emailPlaceholder} type="email" name="your-email" required /></span><br /></label></p>
            <p><label>{copy.subject}<br /><span className="wpcf7-form-control-wrap" data-name="your-subject"><input size={40} maxLength={400} className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" aria-required="true" placeholder={copy.subjectPlaceholder} type="text" name="your-subject" required /></span><br /></label></p>
          </div>

          <p><label>{copy.message}<br /><span className="wpcf7-form-control-wrap" data-name="your-message"><textarea cols={40} rows={10} maxLength={2000} className="wpcf7-form-control wpcf7-textarea wpcf7-validates-as-required" aria-required="true" placeholder={copy.messagePlaceholder} name="your-message" required /></span><br /></label></p>

          <p><span className="wpcf7-form-control-wrap" data-name="acceptance-969"><span className="wpcf7-form-control wpcf7-acceptance"><span className="wpcf7-list-item"><label><input type="checkbox" name="acceptance-969" value="1" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span className="wpcf7-list-item-label">{copy.acceptancePrefix}<a href="/datenschutz" target="_blank" rel="noreferrer">{copy.privacy}</a>.</span></label></span></span></span></p>

          <p><input className="wpcf7-form-control wpcf7-submit has-spinner" type="submit" value={copy.submit} disabled={!accepted || status === "loading"} /><span className="wpcf7-spinner"></span></p>

          <p className="akismet-fields-container" style={{ display: "none" }} aria-hidden="true"></p>

          {(error || status === "success") && <div className="wpcf7-response-output" style={{ display: "block" }} role="status">{error || (lang === "en" ? "Thank you! We will get back to you soon." : "Vielen Dank! Wir melden uns in Kürze.")}</div>}
        </form>
      </div>
    </div>
  );
}
