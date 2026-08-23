<?php
/**
 * The front page template file
 *
 * @package FeBoKo
 */


/**
 * Bold the text up to the first colon.
 *
 * @param string $text The text to process.
 * @return string HTML with the first part bolded.
 */
function bold_up_to_colon($text)
{
  $text = esc_html($text); // Sanitize for safe output

  // Split at the first colon
  $parts = explode(':', $text, 2);

  if (isset($parts[1])) {
    // There is a colon
    return '<strong>' . $parts[0] . '</strong>:' . $parts[1];
  } else {
    // No colon found, bold entire text
    return '<strong>' . $text . '</strong>';
  }
}

get_header();
?>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-overlay">
    <?php
    $header_image = get_header_image();
    if ($header_image):
      ?>
      <img src="<?php echo esc_url($header_image); ?>" alt="<?php bloginfo('name'); ?>">
      <?php
    endif;
    ?>
    <div class="hero-gradient"></div>
  </div>

  <div class="hero-content container">
    <span class="hero-subtitle">
      <span class="orange">Your Journey</span>
      <span>Is Our</span>
      <span class="green">Destination</span>
    </span>

    <h1 class="hero-title">
      <?php echo esc_html(frontpage_option('hero', 'title')); ?>
    </h1>

    <a href="#contact" class="hero-cta">
      <?php echo esc_html(frontpage_option('hero', 'cta')); ?>
    </a>
  </div>

  <div class="partner-logos">
    <div class="partner-logos-scroll">
      <?php
      $partners = new WP_Query([
        'post_type' => 'partner',
        'posts_per_page' => -1
      ]);

      while ($partners->have_posts()):
        $partners->the_post();

        $logo_id = get_post_meta(get_the_ID(), '_partner_logo_id', true);

        if ($logo_id) {
          echo wp_get_attachment_image($logo_id, "medium", false);
        }

      endwhile;

      while ($partners->have_posts()):
        $partners->the_post();

        $logo_id = get_post_meta(get_the_ID(), '_partner_logo_id', true);

        if ($logo_id) {
          echo wp_get_attachment_image($logo_id, "medium", false);
        }

      endwhile;

      while ($partners->have_posts()):
        $partners->the_post();

        $logo_id = get_post_meta(get_the_ID(), '_partner_logo_id', true);

        if ($logo_id) {
          echo wp_get_attachment_image($logo_id, "medium", false);
        }

      endwhile;
      wp_reset_postdata();
      ?>
    </div>
  </div>
</section>



<!-- About Section -->
<section class="content-section">
  <div class="container content">
    <div class="column-flex-2 reverse layout-about">
      <?php
      $image_id = frontpage_option('about', 'image') ?? '';
      ?>

      <div class="column1">
        <?php if ($image_id): ?>
          <?php echo wp_get_attachment_image($image_id, 'full'); ?>
        <?php else: ?>
          <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/about.jpg'); ?>" alt="About FeBoKo">
        <?php endif; ?>
      </div>
      <div class="column2 text">

        <h2 class="section-title">
          <?php echo esc_html(frontpage_option('about', 'title')); ?>
        </h2>

        <p class="section-description">
          <strong>
            <?php echo wp_kses_post(frontpage_option('about', 'strong')); ?>
          </strong>
          <?php echo wp_kses_post(frontpage_option('about', 'text')); ?>
        </p>

        <a href="#contact" class="btn btn-primary">
          <?php echo esc_html(frontpage_option('about', 'cta')); ?>
        </a>

      </div>
    </div>
  </div>
</section>

