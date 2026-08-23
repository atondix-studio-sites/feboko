/**
 * FeBoKo Theme JavaScript
 */

(function ($) {
  "use strict";

  $(document).ready(function () {
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on("click", function (event) {
      var target = $(this.getAttribute("href"));
      if (target.length) {
        event.preventDefault();
        $("html, body")
          .stop()
          .animate(
            {
              scrollTop: target.offset().top - 100,
            },
            1000,
          );
      }
    });

    // Hamburger mobile menu toggle
    var $hamburger = $(".hamburger-toggle");
    var $nav = $("nav.nav-container");
    var $overlay = $(".mobile-menu-overlay");
    var $langSwitcher = $(".language-switcher");
    var $headerContainer = $(".site-header > .container");
    var langMovedIntoNav = false;

    // Move language switcher into nav panel for mobile
    function moveLangSwitcherIntoNav() {
      if (!langMovedIntoNav && $langSwitcher.length && $nav.length) {
        $nav.append($langSwitcher);
        langMovedIntoNav = true;
      }
    }

    // Move language switcher back to header for desktop
    function moveLangSwitcherToHeader() {
      if (langMovedIntoNav && $langSwitcher.length && $headerContainer.length) {
        $headerContainer.append($langSwitcher);
        langMovedIntoNav = false;
      }
    }

    // On load: move if already in mobile viewport
    if ($(window).width() <= 768) {
      moveLangSwitcherIntoNav();
    }

    function openMenu() {
      moveLangSwitcherIntoNav();
      $hamburger.addClass("active").attr("aria-expanded", "true");
      $nav.addClass("active");
      $overlay.addClass("active");
      $("body").addClass("menu-open");
    }

    function closeMenu() {
      $hamburger.removeClass("active").attr("aria-expanded", "false");
      $nav.removeClass("active");
      $overlay.removeClass("active");
      $("body").removeClass("menu-open");
    }

    $hamburger.on("click", function () {
      if ($nav.hasClass("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when a nav link is clicked
    $nav.on("click", "a", function (e) {
      // Don't close if the link is inside the mega menu panel (prevent accidental closure)
      if ($(this).closest("#mega-menu-panel").length) {
        return;
      }
      closeMenu();
    });

    // Close menu when overlay is clicked
    $overlay.on("click", function () {
      closeMenu();
    });

    // Close menu if window resized above mobile breakpoint
    $(window).on("resize", function () {
      if ($(window).width() > 768) {
        if ($nav.hasClass("active")) {
          closeMenu();
        }
        moveLangSwitcherToHeader();
      } else {
        moveLangSwitcherIntoNav();
      }
    });

    // Team member toggle
    $(".team-toggle").on("click", function () {
      var card = $(this).closest(".team-card");
      card.toggleClass("expanded");

      if (card.hasClass("expanded")) {
        $(this).text(febokoI18n.showLess);
      } else {
        $(this).text(febokoI18n.showMore);
      }
    });

    // Form validation
    $("form").on("submit", function (e) {
      var isValid = true;

      $(this)
        .find("input[required], textarea[required]")
        .each(function () {
          if ($(this).val().trim() === "") {
            isValid = false;
            $(this).addClass("error");
          } else {
            $(this).removeClass("error");
          }
        });

      // Email validation
      var emailField = $(this).find('input[type="email"]');
      if (emailField.length) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.val())) {
          isValid = false;
          emailField.addClass("error");
        }
      }

      if (!isValid) {
        e.preventDefault();
        alert(febokoI18n.formError);
      }
    });

    // Remove error class on input
    $("input, textarea").on("focus", function () {
      $(this).removeClass("error");
    });

    // Sticky header on scroll
    var header = $(".site-header");
    var lastScrollTop = 0;
    var scrollUpAccumulated = 0;
    var scrollDownAccumulated = 0;
    var headerVisible = false;
    var scrollUpThreshold = 10;
    var scrollDownThreshold = 30;
    var isMobile = $(window).width() <= 768;

    $(window).on("scroll", function () {
      var currentScroll = $(window).scrollTop();

      // Add sticky styling when scrolled past 10px
      if (currentScroll > 10) {
        header.addClass("sticky");
      } else {
        header.removeClass("sticky");
      }

      // Mobile-specific behavior: hide after 100px scroll down, show after 50px scroll up
      if (isMobile) {
        if (currentScroll <= 0) {
          // At the very top – show header
          header.removeClass("header-invisible");
          headerVisible = false;
          scrollUpAccumulated = 0;
          scrollDownAccumulated = 0;
        } else if (currentScroll < lastScrollTop) {
          // Scrolling up
          scrollDownAccumulated = 0; // Reset down accumulator
          scrollUpAccumulated += lastScrollTop - currentScroll;
          if (scrollUpAccumulated >= scrollUpThreshold && !headerVisible) {
            header.removeClass("header-invisible");
            headerVisible = true;
            scrollUpAccumulated = 0;
          }
        } else {
          // Scrolling down
          scrollUpAccumulated = 0; // Reset up accumulator
          scrollDownAccumulated += currentScroll - lastScrollTop;
          if (scrollDownAccumulated >= scrollDownThreshold && headerVisible) {
            header.addClass("header-invisible");
            headerVisible = false;
            scrollDownAccumulated = 0;
          }
        }
      }

      lastScrollTop = currentScroll;
    });

    // Fade in elements on scroll
    function fadeInOnScroll() {
      $(".feature-card, .service-card, .team-card").each(function () {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        if (elementBottom > viewportTop && elementTop < viewportBottom) {
          $(this).addClass("fade-in");
        }
      });
    }

    $(window).on("scroll", fadeInOnScroll);
    fadeInOnScroll(); // Run on page load

    // Job Card read-more: toggle active state (team-showcase style)
    $(document).on("click", ".job-grid-card .read-more", function (e) {
      e.preventDefault();
      var $card = $(this).closest(".job-grid-card");

      if ($card.hasClass("active")) {
        $card.removeClass("active");
      } else {
        $(".job-grid-card").removeClass("active");
        $card.addClass("active");
        $card[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    // Job Card close button: collapse the active card
    $(document).on("click", ".job-grid-card .job-close-btn", function (e) {
      e.preventDefault();
      $(this).closest(".job-grid-card").removeClass("active");
    });

    // Seamless partner logo marquee
    if ($(".partner-logos-scroll").length) {
      var $scroll = $(".partner-logos-scroll");
      var scrollWidth = 0;

      // Measure the width of the first set of logos (before duplication)
      function measureFirstSet() {
        var $imgs = $scroll.find("img");
        var count = $imgs.length / 3; // Half are duplicates
        var width = 0;
        var gaps = count - 1; // Number of gaps between logos

        for (var i = 0; i < count; i++) {
          width += $imgs.eq(i).outerWidth(true); // Include margins
        }

        // Add the gap spacing
        width += gaps * 100;

        return width;
      }

      scrollWidth = measureFirstSet();

      // Create seamless animation using requestAnimationFrame
      var speed = 0.5; // pixels per frame
      var currentPosition = 0;

      function animate() {
        currentPosition += speed;

        // Reset position seamlessly when we've scrolled one set
        if (currentPosition >= scrollWidth) {
          currentPosition = 0;
        }

        $scroll.css("transform", "translateX(-" + currentPosition + "px)");
        requestAnimationFrame(animate);
      }

      animate();
    }
  });
})(jQuery);

/* Team read-more: prevent page reload, toggle active card and update URL */
(function ($) {
  "use strict";

  $(function () {
    var paramName = "active";

    function setActiveFromParam() {
      var params = new URLSearchParams(window.location.search);
      var id = params.get(paramName);

      $(".team-grid-card").removeClass("active");

      if (id) {
        var $card = $('.team-grid-card[data-team-id="' + id + '"]');
        if ($card.length) {
          $card.addClass("active");
        }
      }
    }

    // Initialize active state from URL
    setActiveFromParam();

    // Click handler: prevent full page reload and use history API
    $(document).on("click", ".team-grid-card .read-more", function (e) {
      e.preventDefault();
      var $link = $(this);
      var $card = $link.closest(".team-grid-card");
      var id = String($card.data("team-id"));

      var url = new URL(window.location.href);

      if ($card.hasClass("active")) {
        // deactivate: remove param
        url.searchParams.delete(paramName);
        history.pushState(
          {},
          "",
          url.pathname + (url.search ? "?" + url.searchParams.toString() : ""),
        );
        $card.removeClass("active");
      } else {
        // activate: set param and remove active from others
        url.searchParams.set(paramName, id);
        history.pushState(
          {},
          "",
          url.pathname + "?" + url.searchParams.toString(),
        );
        $(".team-grid-card").removeClass("active");
        $card.addClass("active");
        // optionally scroll into view
        $card[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    // Handle browser navigation (back/forward)
    window.addEventListener("popstate", function () {
      setActiveFromParam();
    });
  });
})(jQuery);




/* ===== MEGA MENU — Services navigation ===== */
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  var OPEN_DELAY  = 40;   // ms before opening on mouse enter (Debounced/Intentional)
  var CLOSE_DELAY = 150;  // ms grace period before closing on mouse leave

  // Touch detection: on devices that do not support hover (touch-primary),
  // use tap-to-open instead of mouse events.
  var isTouch = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---------------------------------------------------------------------------
  // DOM references (resolved once on DOMContentLoaded)
  // ---------------------------------------------------------------------------
  var $li        = null; // .menu-item-has-mega-menu
  var $link      = null; // .mega-menu-trigger-link (the <a>)
  var $toggle    = null; // .mega-menu-toggle (the <button>)
  var $panel     = null; // #mega-menu-panel
  var $cats      = null; // .mega-menu-category NodeList
  var $lists     = null; // .mega-menu-subservice-list NodeList

  var openTimer  = null;
  var closeTimer = null;
  var isOpen     = false;
  var hoverInitialized = false;

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function openMenu() {
    if (isOpen) return;
    isOpen = true;
    $li.classList.add("mega-menu-open");
    $panel.removeAttribute("aria-hidden");
    $panel.setAttribute("aria-hidden", "false");
    if ($toggle) $toggle.setAttribute("aria-expanded", "true");
    // Ensure first category is active on fresh open
    activateCategory(0);
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    $li.classList.remove("mega-menu-open");
    $panel.setAttribute("aria-hidden", "true");
    if ($toggle) $toggle.setAttribute("aria-expanded", "false");
  }

  function activateCategory(index) {
    if (!$cats || !$lists) return;

    $cats.forEach(function (cat, i) {
      var active = i === index;
      cat.classList.toggle("is-active", active);
      cat.setAttribute("aria-current", active ? "true" : "false");
    });

    $lists.forEach(function (list, i) {
      var visible = i === index;
      list.classList.toggle("is-visible", visible);
      list.setAttribute("aria-hidden", visible ? "false" : "true");

      // Allow / prevent tab into hidden lists
      list.querySelectorAll("a").forEach(function (a) {
        a.tabIndex = visible ? 0 : -1;
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Desktop: hover behaviour (only when hover is available)
  // ---------------------------------------------------------------------------
  function initDesktopHover() {
    if (hoverInitialized) return;
    hoverInitialized = true;

    // Mouse enters the <li> (category nav sits inside, no gap)
    $li.addEventListener("mouseenter", function () {
      clearTimeout(closeTimer);
      openTimer = setTimeout(openMenu, OPEN_DELAY);
    });

    // Mouse leaves the <li> — this covers leaving the nav link OR the panel
    // because the panel is a DOM child of the <li>.
    $li.addEventListener("mouseleave", function () {
      clearTimeout(openTimer);
      closeTimer = setTimeout(closeMenu, CLOSE_DELAY);
    });

    // Category hover — switch active subservice panel
    $cats.forEach(function (cat, index) {
      cat.addEventListener("mouseenter", function () {
        activateCategory(index);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Desktop: keyboard / focus behaviour
  // ---------------------------------------------------------------------------
  function initKeyboard() {
    // Focusing the Services <a> opens the menu
    if ($link) {
      $link.addEventListener("focus", function () {
        clearTimeout(closeTimer);
        openMenu();
      });
    }

    // Focusing the toggle button also opens (for keyboard users on mobile
    // who might be interacting via keyboard on the desktop layout)
    if ($toggle) {
      $toggle.addEventListener("focus", function () {
        // Only handle on non-mobile layouts where toggle is visible
        var style = window.getComputedStyle($toggle);
        if (style.display !== "none") {
          // Mobile — let the click handler deal with it
          return;
        }
        clearTimeout(closeTimer);
        openMenu();
      });
    }

    // Category focus — switch active panel
    $cats.forEach(function (cat, index) {
      cat.addEventListener("focus", function () {
        openMenu();
        activateCategory(index);
      });
    });

    // Escape closes
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) {
        closeMenu();
        if ($link) $link.focus();
      }
    });

    // Close when focus leaves the entire <li>
    $li.addEventListener("focusout", function () {
      // Use rAF so document.activeElement settles after the blur event
      requestAnimationFrame(function () {
        if (!$li.contains(document.activeElement)) {
          closeMenu();
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Mobile: tap accordion
  // ---------------------------------------------------------------------------
  function initMobileAccordion() {
    if (!$toggle) return;

    $toggle.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent bubbling to $nav click handler
      var expanded = $toggle.getAttribute("aria-expanded") === "true";
      $toggle.setAttribute("aria-expanded", String(!expanded));
      $panel.classList.toggle("is-expanded", !expanded);
      $panel.setAttribute("aria-hidden", expanded ? "true" : "false");
    });

    // Per-category tap to expand subservices inline.
    // The mobile layout wraps each category in .mega-menu-category-wrapper.
    var wrappers = document.querySelectorAll(".mega-menu-category-wrapper");
    wrappers.forEach(function (wrapper) {
      var catLink = wrapper.querySelector(".mega-menu-category");
      if (!catLink) return;

      var sub = wrapper.querySelector(".mega-menu-category-mobile-sub");
      if (!sub) return; // No subservices — let link navigate normally

      // Prevent link from navigating; toggle sub instead
      catLink.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent bubbling to $nav click handler
        var expanded = wrapper.classList.contains("is-sub-expanded");
        // Collapse all others
        wrappers.forEach(function (w) { w.classList.remove("is-sub-expanded"); });
        if (!expanded) {
          wrapper.classList.add("is-sub-expanded");
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  function init() {
    $li     = document.querySelector(".menu-item-has-mega-menu");
    $link   = document.querySelector(".mega-menu-trigger-link");
    $toggle = document.querySelector(".mega-menu-toggle");
    $panel  = document.getElementById("mega-menu-panel");

    if (!$li || !$panel) return; // Mega menu not present on this page

    $cats  = Array.from(document.querySelectorAll(".mega-menu-category"));
    $lists = Array.from(document.querySelectorAll(".mega-menu-subservice-list"));

    // Keyboard is always enabled regardless of touch.
    initKeyboard();

    // Mobile accordion is always set up (safe even if desktop — it's CSS-hidden).
    initMobileAccordion();

    updateMegaMenuLayout();
    window.addEventListener("resize", updateMegaMenuLayout);
  }

  function updateMegaMenuLayout() {
    if (!$link) return;

    // Never use inline display — CSS handles mobile/desktop visibility and
    // survives viewport changes (e.g. mobile menu → desktop resize).
    $link.style.removeProperty("display");

    var isMobileViewport = window.innerWidth <= 768;

    if (!isTouch && !isMobileViewport) {
      initDesktopHover();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

