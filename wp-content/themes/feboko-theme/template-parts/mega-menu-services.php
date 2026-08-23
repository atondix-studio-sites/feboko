<?php
/**
 * Mega Menu Panel — Services
 *
 * Injected inside the Services <li> by the walker_nav_menu_start_el filter.
 * Reads _feboko_mega_menu_items meta from each service post.
 *
 * @package FeBoKo
 */

if (!defined('ABSPATH')) {
  exit;
}

$lang = feboko_lang();

$services = new WP_Query([
  'post_type'      => 'service',
  'posts_per_page' => -1,
  'orderby'        => 'menu_order',
  'order'          => 'ASC',
  'meta_query'     => [
    [
      'key'   => '_feboko_service_language',
      'value' => $lang,
    ],
  ],
]);

if (!$services->have_posts()) {
  return;
}

$archive_url = esc_url(get_post_type_archive_link('service'));
$all_label   = feboko_t('Alle Services', 'All Services');

$items = [];
while ($services->have_posts()) {
  $services->the_post();
  $raw_meta = get_post_meta(get_the_ID(), '_feboko_mega_menu_items', true);

  // Parse subservice labels — one per line, strip empty lines and section headers.
  $subservices = [];
  // These are h3 section headings from service pages — exclude from mega menu.
  $excluded_labels = [
    'unsere schwerpunkte',
    'unsere stärken',
    'our focus areas',
    'our strengths',
    'our strenghts',
  ];
  if (!empty($raw_meta)) {
    $lines = explode("\n", $raw_meta);
    foreach ($lines as $line) {
      $label = trim($line);
      if ($label !== '' && !in_array(mb_strtolower($label), $excluded_labels, true)) {
        $subservices[] = $label;
      }
    }
  }

  $items[] = [
    'id'          => get_the_ID(),
    'title'       => get_the_title(),
    'url'         => get_permalink(),
    'subservices' => $subservices,
  ];
}
wp_reset_postdata();

if (empty($items)) {
  return;
}
?>

<div
  class="mega-menu-panel"
  id="mega-menu-panel"
  role="region"
  aria-label="<?php echo esc_attr(feboko_t('Services', 'Services')); ?>"
  aria-hidden="true"
>
  <div class="mega-menu-inner container">

    <!-- Left: Category list -->
    <nav class="mega-menu-categories" lang="<?php echo esc_attr(feboko_lang()); ?>" aria-label="<?php echo esc_attr(feboko_t('Service-Kategorien', 'Service categories')); ?>">
      <?php foreach ($items as $index => $item) : ?>
        <div class="mega-menu-category-wrapper">
          <a
            href="<?php echo esc_url($item['url']); ?>"
            class="mega-menu-category<?php echo ($index === 0) ? ' is-active' : ''; ?><?php echo !empty($item['subservices']) ? ' has-sub' : ''; ?>"
            data-mega-index="<?php echo esc_attr($index); ?>"
            <?php echo ($index === 0) ? 'aria-current="true"' : ''; ?>
          >
            <?php echo esc_html($item['title']); ?>
            <span class="mega-menu-category-arrow" aria-hidden="true">›</span>
          </a>

          <?php if (!empty($item['subservices'])) : ?>
            <!-- Mobile inline sub-list (hidden on desktop via CSS) -->
            <ul class="mega-menu-category-mobile-sub" aria-label="<?php echo esc_attr($item['title']); ?>">
              <?php foreach ($item['subservices'] as $label) : ?>
                <li>
                  <a href="<?php echo esc_url($item['url'] . '#' . sanitize_title($label)); ?>">
                    <?php echo esc_html($label); ?>
                  </a>
                </li>
              <?php endforeach; ?>
            </ul>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>
    </nav>


    <!-- Right: Subservice lists, one per category -->
    <div class="mega-menu-subservices">
      <?php foreach ($items as $index => $item) : ?>
        <div
          class="mega-menu-subservice-list<?php echo ($index === 0) ? ' is-visible' : ''; ?>"
          data-mega-list="<?php echo esc_attr($index); ?>"
          aria-hidden="<?php echo ($index === 0) ? 'false' : 'true'; ?>"
        >
          <div class="mega-menu-subservice-header">
            <a href="<?php echo $archive_url; ?>" class="mega-menu-overview-link">
              <?php echo esc_html(feboko_t('Alle Leistungen im Überblick', 'All services overview')); ?> →
            </a>
          </div>

          <ul class="mega-menu-links">
            <?php if (!empty($item['subservices'])) : ?>
              <?php foreach ($item['subservices'] as $label) : ?>
                <li>
                  <a href="<?php echo esc_url($item['url'] . '#' . sanitize_title($label)); ?>">
                    <?php echo esc_html($label); ?>
                  </a>
                </li>
              <?php endforeach; ?>
            <?php else : ?>
              <li class="mega-menu-subservice-empty">
                <a href="<?php echo esc_url($item['url']); ?>">
                  <?php echo esc_html($item['title']); ?>
                </a>
              </li>
            <?php endif; ?>
          </ul>
        </div>
      <?php endforeach; ?>
    </div>


    <!-- Right: Advantage/Spotlight Column -->
    <aside class="mega-menu-advantage" aria-label="<?php echo esc_attr(feboko_t('Der FeBoKo-Vorsprung', 'The FeBoKo Advantage')); ?>">
      <h3 class="mega-menu-advantage-title"><?php echo esc_html(feboko_t('Der FeBoKo-Vorsprung', 'The FeBoKo Advantage')); ?></h3>
      <div class="mega-menu-advantage-content">
        <p><?php echo esc_html(feboko_t('Wir begleiten mittelständische Unternehmen bei der Transformation. Mit Praxiserfahrung und strategischem Weitblick schaffen wir messbare Ergebnisse.', 'We support medium-sized companies in their transformation. With practical experience and strategic vision, we create measurable results.')); ?></p>
      </div>
      <a href="<?php echo esc_url(feboko_localize_url(home_url('/#contact'))); ?>" class="mega-menu-advantage-cta">
        <?php echo esc_html(feboko_t('Kostenloses Erstgespräch', 'Free consultation')); ?>
      </a>
    </aside>

  </div><!-- .mega-menu-inner -->
</div><!-- .mega-menu-panel -->
