<?php get_header(); ?>


<main class="content single-service">

  <!-- Page Header -->
  <section class="service-hero container">
    <h1 class="page-title"><?php echo esc_html(feboko_t('Starte deine Karriere bei FeBoKo', 'Start your career at FeBoKo')); ?></h1>

    <a class="btn-primary" href="<?php echo get_post_type_archive_link('team'); ?>">
      <?php echo esc_html(feboko_t('Mehr über uns', 'More About Us')); ?>
    </a>
  </section>


  <!-- Breadcrumbs -->
  <section class="container breadcrumbs">
    <a href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">Home</a>
    <span>›</span>
    <a class="current"><?php echo esc_html(feboko_t('Karriere', 'Careers')); ?></a>
  </section>


  <!-- Introduction Section -->
  <section class="content-section">
    <div class="container content">
      <div class="column-flex-2 layout-about">
      <?php
      $image_id = careerpage_option('about', 'image') ?? '';
      ?>


        <div class="column1 text">

          <h2 class="section-title">
          <?php echo esc_html(careerpage_option('about', 'title')); ?>
          </h2>

          <p class="section-description">
          <?php echo wp_kses_post(careerpage_option('about', 'text')); ?>
          </p>

        </div>
        <div class="column2">
        <?php if ($image_id): ?>
          <?php echo wp_get_attachment_image($image_id, 'full'); ?>
        <?php else: ?>
          <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/about.jpg'); ?>" alt="About FeBoKo">
        <?php endif; ?>
        </div>
      </div>
    </div>
  </section>



  <section class="content-section bg-primary-light">
    <div class="container content">
      <div class="section-header no-margin">

        <div class="column1">
          <?php $init_subtitle = careerpage_option('initiative', 'subtitle'); ?>
          <?php if ($init_subtitle): ?>
            <p class="section-subtitle">
              <?php echo esc_html($init_subtitle); ?>
            </p>
          <?php endif; ?>

          <?php $init_title = careerpage_option('initiative', 'title'); ?>
          <?php if ($init_title): ?>
            <h2 class="section-title">
              <?php echo esc_html($init_title); ?>
            </h2>
          <?php endif; ?>
        </div>

        <div class="column2">
          <?php $init_text = careerpage_option('initiative', 'text'); ?>
          <?php if ($init_text): ?>
            <p class="section-description">
              <?php echo wp_kses_post($init_text); ?>
            </p>
          <?php endif; ?>

          <?php
          $init_cta = careerpage_option('initiative', 'cta');
          $init_cta_link = careerpage_option('initiative', 'cta_link') ?: '#contact';
          ?>
          <?php if ($init_cta): ?>
            <a href="<?php echo esc_url($init_cta_link); ?>" class="btn-primary">
              <?php echo esc_html($init_cta); ?>
            </a>
          <?php endif; ?>
        </div>

      </div>
    </div>
  </section>

  <?php if (have_posts()): ?>
    <!-- Jobs Section -->
    <section class="content-section">
      <div class="container content">
        <div class="job-grid">
          <?php
          $jobs = new WP_Query([
            'post_type' => 'job',
            'posts_per_page' => -1,
            'orderby' => 'menu_order title',
            'order' => 'ASC',
          ]);

          if ($jobs->have_posts()):
            while ($jobs->have_posts()):
              $jobs->the_post();
              get_template_part('template-parts/content', 'job');
            endwhile;
            wp_reset_postdata();
          endif;
          ?>
        </div>

      </div>

    <?php else: ?>
      <p><?php echo esc_html(feboko_t('Aktuell haben wir keine offenen Job-Positionen.', 'We currently do not have any open job positions.')); ?></p>
    <?php endif; ?>
  </section>
</main>

<?php get_footer(); ?>