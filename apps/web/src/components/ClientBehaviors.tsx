"use client";

import { Suspense, useEffect } from "react";
import type { Lang } from "@feboko/shared";
import { LanguageSwitcher } from "./LanguageSwitcher";

function initMegaMenu() {
  const OPEN_DELAY = 40;
  const CLOSE_DELAY = 150;
  const isTouch = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const $liEl = document.querySelector(".menu-item-has-mega-menu");
  const $link = document.querySelector(".mega-menu-trigger-link");
  const $toggle = document.querySelector(".mega-menu-toggle");
  const $panelEl = document.getElementById("mega-menu-panel");
  if (!$liEl || !$panelEl) return;
  const $li = $liEl;
  const $panel = $panelEl;

  const $cats = Array.from(document.querySelectorAll(".mega-menu-category"));
  const $lists = Array.from(document.querySelectorAll(".mega-menu-subservice-list"));
  let openTimer: ReturnType<typeof setTimeout> | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  let isOpen = false;
  let hoverInitialized = false;

  function activateCategory(index: number) {
    $cats.forEach((cat, i) => {
      const active = i === index;
      cat.classList.toggle("is-active", active);
      cat.setAttribute("aria-current", active ? "true" : "false");
    });
    $lists.forEach((list, i) => {
      const visible = i === index;
      list.classList.toggle("is-visible", visible);
      list.setAttribute("aria-hidden", visible ? "false" : "true");
      list.querySelectorAll("a").forEach((a) => {
        a.tabIndex = visible ? 0 : -1;
      });
    });
  }

  function openMenu() {
    if (isOpen) return;
    isOpen = true;
    $li.classList.add("mega-menu-open");
    $panel.removeAttribute("aria-hidden");
    $panel.setAttribute("aria-hidden", "false");
    if ($toggle) $toggle.setAttribute("aria-expanded", "true");
    activateCategory(0);
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    $li.classList.remove("mega-menu-open");
    $panel.setAttribute("aria-hidden", "true");
    if ($toggle) $toggle.setAttribute("aria-expanded", "false");
  }

  function initDesktopHover() {
    if (hoverInitialized) return;
    hoverInitialized = true;

    $li.addEventListener("mouseenter", () => {
      if (closeTimer) clearTimeout(closeTimer);
      openTimer = setTimeout(openMenu, OPEN_DELAY);
    });
    $li.addEventListener("mouseleave", () => {
      if (openTimer) clearTimeout(openTimer);
      closeTimer = setTimeout(closeMenu, CLOSE_DELAY);
    });
    $cats.forEach((cat, index) => {
      cat.addEventListener("mouseenter", () => activateCategory(index));
    });
  }

  if ($link) {
    $link.addEventListener("focus", () => {
      if (closeTimer) clearTimeout(closeTimer);
      openMenu();
    });
  }

  $cats.forEach((cat, index) => {
    cat.addEventListener("focus", () => {
      openMenu();
      activateCategory(index);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      closeMenu();
      if ($link) ($link as HTMLElement).focus();
    }
  });

  $li.addEventListener("focusout", () => {
    requestAnimationFrame(() => {
      if (!$li.contains(document.activeElement)) closeMenu();
    });
  });

  if ($toggle) {
    $toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const expanded = $toggle.getAttribute("aria-expanded") === "true";
      $toggle.setAttribute("aria-expanded", String(!expanded));
      $panel.classList.toggle("is-expanded", !expanded);
      $panel.setAttribute("aria-hidden", expanded ? "true" : "false");
    });
  }

  const wrappers = document.querySelectorAll(".mega-menu-category-wrapper");
  wrappers.forEach((wrapper) => {
    const catLink = wrapper.querySelector(".mega-menu-category");
    if (!catLink) return;
    const sub = wrapper.querySelector(".mega-menu-category-mobile-sub");
    if (!sub) return;

    catLink.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const expanded = wrapper.classList.contains("is-sub-expanded");
      wrappers.forEach((w) => w.classList.remove("is-sub-expanded"));
      if (!expanded) wrapper.classList.add("is-sub-expanded");
    });
  });

  function updateLayout() {
    if ($link) ($link as HTMLElement).style.removeProperty("display");
    if (!isTouch && window.innerWidth > 768) initDesktopHover();
  }

  updateLayout();
  window.addEventListener("resize", updateLayout);
}