<!-- Running Team Section -->
<section class="content-section bg-primary-very-light">
  <div class="container content">
    <div class="image-header">
      <div class="column1">

        <p class="section-subtitle">
          <?php echo esc_html(frontpage_option('team', 'subtitle')); ?>
        </p>

        <h2 class="section-title">
          <?php echo esc_html(frontpage_option('team', 'title')); ?>
        </h2>

        <p class="section-description">
          <?php echo wp_kses_post(frontpage_option('team', 'text')); ?>
        </p>

        <a href="<?php echo get_post_type_archive_link('team'); ?>" class="btn btn-primary">
          <?php echo esc_html(frontpage_option('team', 'cta')); ?>
        </a>

      </div>
      <div class="column2">
        <?php
        $image_id = frontpage_option('team', 'image') ?? '';
        ?>

        <?php if ($image_id): ?>
          <?php echo wp_get_attachment_image($image_id, 'full', false); ?>
        <?php else: ?>
          <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/neverchangearunningteam.jpg'); ?>"
            alt="Never change a running team">
        <?php endif; ?>

      </div>
    </div>
    <div class="column-flex-2 section-margin">
      <div class="column1">
        <div class="border-box">
          <h3>
            <?php echo esc_html(frontpage_option('team_arg1', 'title')); ?>
          </h3>
          <ul>
            <li>
              <?php echo bold_up_to_colon(frontpage_option('team_arg1', 'li1')); ?>
            </li>
            <li>
              <?php echo bold_up_to_colon(frontpage_option('team_arg1', 'li2')); ?>
            </li>
            <li>
              <?php echo bold_up_to_colon(frontpage_option('team_arg1', 'li3')); ?>
            </li>
          </ul>
        </div>
      </div>
      <div class="column2">
        <div class="border-box">
          <h3>
            <?php echo esc_html(frontpage_option('team_arg2', 'title')); ?>
          </h3>
          <ul>
            <li>
              <?php echo bold_up_to_colon(frontpage_option('team_arg2', 'li1')); ?>
            </li>
            <li>
              <?php echo bold_up_to_colon(frontpage_option('team_arg2', 'li2')); ?>
            </li>
            <li>
              <?php echo bold_up_to_colon(frontpage_option('team_arg2', 'li3')); ?>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="quote-section bg-primary-light">
  <div class="container content">
    <img class="icon1" src="<?php echo esc_url(get_template_directory_uri() . '/assets/icons/quote.svg'); ?>">
    <img class="icon2" src="<?php echo esc_url(get_template_directory_uri() . '/assets/icons/quote.svg'); ?>">
    <p>
      <?php
      $quote = wp_kses_post(frontpage_option('quote', 'text'));

      // Wrap [TEXT] content in <strong> tags
      $quote = preg_replace('/\[(.*?)\]/', '<strong>$1</strong>', $quote);

      echo $quote;
      ?>
    </p>

    <p class="author">
      <?php echo esc_html(frontpage_option('quote', 'author')); ?>
    </p>
  </div>
</section>

<!-- Why FeBoKo Section -->
<section class="content-section">
  <div class="container content">

    <div class="section-header">
      <div class="column1">
        <p class="section-subtitle">
          <?php echo esc_html(frontpage_option('why', 'subtitle')); ?>
        </p>

        <h2 class="section-title">
          <?php echo esc_html(frontpage_option('why', 'title')); ?>
        </h2>
      </div>

      <div class="column2">
        <p class="section-description">
          <?php echo wp_kses_post(frontpage_option('why', 'text')); ?>
        </p>

        <a href="<?php echo get_post_type_archive_link('team'); ?>" class="btn-primary">
          <?php echo esc_html(frontpage_option('why', 'cta')); ?>
        </a>
      </div>
    </div>

    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-header">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <span class="feature-number">01</span>
        </div>
        <h3 class="feature-title">
          <?php echo esc_html(frontpage_option('why_arg1', 'title')); ?>
        </h3>
        <p class="feature-description">
          <?php echo wp_kses_post(frontpage_option('why_arg1', 'text')); ?>
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-header">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <span class="feature-number">02</span>
        </div>
        <h3 class="feature-title">
          <?php echo esc_html(frontpage_option('why_arg2', 'title')); ?>
        </h3>
        <p class="feature-description">
          <?php echo wp_kses_post(frontpage_option('why_arg2', 'text')); ?>
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-header">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
          </div>
          <span class="feature-number">03</span>
        </div>
        <h3 class="feature-title">
          <?php echo esc_html(frontpage_option('why_arg3', 'title')); ?>
        </h3>
        <p class="feature-description">
          <?php echo wp_kses_post(frontpage_option('why_arg3', 'text')); ?>
        </p>
      </div>
    </div>
    <p class="section-footnote">
      <?php echo esc_html(frontpage_option('why', 'bottom')); ?>
    </p>
  </div>
