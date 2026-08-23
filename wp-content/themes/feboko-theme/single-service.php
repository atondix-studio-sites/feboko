<?php
/**
 * Template for displaying single service posts
 */
$language = get_post_meta(get_the_ID(), '_feboko_service_language', true);

get_header(); ?>

<main class="content single-service">

  <!-- Page Header -->
  <section class="service-hero container">
    <h1 class="page-title"><?php echo esc_html(feboko_t('Service', 'Service')); ?>: <?php the_title(); ?></h1>

    <a class="btn-primary" href="<?php echo esc_url(get_post_type_archive_link('service')); ?>">
      <?php echo esc_html(feboko_t('Alle Services entdecken', 'Discover All Services')); ?>
    </a>
  </section>


  <!-- Breadcrumbs -->
  <section class="container breadcrumbs">
    <a href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">Home</a>
    <span>›</span>
    <a href="<?php echo esc_url(get_post_type_archive_link('service')); ?>"><?php echo esc_html(feboko_t('Services', 'Services')); ?></a>
    <span>›</span>
    <a class="current"><?php the_title(); ?></a>
  </section>


  <!-- Layout -->
  <section class="container content service-layout">

    <!-- Sidebar -->
    <div class="service-sidebar">
      <h3><?php echo esc_html(feboko_t('Unsere Services', 'Our Services')); ?></h3>

      <?php
      $current_id = get_the_ID();

      $services = new WP_Query([
        'post_type' => 'service',
        'posts_per_page' => -1,
        'orderby' => 'menu_order',
        'order' => 'ASC',
        'meta_query' => [
          [
            'key' => '_feboko_service_language',
            'value' => feboko_lang(),
          ],
        ],
      ]);

      if ($services->have_posts()):
        while ($services->have_posts()):
          $services->the_post();

          $is_current = ($current_id === get_the_ID()) ? 'current' : '';
          ?>

          <a href="<?php the_permalink(); ?>" <?php if ($current_id === get_the_ID())
              echo 'class="current"'; ?>>
            <?php the_title(); ?>
          </a>

        <?php endwhile;
        wp_reset_postdata();
      endif;
      ?>
    </div>


    <!-- Content -->
    <div class="service-content">

      <div class="service-intro">
        <div class="intro-text">
          <?php
          $second_heading = get_post_meta(get_the_ID(), '_feboko_second_heading', true);

          if ($second_heading) {
            echo '<h2 class="service-second-heading">' . esc_html($second_heading) . '</h2>';
          }
          ?>
          <!-- <h2><?php the_title(); ?></h2> -->
          <div class="lead"><?php the_excerpt(); ?></div>
        </div>

        <?php if (has_post_thumbnail()): ?>
          <div class="intro-image">
            <?php the_post_thumbnail('large'); ?>
          </div>
        <?php endif; ?>
      </div>

      <hr class="small">

      <div class="service-body content">
        <?php the_content(); ?>
      </div>

      <hr>

      <!-- Next Services -->
      <div class="service-next">
        <h2><?php echo esc_html(feboko_t('Weiterlesen', 'Continue Reading')); ?></h2>

        <div class="service-cards">

          <?php
          $all = new WP_Query([
            'post_type' => 'service',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
            'meta_query' => [
              [
                'key' => '_feboko_service_language',
                'value' => feboko_lang(),
              ],
            ],
          ]);

          $ids = [];

          while ($all->have_posts()) {
            $all->the_post();
            $ids[] = get_the_ID();
          }
          wp_reset_postdata();

          $current_index = array_search($current_id, $ids);
          $total = count($ids);

          for ($i = 1; $i <= 3; $i++) {
            $next_id = $ids[($current_index + $i) % $total];
            $post_obj = get_post($next_id);
            ?>

            <article class="service-card">

              <div class="card-image">
                <?php echo get_the_post_thumbnail($next_id, 'medium'); ?>
              </div>

              <h3><?php echo esc_html($post_obj->post_title); ?></h3>

              <p>
                <?php echo wp_trim_words(get_the_excerpt($next_id), 20); ?>
              </p>

              <a href="<?php echo get_permalink($next_id); ?>" class="read-more">
                <?php echo esc_html(feboko_t('Weiterlesen', 'Read More')); ?> →
              </a>

            </article>

          <?php } ?>

        </div>
      </div>

    </div>
  </section>

</main>

<?php get_footer(); ?>