export function ClientBehaviors() {
  useEffect(() => {
    const $hamburger = document.querySelector(".hamburger-toggle");
    const $nav = document.querySelector("nav.nav-container");
    const $overlay = document.querySelector(".mobile-menu-overlay");

    function openMenu() {
      $hamburger?.classList.add("active");
      $hamburger?.setAttribute("aria-expanded", "true");
      $nav?.classList.add("active");
      $overlay?.classList.add("active");
      document.body.classList.add("menu-open");
    }

    function closeMenu() {
      $hamburger?.classList.remove("active");
      $hamburger?.setAttribute("aria-expanded", "false");
      $nav?.classList.remove("active");
      $overlay?.classList.remove("active");
      document.body.classList.remove("menu-open");
    }

    const onHamburger = () => {
      if ($nav?.classList.contains("active")) closeMenu();
      else openMenu();
    };

    $hamburger?.addEventListener("click", onHamburger);
    $overlay?.addEventListener("click", closeMenu);

    $nav?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest("#mega-menu-panel")) return;
      if (target.closest("a")) closeMenu();
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const el = document.querySelector(href);
        if (el) {
          event.preventDefault();
          const top = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });

    initMegaMenu();

    let marqueeRafId = 0;
    const scrollEl = document.querySelector(".partner-logos-scroll") as HTMLElement | null;
    if (scrollEl) {
      const imgs = Array.from(scrollEl.querySelectorAll("img"));
      if (imgs.length) {
        const setCount = 3;
        const gap = 100;

        const measureFirstSet = () => {
          const count = imgs.length / setCount;
          let width = 0;
          for (let i = 0; i < count; i++) {
            width += imgs[i].getBoundingClientRect().width;
          }
          width += Math.max(0, count - 1) * gap;
          return width;
        };

        let scrollWidth = 0;
        let pos = 0;

        const startMarquee = () => {
          scrollWidth = measureFirstSet();
          if (scrollWidth <= 0) return;

          const speed = 0.5;
          const animate = () => {
            pos += speed;
            if (pos >= scrollWidth) pos = 0;
            scrollEl.style.transform = `translateX(-${pos}px)`;
            marqueeRafId = requestAnimationFrame(animate);
          };
          marqueeRafId = requestAnimationFrame(animate);
        };

        const onImagesReady = () => {
          if (scrollWidth > 0) return;
          startMarquee();
        };

        imgs.forEach((img) => {
          if (img.complete) onImagesReady();
          else img.addEventListener("load", onImagesReady, { once: true });
        });

        requestAnimationFrame(() => onImagesReady());
      }
    }

    const track = document.getElementById("service-carousel-track");
    const prev = document.getElementById("service-carousel-prev");
    const next = document.getElementById("service-carousel-next");
    if (track && prev && next) {
      let index = 0;
      const cards = track.querySelectorAll(".service-card");
      const update = () => {
        const card = cards[index] as HTMLElement | undefined;
        if (!card) return;
        const offset = card.offsetLeft;
        track.style.transform = `translateX(-${offset}px)`;
      };
      prev.addEventListener("click", () => {
        index = Math.max(0, index - 1);
        update();
      });
      next.addEventListener("click", () => {
        index = Math.min(cards.length - 1, index + 1);
        update();
      });
    }

    document.querySelectorAll(".team-grid-card .read-more").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const card = link.closest(".team-grid-card");
        if (!card) return;
        const id = String(card.getAttribute("data-team-id") ?? "");
        const url = new URL(window.location.href);

        if (card.classList.contains("active")) {
          url.searchParams.delete("active");
          history.pushState({}, "", url.pathname + (url.search ? `?${url.searchParams.toString()}` : ""));
          card.classList.remove("active");
        } else {
          url.searchParams.set("active", id);
          history.pushState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
          document.querySelectorAll(".team-grid-card.active").forEach((c) => c.classList.remove("active"));
          card.classList.add("active");
          card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    });

    const setActiveTeamFromParam = () => {
      const id = new URLSearchParams(window.location.search).get("active");
      document.querySelectorAll(".team-grid-card").forEach((c) => c.classList.remove("active"));
      if (id) {
        const card = document.querySelector(`.team-grid-card[data-team-id="${id}"]`);
        if (card) card.classList.add("active");
      }
    };
    setActiveTeamFromParam();
    window.addEventListener("popstate", setActiveTeamFromParam);

    document.querySelectorAll(".job-grid-card .read-more").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const card = link.closest(".job-grid-card");
        if (!card) return;
        if (card.classList.contains("active")) {
          card.classList.remove("active");
        } else {
          document.querySelectorAll(".job-grid-card.active").forEach((c) => c.classList.remove("active"));
          card.classList.add("active");
          card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    });

    document.querySelectorAll(".job-grid-card .job-close-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const card = btn.closest(".job-grid-card");
        if (card) card.classList.remove("active");
      });
    });

    return () => {
      $hamburger?.removeEventListener("click", onHamburger);
      $overlay?.removeEventListener("click", closeMenu);
      window.removeEventListener("popstate", setActiveTeamFromParam);
      if (marqueeRafId) cancelAnimationFrame(marqueeRafId);
    };
  }, []);

  return null;
}

export function LangSwitcherSlot({ lang }: { lang: Lang }) {
  return (
    <Suspense fallback={null}>
      <LanguageSwitcher lang={lang} />
    </Suspense>
  );
}
