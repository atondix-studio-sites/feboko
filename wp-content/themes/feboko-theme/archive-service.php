<?php get_header(); ?>


<main class="content single-service">

  <!-- Page Header -->
  <section class="service-hero container">
    <h1 class="page-title"><?php echo esc_html(feboko_t('Unsere Services für Sie', 'Our Services for You')); ?></h1>

    <a class="btn-primary" href="<?php echo get_post_type_archive_link('team'); ?>">
      <?php echo esc_html(feboko_t('Mehr über uns', 'More About Us')); ?>
    </a>
  </section>


  <!-- Breadcrumbs -->
  <section class="container breadcrumbs">
    <a href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">Home</a>
    <span>›</span>
    <a class="current"><?php echo esc_html(feboko_t('Services', 'Services')); ?></a>
  </section>

  <?php if (have_posts()): ?>
    <!-- Services Section -->
    <section class="content-section">
      <div class="container content">
        <div class="service-grid">
          <?php
          $services = new WP_Query([
            'post_type' => 'service',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
            'meta_query' => [
              [
                'key'   => '_feboko_service_language',
                'value' => feboko_lang(),
              ],
            ],
          ]);

          if ($services->have_posts()):
            while ($services->have_posts()):
              $services->the_post();
              get_template_part('template-parts/content', 'service');
            endwhile;
            wp_reset_postdata();
          endif;
          ?>
        </div>

      </div>

    <?php else: ?>
      <p><?php echo esc_html(feboko_t('Keine Services gefunden.', 'No services found.')); ?></p>
    <?php endif; ?>
  </section>
</main>

<?php get_footer(); ?>