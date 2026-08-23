<?php
get_header();

$lang = feboko_lang();
?>

<main class="page-404">
  <div class="container content">
    <section class="page-404-hero">

      <h1 class="page-title">
        <?php echo ($lang === 'de') ? 'Hoppla – Seite nicht gefunden' : 'Oops – Page not found'; ?>
      </h1>
      <p class="page-subtitle">
        <?php echo ($lang === 'de') ? 'Wir können die von Ihnen gesuchte Seite nicht finden.' : 'We can\'t find the page you were looking for.'; ?>
      </p>

      <div class="page-actions">
        <a class="btn-primary" href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">
          <?php echo ($lang === 'de') ? 'Zur Startseite' : 'Go to Homepage'; ?>
        </a>
      </div>

    </section>
  </div>
</main>

<?php
get_footer();
