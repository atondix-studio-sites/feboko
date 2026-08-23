<?php get_header(); ?>


<main class="content single-service">

  <!-- Page Header -->
  <section class="service-hero container">
    <h1 class="page-title"><?php echo esc_html(feboko_t('Das FeBoKo Team', 'The FeBoKo Team')); ?></h1>

    <a class="btn-primary" href="<?php echo get_post_type_archive_link('service'); ?>">
      <?php echo esc_html(feboko_t('Unsere Services', 'Our Services')); ?>
    </a>
  </section>


  <!-- Breadcrumbs -->
  <section class="container breadcrumbs">
    <a href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">Home</a>
    <span>›</span>
    <a class="current"><?php echo esc_html(feboko_t('Team', 'Team')); ?></a>
  </section>

  <!-- Introduction Section -->
  <section class="content-section">
    <div class="container content">
      <div class="column-flex-2 layout-about">
        <?php
        $image_id = aboutpage_option('intro', 'image') ?? '';
        ?>

        <div class="column1 text">

          <h2 class="section-title">
            <?php echo esc_html(aboutpage_option('intro', 'title')); ?>
          </h2>

          <p class="section-description">
            <?php echo wp_kses_post(aboutpage_option('intro', 'text')); ?>
          </p>

        </div>
        <div class="column2">
          <?php if ($image_id): ?>
            <?php echo wp_get_attachment_image($image_id, 'full'); ?>
          <?php else: ?>
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/about.jpg'); ?>"
              alt="Introduction FeBoKo">
          <?php endif; ?>
        </div>
      </div>
    </div>
  </section>

  <?php if (have_posts()): ?>
    <!-- Services Section -->
    <section class="content-section">
      <div class="container content">
        <h2 class="section-title">
          <?php echo esc_html(feboko_t('Treffen Sie unser Team', 'Meet Our Team')); ?>
        </h2>
        <div class="team-grid">
          <?php
          $members = new WP_Query([
            'post_type' => 'team',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
          ]);

          if ($members->have_posts()):
            while ($members->have_posts()):
              $members->the_post();
              get_template_part('template-parts/content', 'team');
            endwhile;
            wp_reset_postdata();
          endif;
          ?>
        </div>

      </div>
    <?php endif; ?>
  </section>

  <!-- Mission Section -->
  <section class="content-section">
    <div class="container content">
      <div class="column-flex-2 reverse layout-about">
        <?php
        $image_id = aboutpage_option('mission', 'image') ?? '';
        ?>

        <div class="column1">
          <?php if ($image_id): ?>
            <?php echo wp_get_attachment_image($image_id, 'full'); ?>
          <?php else: ?>
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/mission.jpg'); ?>"
              alt="Mission FeBoKo">
          <?php endif; ?>
        </div>
        <div class="column2 text">

          <h2 class="section-title">
            <?php echo esc_html(aboutpage_option('mission', 'title')); ?>
          </h2>

          <p class="section-description">
            <?php echo wp_kses_post(aboutpage_option('mission', 'text')); ?>
          </p>

          <a href="<?php echo esc_url(feboko_localize_url(home_url('/#contact'))); ?>" class="btn btn-primary">
            <?php echo esc_html(aboutpage_option('mission', 'cta')); ?>
          </a>

        </div>
      </div>
    </div>
  </section>

  <!-- Vision Section -->
  <section class="content-section">
    <div class="container content">
      <div class="column-flex-2 layout-about">
        <?php
        $image_id = aboutpage_option('vision', 'image') ?? '';
        ?>

        <div class="column1 text">

          <h2 class="section-title">
            <?php echo esc_html(aboutpage_option('vision', 'title')); ?>
          </h2>

          <p class="section-description">
            <?php echo wp_kses_post(aboutpage_option('vision', 'text')); ?>
          </p>

        </div>
        <div class="column2">
          <?php if ($image_id): ?>
            <?php echo wp_get_attachment_image($image_id, 'full'); ?>
          <?php else: ?>
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/vision.jpg'); ?>"
              alt="Vision FeBoKo">
          <?php endif; ?>
        </div>
      </div>
    </div>
  </section>
</main>

<?php get_footer(); ?>