</section>


<!-- Free Consultation Section -->
<section class="content-section bg-primary-light">
  <div class="container content">
    <div class="section-header no-margin">

      <div class="column1">
        <p class="section-subtitle">
          <?php echo esc_html(frontpage_option('consult', 'subtitle')); ?>
        </p>

        <h2 class="section-title">
          <?php echo esc_html(frontpage_option('consult', 'title')); ?>
        </h2>
      </div>

      <div class="column2">
        <p class="section-description">
          <?php echo wp_kses_post(frontpage_option('consult', 'text')); ?>
        </p>

        <a href="#contact" class="btn-primary">
          <?php echo esc_html(frontpage_option('consult', 'cta')); ?>
        </a>
      </div>

    </div>
  </div>
</section>

<!-- Services Section -->
<section class="content-section bg-primary-very-light">
  <div class="container content">

    <div class="section-header">
      <div class="column1">
        <p class="section-subtitle">
          <?php echo esc_html(frontpage_option('services', 'subtitle')); ?>
        </p>

        <h2 class="section-title">
          <?php echo esc_html(frontpage_option('services', 'title')); ?>
        </h2>
      </div>

      <div class="column2">
        <p class="section-description">
          <?php echo wp_kses_post(frontpage_option('services', 'text')); ?>
        </p>

        <a href="<?php echo get_post_type_archive_link('service'); ?>" class="btn-primary">
          <?php echo esc_html(frontpage_option('services', 'cta')); ?>
        </a>
      </div>
    </div>
  </div>

  <div class="service-carousel">
    <button class="service-carousel-arrow service-carousel-arrow--left" id="service-carousel-prev" aria-label="Previous">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>

    <div class="service-carousel-viewport">
      <div class="service-carousel-track" id="service-carousel-track">
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

    <button class="service-carousel-arrow service-carousel-arrow--right" id="service-carousel-next" aria-label="Next">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>
  </div>

</section>

