<?php
/**
 * Template for displaying single blog posts/articles
 */

get_header(); ?>

<main class="content single-service">

  <!-- Page Header -->
  <section class="service-hero container-small">
    <h1 class="page-title"><?php the_title(); ?></h1>

    <a class="btn-primary" href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">
      <?php echo esc_html(feboko_t('Zurück zur Homepage', 'Back to Homepage')); ?>
    </a>
  </section>


  <!-- Breadcrumbs -->
  <section class="container-small breadcrumbs">
    <a href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">Home</a>
    <span>›</span>
    <a class="current"><?php the_title(); ?></a>
  </section>


  <!-- Layout -->
  <section class="container-small content">

    <!-- Content -->
    <div class="service-content">
      <div class="service-body content no-padding-top" id="article-body">
        <?php the_content(); ?>
      </div>

    </div>
  </section>

</main>

<?php get_footer(); ?>