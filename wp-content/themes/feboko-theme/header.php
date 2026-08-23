<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="google-site-verification" content="q_8w_CFvSt6Jrdx2qk_kwga0MKt4_w3bV8ygDBDgmG0" />
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
  <?php wp_body_open(); ?>

  <header class="site-header">
    <div class="container">
      <div class="site-logo">
        <?php
        if (has_custom_logo()):
          the_custom_logo();
        else:
          ?>
          <a href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/logo.svg'); ?>"
              alt="<?php bloginfo('name'); ?>" width="161" height="65">
          </a>
          <?php
        endif;
        ?>
      </div>

      <button class="hamburger-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <?php feboko_primary_menu(); ?>

      <?php feboko_language_switcher(); ?>
    </div>
    <div class="mobile-menu-overlay"></div>
  </header>