<!-- Why India Section -->
<section class="content-section">
  <div class="container content">
    <div class="section-header">
      <div class="column1">
        <p class="section-subtitle">
          <?php echo esc_html(frontpage_option('india', 'subtitle')); ?>
        </p>

        <h2 class="section-title">
          <?php echo esc_html(frontpage_option('india', 'title')); ?>
        </h2>
      </div>

      <div class="column2">
        <p class="section-description">
          <?php echo wp_kses_post(frontpage_option('india', 'text')); ?>
        </p>

        <a href="<?php echo get_post_type_archive_link('team'); ?>" class="btn-primary">
          <?php echo esc_html(frontpage_option('india', 'cta')); ?>
        </a>
      </div>
    </div>

    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-header">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <span class="feature-number">01</span>
        </div>
        <h3 class="feature-title">
          <?php echo esc_html(frontpage_option('india_arg1', 'title')); ?>
        </h3>
        <p class="feature-subtitle">
          <?php echo esc_html(frontpage_option('india_arg1', 'subtitle')); ?>
        </p>
        <p class="feature-description">
          <?php echo wp_kses_post(frontpage_option('india_arg1', 'text')); ?>
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-header">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <span class="feature-number">02</span>
        </div>
        <h3 class="feature-title">
          <?php echo esc_html(frontpage_option('india_arg2', 'title')); ?>
        </h3>
        <p class="feature-subtitle">
          <?php echo esc_html(frontpage_option('india_arg2', 'subtitle')); ?>
        </p>
        <p class="feature-description">
          <?php echo wp_kses_post(frontpage_option('india_arg2', 'text')); ?>
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-header">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <span class="feature-number">03</span>
        </div>
        <h3 class="feature-title">
          <?php echo esc_html(frontpage_option('india_arg3', 'title')); ?>
        </h3>
        <p class="feature-subtitle">
          <?php echo esc_html(frontpage_option('india_arg3', 'subtitle')); ?>
        </p>
        <p class="feature-description">
          <?php echo wp_kses_post(frontpage_option('india_arg3', 'text')); ?>
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Our Founders Section -->
<section class="content-section">
  <div class="container content">
    <div class="section-header">
      <div class="column1">
        <p class="section-subtitle">
          <?php echo esc_html(frontpage_option('founders', 'subtitle')); ?>
        </p>

        <h2 class="section-title">
          <?php echo esc_html(frontpage_option('founders', 'title')); ?>
        </h2>
      </div>

      <div class="column2">
        <p class="section-description">
          <?php echo wp_kses_post(frontpage_option('founders', 'text')); ?>
        </p>

        <a href="<?php echo get_post_type_archive_link('team'); ?>" class="btn-primary">
          <?php echo esc_html(frontpage_option('founders', 'cta')); ?>
        </a>
      </div>
    </div>

    <div class="founder-quotes">

      <!-- Founder Card 1: Philipp Kolb -->
      <div class="founder-card" id="founder-card-1">
        <div class="founder-card-header">
          <div class="founder-card-avatar">
            <?php
            $founder1_image = frontpage_option('founder1', 'image') ?? '';
            if ($founder1_image):
              echo wp_get_attachment_image($founder1_image, 'thumbnail', false, ['class' => 'founder-avatar-img']);
            else:
            ?>
              <img class="founder-avatar-img" src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/founder1.jpg'); ?>" alt="Philipp Kolb">
            <?php endif; ?>
          </div>
          <div class="founder-card-info">
            <h4 class="founder-card-name">Philipp Kolb</h4>
            <p class="founder-card-title">Founder & Managing Director</p>
          </div>
        </div>
        <div class="founder-card-body">
          <p class="founder-card-text">
            <?php echo wp_kses_post(frontpage_option('founders', 'philipp')); ?>
          </p>
        </div>
        <button class="founder-card-toggle" onclick="toggleFounderCard(this)">
          <span class="toggle-more"><?php echo esc_html(feboko_lang() === 'en' ? 'Show more' : 'Mehr anzeigen'); ?></span>
          <span class="toggle-less"><?php echo esc_html(feboko_lang() === 'en' ? 'Show less' : 'Weniger anzeigen'); ?></span>
        </button>
      </div>

      <!-- Founder Card 2: Matthias Feist -->
      <div class="founder-card" id="founder-card-2">
        <div class="founder-card-header">
          <div class="founder-card-avatar">
            <?php
            $founder2_image = frontpage_option('founder2', 'image') ?? '';
            if ($founder2_image):
              echo wp_get_attachment_image($founder2_image, 'thumbnail', false, ['class' => 'founder-avatar-img']);
            else:
            ?>
              <img class="founder-avatar-img" src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/founder2.jpg'); ?>" alt="Matthias Feist">
            <?php endif; ?>
          </div>
          <div class="founder-card-info">
            <h4 class="founder-card-name">Matthias Feist</h4>
            <p class="founder-card-title">Founder & Managing Director</p>
          </div>
        </div>
        <div class="founder-card-body">
          <p class="founder-card-text"> 
            <?php echo wp_kses_post(frontpage_option('founders', 'Matthias')); ?>
          </p>
        </div>
        <button class="founder-card-toggle" onclick="toggleFounderCard(this)">
          <span class="toggle-more"><?php echo esc_html(feboko_lang() === 'en' ? 'Show more' : 'Mehr anzeigen'); ?></span>
          <span class="toggle-less"><?php echo esc_html(feboko_lang() === 'en' ? 'Show less' : 'Weniger anzeigen'); ?></span>
        </button>
      </div>

    </div>

    <script>
      function toggleFounderCard(btn) {
        var card = btn.closest('.founder-card');
        card.classList.toggle('is-expanded');
      }
    </script>
  </div>
</section>

<?php
get_footer();
