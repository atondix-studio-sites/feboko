<?php get_header(); ?>


<main class="content single-service">

  <!-- Page Header -->
  <section class="service-hero container">
    <h1 class="page-title"><?php echo esc_html(feboko_t('FeBoKo Consulting Blog', 'FeBoKo Consulting Blog')); ?></h1>

    <a class="btn-primary" href="<?php echo esc_url(get_post_type_archive_link('team')); ?>">
      <?php echo esc_html(feboko_t('Mehr über uns', 'More About Us')); ?>
    </a>
  </section>


  <!-- Breadcrumbs -->
  <section class="container breadcrumbs">
    <a href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">Home</a>
    <span>›</span>
    <a class="current"><?php echo esc_html(feboko_t('Blog', 'Blog')); ?></a>
  </section>

  <?php if (have_posts()): ?>
    <!-- Blog Section -->
    <section class="content-section">
      <div class="container content">
        <div class="blog-grid">
          <?php
          while (have_posts()):
            the_post();
            get_template_part('template-parts/content', 'blog');
          endwhile;

          the_posts_navigation();
          ?>
        </div>
      </div>
    </section>
  <?php else: ?>
    <section class="content-section">
      <div class="container content">
        <p><?php echo esc_html(feboko_t('Keine Artikel gefunden.', 'No articles found.')); ?></p>
      </div>
    </section>
  <?php endif; ?>
</main>

<?php get_footer(); ?>
