import Link from "next/link";
import type { Lang } from "@feboko/shared";
import { t } from "@feboko/shared";
import { localizePath } from "@/lib/utils";
import { ContactForm } from "./ContactForm";
import { studioContentEnabled } from "@/lib/studio-content";

type NavItem = {
  labelDe: string | null;
  labelEn: string | null;
  href: string;
};

export function SiteFooter({
  lang,
  footerFeboko,
  footerLegal,
}: {
  lang: Lang;
  footerFeboko: NavItem[];
  footerLegal: NavItem[];
}) {
  const label = (item: NavItem) => (lang === "en" ? item.labelEn || item.labelDe : item.labelDe || item.labelEn) ?? "";

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-contact-area">
        <div className="footer-contact-form">
          <div className="footer-contact-form-intro">
            <p className="section-subtitle">{t(lang, "Kostenloses Erstgespräch", "Free Initial Consultation")}</p>
            <h2 className="section-title">
              {t(lang, "Sprechen Sie mit unserem Beraterteam", "Speak with Our Advisory Team")}
            </h2>
            <p className="section-description">
              {t(
                lang,
                "Profitieren Sie von globaler Perspektive und lokaler Expertise – für Ihren Markteintritt in Indien. Fundierte Marktanalysen, Standortbewertungen und unser starkes Netzwerk sichern Ihren nachhaltigen Erfolg.",
                "Benefit from a global perspective and local expertise – for your market entry in India. Thorough market analyses, location assessments, and our strong network ensure your sustainable success.",
              )}
            </p>
          </div>
          <ContactForm lang={lang} />
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-contact">
          <div className="footer-contact-block">
            <h4>FeBoKo Consulting GbR</h4>
            {!studioContentEnabled() ? (
              <>
                <p>Rosestraße 2</p>
                <p style={{ marginBottom: 6 }}>95448 Bayreuth</p>
              </>
            ) : (
              <p data-atondix-field="contact.address" style={{ marginBottom: 6 }}>
                Rosestraße 2
                <br />
                95448 Bayreuth
              </p>
            )}
            <p>E-Mail: <a href="mailto:info@feboko.com" data-atondix-field="contact.email">info@feboko.com</a></p>
            <p data-atondix-field="contact.phone">Tel.: +49 (0) 157 33717052</p>
          </div>
          <div className="footer-contact-block">
            <h4>FeBoKo & Partners India Pvt. Ltd.</h4>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 6 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p>15th Floor, Eros Corporate Tower Nehru Place</p>
                <p>New-Delhi, Delhi 110019</p>
                <p>E-Mail: <a href="mailto:delhi.office@feboko.com">delhi.office@feboko.com</a></p>
                <p>Tel.: +91 88604 50708</p>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p>Office No. 901, 9th Floor</p>
                <p>Sunit Capital, Senapati Bapat Rd</p>
                <p>Pune, Maharashtra 411016</p>
                <p>E-Mail: <a href="mailto:pune.office@feboko.com">pune.office@feboko.com</a></p>
                <p>Tel.: +91 99991 83114</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-spacer"></div>

        <div className="footer-column">
          <h4>FeBoKo</h4>
          <ul>
            {footerFeboko.map((item) => (
              <li key={item.href}>
                <Link href={localizePath(item.href, lang)}>{label(item)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4>{t(lang, "Rechtliches", "Legal")}</h4>
          <ul>
            {footerLegal.map((item) => (
              <li key={item.href}>
                <Link href={localizePath(item.href, lang)}>{label(item)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-social">
        <a href="https://www.linkedin.com/company/feboko" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
            <rect width="45" height="45" fill="#787DB9" />
            <path
              d="M16.5 19.5H12V33H16.5V19.5ZM14.25 17.625C15.6375 17.625 16.7625 16.5 16.7625 15.1125C16.7625 13.725 15.6375 12.6 14.25 12.6C12.8625 12.6 11.7375 13.725 11.7375 15.1125C11.7375 16.5 12.8625 17.625 14.25 17.625ZM33 33H33.0075V25.65C33.0075 22.125 32.2125 19.35 28.0875 19.35C26.1 19.35 24.75 20.475 24.225 21.5625H24.1725V19.5H19.95V33H24.45V26.4C24.45 24.675 24.75 22.95 26.925 22.95C29.1 22.95 29.1 24.975 29.1 26.55V33H33Z"
              fill="#F5F5F5"
            />
          </svg>
        </a>
      </div>

      <div className="footer-bottom">
        <p>Copyright © {new Date().getFullYear()} FeBoKo Consulting</p>
      </div>
    </footer>
  );
}
