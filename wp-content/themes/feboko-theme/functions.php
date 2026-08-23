<?php
/**
 * FeBoKo Consulting Theme Functions
 *
 * @package FeBoKo
 */

if (!defined('ABSPATH')) {
  exit; // Exit if accessed directly
}

/**
 * Theme Setup
 */
function feboko_setup()
{
  // Add theme support
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('html5', array(
    'search-form',
    'gallery',
    'caption',
  ));
  add_theme_support('custom-logo', array(
    'height' => 65,
    'width' => 161,
    'flex-height' => true,
    'flex-width' => true,
  ));

  // Register navigation menus
  register_nav_menus(array(
    'primary' => __('Primary Menu', 'feboko'),
    'footer-feboko' => __('Footer FeBoKo Menu', 'feboko'),
    'footer-legal' => __('Footer Legal Menu', 'feboko'),
  ));

  // Add support for custom header
  add_theme_support('custom-header', array(
    'default-image' => '',
    'width' => 1920,
    'height' => 825,
    'flex-height' => true,
    'flex-width' => true,
  ));
}
add_action('after_setup_theme', 'feboko_setup');

// Disable block editor for posts
add_filter('use_block_editor_for_post', '__return_false');

// Disable block widgets
add_filter('use_widgets_block_editor', '__return_false');


// Disable comments support for posts and pages
// 1. Disable support for comments and trackbacks in post types
function custom_disable_comments_post_types_support()
{
  $post_types = get_post_types();
  foreach ($post_types as $post_type) {
    if (post_type_supports($post_type, 'comments')) {
      remove_post_type_support($post_type, 'comments');
      remove_post_type_support($post_type, 'trackbacks');
    }
  }
}
add_action('admin_init', 'custom_disable_comments_post_types_support');

// 2. Close comments and pings on the frontend
function custom_disable_comments_status()
{
  return false;
}
add_filter('comments_open', 'custom_disable_comments_status', 20, 2);
add_filter('pings_open', 'custom_disable_comments_status', 20, 2);

// 3. Hide existing comments from frontend
function custom_disable_comments_hide_existing($comments)
{
  return array();
}
add_filter('comments_array', 'custom_disable_comments_hide_existing', 10, 2);

// 4. Remove comments page from admin menu
function custom_disable_comments_admin_menu()
{
  remove_menu_page('edit-comments.php');
}
add_action('admin_menu', 'custom_disable_comments_admin_menu');

// 5. Redirect any user trying to access comments page
function custom_disable_comments_admin_menu_redirect()
{
  global $pagenow;
  if ($pagenow === 'edit-comments.php') {
    wp_redirect(admin_url()); // Redirect to dashboard
    exit;
  }
}
add_action('admin_init', 'custom_disable_comments_admin_menu_redirect');

// 6. Remove comments metabox from dashboard
function custom_disable_comments_dashboard()
{
  remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
}
add_action('wp_dashboard_setup', 'custom_disable_comments_dashboard');

// 7. Remove comments links from admin bar
function custom_disable_comments_admin_bar()
{
  if (is_admin_bar_showing()) {
    remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
  }
}
add_action('admin_bar_menu', 'custom_disable_comments_admin_bar');
/**
 * Enqueue scripts and styles
 */
function feboko_scripts()
{
  $theme_uri = get_template_directory_uri();
  $version   = '1.1.5';

  // Stylesheet partials, loaded in cascade order and in parallel (no @import).
  // Each depends on the previous so the print order is deterministic.
  $partials = array(
    'feboko-variables'  => 'variables-shared.css',
    'feboko-header'     => 'header.css',
    'feboko-mega-menu'  => 'mega-menu.css',
    'feboko-hero'       => 'hero.css',
    'feboko-sections'   => 'sections.css',
    'feboko-components' => 'components.css',
    'feboko-pages'      => 'pages.css',
    'feboko-responsive' => 'responsive.css',
  );

  $deps = array();
  foreach ($partials as $handle => $file) {
    wp_enqueue_style($handle, $theme_uri . '/assets/css/' . $file, $deps, $version);
    $deps = array($handle);
  }

  // Main stylesheet (fonts + base rules) loads last so its rules keep priority.
  wp_enqueue_style('feboko-style', get_stylesheet_uri(), $deps, $version);

  // Contact Form 7 Custom Styling
  wp_enqueue_style('feboko-cf7-custom', $theme_uri . '/assets/css/cf7-custom.css', array(), '1.0.0');

  // Main JavaScript
  wp_enqueue_script('feboko-script', $theme_uri . '/js/main.js', array('jquery'), $version, true);

  // Service Carousel (front page only)
  if (is_front_page()) {
    wp_enqueue_script('feboko-service-carousel', get_template_directory_uri() . '/js/service-carousel.js', array(), '1.0.0', true);
  }

  // Pass translations to JS
  $lang = feboko_lang();
  wp_localize_script('feboko-script', 'febokoI18n', array(
    'showLess'       => ($lang === 'en') ? 'Show Less' : 'Weniger anzeigen',
    'showMore'       => ($lang === 'en') ? 'Show More' : 'Mehr anzeigen',
    'formError'      => ($lang === 'en') ? 'Please fill in all required fields correctly.' : 'Bitte füllen Sie alle erforderlichen Felder korrekt aus.',
  ));
}
add_action('wp_enqueue_scripts', 'feboko_scripts');

/**
 * Enqueue 404 stylesheet only on 404 pages
 */
function feboko_enqueue_404_style()
{
  if (is_404()) {
    wp_enqueue_style('feboko-404', get_template_directory_uri() . '/assets/css/404.css', array('feboko-style'), '1.0.0');
  }
}
add_action('wp_enqueue_scripts', 'feboko_enqueue_404_style');

/**
 * Register widget areas
 */
function feboko_widgets_init()
{
  register_sidebar(array(
    'name' => __('Footer Contact Info', 'feboko'),
    'id' => 'footer-contact',
    'description' => __('Add contact information widgets here.', 'feboko'),
    'before_widget' => '<div class="footer-contact-block">',
    'after_widget' => '</div>',
    'before_title' => '<h4>',
    'after_title' => '</h4>',
  ));
}
add_action('widgets_init', 'feboko_widgets_init');

/**
 * Custom template tags
 */

/**
 * Display navigation menu
 */
function feboko_primary_menu()
{
  wp_nav_menu(array(
    'theme_location' => 'primary',
    'menu_class'     => 'main-navigation',
    'container'      => 'nav',
    'container_class'=> 'nav-container',
    'fallback_cb'    => 'feboko_default_menu',
  ));
}

/**
 * Default menu fallback — used when no WordPress menu is assigned to 'primary'.
 *
 * Renders the same structural HTML that the walker_nav_menu_start_el filter
 * would produce for wp_nav_menu(), so CSS and JS work identically in both cases.
 */
function feboko_default_menu()
{
  $toggle_label = esc_html(feboko_t('Services', 'Services'));
  $toggle_icon  = '<span class="mega-menu-toggle-icon" aria-hidden="true">›</span>';

  $toggle = sprintf(
    '<button class="mega-menu-toggle" aria-expanded="false" aria-controls="mega-menu-panel" aria-label="%s">%s%s</button>',
    esc_attr(feboko_t('Servicebereich öffnen', 'Open services menu')),
    $toggle_label,
    $toggle_icon
  );

  ob_start();
  get_template_part('template-parts/mega-menu-services');
  $panel = ob_get_clean();
  ?>
  <nav class="nav-container">
    <ul class="main-navigation">
      <li class="menu-item">
        <a href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>"><?php echo esc_html(feboko_t('Home', 'Home')); ?></a>
      </li>
      <li class="menu-item menu-item-has-mega-menu">
        <a href="<?php echo esc_url(get_post_type_archive_link('service')); ?>" class="mega-menu-trigger-link" aria-haspopup="true"><?php echo esc_html(feboko_t('Services', 'Services')); ?></a>
        <?php echo $toggle; ?>
        <?php echo $panel; ?>
      </li>
      <li class="menu-item">
        <a href="<?php echo esc_url(get_post_type_archive_link('team')); ?>"><?php echo esc_html(feboko_t('Team', 'Team')); ?></a>
      </li>
      <li class="menu-item">
        <a href="<?php echo esc_url(get_post_type_archive_link('job')); ?>"><?php echo esc_html(feboko_t('Karriere', 'Careers')); ?></a>
      </li>
      <li class="menu-item">
        <a href="<?php echo esc_url(feboko_localize_url(home_url('/blog'))); ?>"><?php echo esc_html(feboko_t('Blog', 'Blog')); ?></a>
      </li>
    </ul>
  </nav>
  <?php
}

/**
 * Detect the Services menu item reliably.
 *
 * Primary: checks menu item type and object (post_type_archive + service).
 * Fallback: compares normalised permalink to the service archive URL.
 *
 * @param WP_Post $item
 * @return bool
 */
function feboko_is_services_menu_item($item)
{
  // Primary check — does not depend on URL at all.
  if (
    isset($item->type, $item->object) &&
    $item->type === 'post_type_archive' &&
    $item->object === 'service'
  ) {
    return true;
  }

  // Fallback — normalised URL match.
  $archive_url = get_post_type_archive_link('service');
  if ($archive_url) {
    return untrailingslashit($item->url) === untrailingslashit($archive_url);
  }

  return false;
}

/**
 * Add CSS class to the Services <li> so CSS can target it.
 */
function feboko_mega_menu_css_class($classes, $item, $args)
{
  if ($args->theme_location === 'primary' && feboko_is_services_menu_item($item)) {
    $classes[] = 'menu-item-has-mega-menu';
  }
  return $classes;
}
add_filter('nav_menu_css_class', 'feboko_mega_menu_css_class', 10, 3);

/**
 * Add aria-haspopup to the Services <a> tag.
 */
function feboko_mega_menu_link_attributes($atts, $item, $args)
{
  if ($args->theme_location === 'primary' && feboko_is_services_menu_item($item)) {
    $atts['aria-haspopup'] = 'true';
    $atts['class'] = isset($atts['class']) ? $atts['class'] . ' mega-menu-trigger-link' : 'mega-menu-trigger-link';
  }
  return $atts;
}
add_filter('nav_menu_link_attributes', 'feboko_mega_menu_link_attributes', 10, 3);

/**
 * Inject the mega menu toggle button and panel inside the Services <li>.
 *
 * Uses walker_nav_menu_start_el to append HTML to the item output,
 * keeping wp_nav_menu() and the default walker untouched.
 */
function feboko_inject_mega_menu($item_output, $item, $depth, $args)
{
  if ($args->theme_location !== 'primary') {
    return $item_output;
  }
  if (!feboko_is_services_menu_item($item)) {
    return $item_output;
  }

  // Toggle button — visible on mobile, accessible on desktop via keyboard.
  $toggle_label = esc_html(feboko_t('Services', 'Services'));
  $toggle_icon  = '<span class="mega-menu-toggle-icon" aria-hidden="true">›</span>';

  $toggle = sprintf(
    '<button class="mega-menu-toggle" aria-expanded="false" aria-controls="mega-menu-panel" aria-label="%s">%s%s</button>',
    esc_attr(feboko_t('Servicebereich öffnen', 'Open services menu')),
    esc_html($toggle_label),
    $toggle_icon
  );

  // Capture the panel template.
  ob_start();
  get_template_part('template-parts/mega-menu-services');
  $panel = ob_get_clean();

  return $item_output . $toggle . $panel;
}
add_filter('walker_nav_menu_start_el', 'feboko_inject_mega_menu', 10, 4);

/**
 * Add anchor ids to H2/H3 headings in service content.
 *
 * The mega menu subservice links point to these anchors (see
 * template-parts/mega-menu-services.php), so clicking a subservice jumps
 * straight to the matching section instead of the top of the page.
 * The slug uses sanitize_title() on the heading text, matching how the
 * mega menu builds its anchor targets.
 */
function feboko_add_service_heading_ids($content)
{
  if (is_admin() || !is_singular('service') || trim($content) === '') {
    return $content;
  }

  libxml_use_internal_errors(true);
  $dom = new DOMDocument('1.0', 'UTF-8');
  $dom->loadHTML('<?xml encoding="utf-8" ?>' . $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
  libxml_clear_errors();

  $used = [];
  foreach (['h2', 'h3'] as $tag) {
    $nodes = $dom->getElementsByTagName($tag);
    foreach ($nodes as $node) {
      if ($node->hasAttribute('id')) {
        $used[] = $node->getAttribute('id');
        continue;
      }
      $text = trim($node->textContent);
      $slug = sanitize_title($text);
      if ($slug === '') {
        continue;
      }
      // Keep the first occurrence on the plain slug so it matches the mega menu.
      $unique = $slug;
      $suffix = 2;
      while (in_array($unique, $used, true)) {
        $unique = $slug . '-' . $suffix;
        $suffix++;
      }
      $used[] = $unique;
      $node->setAttribute('id', $unique);
    }
  }

  $html = '';
  foreach ($dom->childNodes as $node) {
    if ($node->nodeType === XML_PI_NODE) {
      continue;
    }
    $html .= $dom->saveHTML($node);
  }

  return $html;
}
add_filter('the_content', 'feboko_add_service_heading_ids');

/**
 * Language switcher (generates links preserving current URL)
 *
 * German is the default and lives on clean URLs; English is served from the
 * same path with a ?lang=en query parameter, giving each language a distinct,
 * crawlable, cacheable URL.
 */
function feboko_language_switcher()
{
  $current = feboko_lang();

  // Clean URL for DE (default), ?lang=en for EN.
  $de_url = esc_url(remove_query_arg('lang'));
  $en_url = esc_url(add_query_arg('lang', 'en'));
  ?>
  <div class="language-switcher">
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path
        d="M8.5 0.5C4.08 0.5 0.5 4.08 0.5 8.5C0.5 12.92 4.08 16.5 8.5 16.5C12.92 16.5 16.5 12.92 16.5 8.5C16.5 4.08 12.92 0.5 8.5 0.5ZM14.1 5.5H11.9C11.66 4.46 11.3 3.46 10.82 2.54C12.24 3.06 13.42 4.12 14.1 5.5ZM8.5 2.54C9.14 3.52 9.62 4.58 9.9 5.5H7.1C7.38 4.58 7.86 3.52 8.5 2.54ZM2.78 10.5C2.62 9.88 2.5 9.2 2.5 8.5C2.5 7.8 2.62 7.12 2.78 6.5H5.26C5.18 7.16 5.1 7.82 5.1 8.5C5.1 9.18 5.18 9.84 5.26 10.5H2.78ZM2.9 11.5H5.1C5.34 12.54 5.7 13.54 6.18 14.46C4.76 13.94 3.58 12.88 2.9 11.5ZM5.1 5.5H2.9C3.58 4.12 4.76 3.06 6.18 2.54C5.7 3.46 5.34 4.46 5.1 5.5ZM8.5 14.46C7.86 13.48 7.38 12.42 7.1 11.5H9.9C9.62 12.42 9.14 13.48 8.5 14.46ZM10.26 10.5H6.74C6.66 9.84 6.58 9.18 6.58 8.5C6.58 7.82 6.66 7.16 6.74 6.5H10.26C10.34 7.16 10.42 7.82 10.42 8.5C10.42 9.18 10.34 9.84 10.26 10.5ZM10.82 14.46C11.3 13.54 11.66 12.54 11.9 11.5H14.1C13.42 12.88 12.24 13.94 10.82 14.46ZM11.74 10.5C11.82 9.84 11.9 9.18 11.9 8.5C11.9 7.82 11.82 7.16 11.74 6.5H14.22C14.38 7.12 14.5 7.8 14.5 8.5C14.5 9.2 14.38 9.88 14.22 10.5H11.74Z"
        fill="black" />
    </svg>

    <a href="<?php echo $de_url; ?>"
      class="<?php echo ($current === 'de') ? 'lang-active' : ''; ?>"><?php echo esc_html('DE'); ?></a>
    <span class="separator"></span>
    <a href="<?php echo $en_url; ?>"
      class="<?php echo ($current === 'en') ? 'lang-active' : ''; ?>"><?php echo esc_html('EN'); ?></a>
  </div>
  <?php
}

/**
 * Custom excerpt length
 */
function feboko_excerpt_length($length)
{
  return 30;
}
add_filter('excerpt_length', 'feboko_excerpt_length');

/**
 * Custom excerpt more
 */
function feboko_excerpt_more($more)
{
  return '...';
}
add_filter('excerpt_more', 'feboko_excerpt_more');

/**
 * Add custom body classes
 */
function feboko_body_classes($classes)
{
  if (is_front_page()) {
    $classes[] = 'home-page';
  }
  return $classes;
}
add_filter('body_class', 'feboko_body_classes');

/**
 * Register custom post type for Partners
 */
function feboko_register_partners_post_type()
{
  $labels = array(
    'name' => _x('Partners', 'post type general name', 'feboko'),
    'singular_name' => _x('Partner', 'post type singular name', 'feboko'),
    'menu_name' => _x('Partners', 'admin menu', 'feboko'),
    'add_new' => _x('Add New', 'partner', 'feboko'),
    'add_new_item' => __('Add New Partner', 'feboko'),
    'edit_item' => __('Edit Partner', 'feboko'),
    'new_item' => __('New Partner', 'feboko'),
    'view_item' => __('View Partner', 'feboko'),
    'search_items' => __('Search Partners', 'feboko'),
    'not_found' => __('No partners found', 'feboko'),
    'not_found_in_trash' => __('No partners found in Trash', 'feboko'),
  );

  // Partners only hold a logo image for the front-page marquee, so they are
  // kept out of the public site (no thin, indexable single/archive pages)
  // while remaining editable in the admin.
  $args = array(
    'labels' => $labels,
    'public' => false,
    'publicly_queryable' => false,
    'exclude_from_search' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'query_var' => false,
    'rewrite' => false,
    'capability_type' => 'post',
    'has_archive' => false,
    'hierarchical' => false,
    'menu_position' => 5,
    'menu_icon' => 'dashicons-businessman',
    'supports' => array('title'),
  );

  register_post_type('partner', $args);
}
add_action('init', 'feboko_register_partners_post_type');

/**
 * Add custom meta box for partners
 */
function feboko_add_partner_logo_meta_box()
{
  add_meta_box(
    'partner_logo_meta_box',
    __('Partner Logo', 'feboko'),
    'feboko_partner_logo_meta_box_callback',
    'partner',
    'side',
    'default'
  );
}
add_action('add_meta_boxes', 'feboko_add_partner_logo_meta_box');

function feboko_partner_logo_meta_box_callback($post)
{
  wp_nonce_field('feboko_save_partner_logo', 'feboko_partner_logo_nonce');

  $logo_id = get_post_meta($post->ID, '_partner_logo_id', true);
  $logo_url = $logo_id ? wp_get_attachment_image_url($logo_id, 'medium') : '';
  ?>

  <div>
    <img id="partner-logo-preview" src="<?php echo esc_url($logo_url); ?>" style="max-width:100%; margin-bottom:10px;" />

    <input type="hidden" id="partner_logo_id" name="partner_logo_id" value="<?php echo esc_attr($logo_id); ?>" />

    <button type="button" class="button" id="upload_partner_logo_button">
      <?php _e('Select Logo', 'feboko'); ?>
    </button>

    <button type="button" class="button" id="remove_partner_logo_button">
      <?php _e('Remove Logo', 'feboko'); ?>
    </button>
  </div>

  <script>
    jQuery(document).ready(function ($) {
      var mediaUploader;

      $('#upload_partner_logo_button').click(function (e) {
        e.preventDefault();

        if (mediaUploader) {
          mediaUploader.open();
          return;
        }

        mediaUploader = wp.media({
          title: 'Select Partner Logo',
          button: { text: 'Use this logo' },
          multiple: false
        });

        mediaUploader.on('select', function () {
          var attachment = mediaUploader.state().get('selection').first().toJSON();
          $('#partner_logo_id').val(attachment.id);
          $('#partner-logo-preview').attr('src', attachment.url);
        });

        mediaUploader.open();
      });

      $('#remove_partner_logo_button').click(function () {
        $('#partner_logo_id').val('');
        $('#partner-logo-preview').attr('src', '');
      });
    });
  </script>

  <?php
}
/**
 * Save Partner Logo
 */
function feboko_save_partner_logo($post_id)
{
  if (!isset($_POST['feboko_partner_logo_nonce'])) {
    return;
  }

  if (!wp_verify_nonce($_POST['feboko_partner_logo_nonce'], 'feboko_save_partner_logo')) {
    return;
  }

  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }

  if (isset($_POST['partner_logo_id'])) {
    update_post_meta(
      $post_id,
      '_partner_logo_id',
      intval($_POST['partner_logo_id'])
    );
  }
}
add_action('save_post', 'feboko_save_partner_logo');
/**
 * Enqueue Media Uploader for Partner Post Type
 */
function feboko_enqueue_partner_admin_scripts($hook)
{
  global $post;

  // Only load on partner post edit screen
  if (($hook == 'post.php' || $hook == 'post-new.php') && isset($post) && $post->post_type === 'partner') {
    wp_enqueue_media();
  }
}
add_action('admin_enqueue_scripts', 'feboko_enqueue_partner_admin_scripts');


/**
 * Register custom post type for Services
 */
function feboko_register_services_post_type()
{
  $labels = array(
    'name' => _x('Services', 'post type general name', 'feboko'),
    'singular_name' => _x('Service', 'post type singular name', 'feboko'),
    'menu_name' => _x('Services', 'admin menu', 'feboko'),
    'add_new' => _x('Add New', 'service', 'feboko'),
    'add_new_item' => __('Add New Service', 'feboko'),
    'edit_item' => __('Edit Service', 'feboko'),
    'new_item' => __('New Service', 'feboko'),
    'view_item' => __('View Service', 'feboko'),
    'search_items' => __('Search Services', 'feboko'),
    'not_found' => __('No services found', 'feboko'),
    'not_found_in_trash' => __('No services found in Trash', 'feboko'),
  );

  $args = array(
    'labels' => $labels,
    'public' => true,
    'publicly_queryable' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'query_var' => true,
    'rewrite' => array('slug' => 'services'),
    'capability_type' => 'post',
    'has_archive' => true,
    'hierarchical' => false,
    'menu_position' => 5,
    'menu_icon' => 'dashicons-portfolio',
    'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'page-attributes'), // ← ADD 'page-attributes'
  );

  register_post_type('service', $args);
}
add_action('init', 'feboko_register_services_post_type');
/**
 * Add Second Heading Meta Box
 */
function feboko_add_second_heading_metabox()
{
  add_meta_box(
    'feboko_second_heading',            // ID
    'Second Heading',                   // Title
    'feboko_second_heading_callback',   // Callback
    'service',                          // Post type
    'normal',                           // Context
    'default'                           // Priority
  );
}
add_action('add_meta_boxes', 'feboko_add_second_heading_metabox');

/**
 * Add Mega Menu Items Meta Box
 *
 * On each service post, editors can enter sub-service labels (one per line).
 * These appear in the navigation mega menu under this service category.
 */
function feboko_add_mega_menu_items_metabox()
{
  add_meta_box(
    'feboko_mega_menu_items',
    'Mega Menu Items',
    'feboko_mega_menu_items_callback',
    'service',
    'normal',
    'default'
  );
}
add_action('add_meta_boxes', 'feboko_add_mega_menu_items_metabox');

function feboko_mega_menu_items_callback($post)
{
  wp_nonce_field('feboko_save_mega_menu_items', 'feboko_mega_menu_items_nonce');
  $value = get_post_meta($post->ID, '_feboko_mega_menu_items', true);
  ?>
  <p style="margin-bottom:8px;color:#555;font-size:13px;">
    Enter one sub-service label per line. These appear in the navigation mega menu under this service category.
  </p>
  <textarea
    name="feboko_mega_menu_items"
    id="feboko_mega_menu_items"
    rows="8"
    style="width:100%;font-family:monospace;font-size:13px;"
    placeholder="Sub-service label one
Sub-service label two
Sub-service label three"
  ><?php echo esc_textarea($value); ?></textarea>
  <?php
}

function feboko_save_mega_menu_items($post_id)
{
  if (!isset($_POST['feboko_mega_menu_items_nonce'])) {
    return;
  }
  if (!wp_verify_nonce($_POST['feboko_mega_menu_items_nonce'], 'feboko_save_mega_menu_items')) {
    return;
  }
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }
  if (isset($_POST['feboko_mega_menu_items'])) {
    // Sanitize: strip HTML tags, keep newlines, trim lines.
    $raw   = wp_unslash($_POST['feboko_mega_menu_items']);
    $lines = explode("\n", $raw);
    $clean = array_map('sanitize_text_field', $lines);
    update_post_meta($post_id, '_feboko_mega_menu_items', implode("\n", $clean));
  }
}
add_action('save_post', 'feboko_save_mega_menu_items');


/**
 * Add Language Dropdown Meta Box
 */
function feboko_add_language_metabox()
{
  $post_types = ['service', 'post']; // add blog posts here

  foreach ($post_types as $post_type) {
    add_meta_box(
      'feboko_service_language',          // ID
      'Service Language',                 // Title
      'feboko_language_metabox_callback', // Callback
      $post_type,                         // Post type
      'side',                             // Context
      'default'
    );
  }
}
add_action('add_meta_boxes', 'feboko_add_language_metabox');
function feboko_language_metabox_callback($post)
{
  // Add nonce for security
  wp_nonce_field('feboko_save_language', 'feboko_language_nonce');

  // Get saved value
  $value = get_post_meta($post->ID, '_feboko_service_language', true);

  ?>
  <label for="feboko_service_language">Select Language:</label>
  <select name="feboko_service_language" id="feboko_service_language" style="width:100%;">
    <option value="en" <?php selected($value, 'en'); ?>>English</option>
    <option value="de" <?php selected($value, 'de'); ?>>German</option>
  </select>
  <?php
}
/**
 * Save Language Meta Box
 */
function feboko_save_language_metabox($post_id)
{
  // Check nonce
  if (
    !isset($_POST['feboko_language_nonce']) ||
    !wp_verify_nonce($_POST['feboko_language_nonce'], 'feboko_save_language')
  ) {
    return;
  }

  // Prevent autosave
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }

  // Check permission for both posts and services
  if (!current_user_can('edit_post', $post_id)) {
    return;
  }

  // Save value
  if (isset($_POST['feboko_service_language'])) {
    update_post_meta(
      $post_id,
      '_feboko_service_language',
      sanitize_text_field($_POST['feboko_service_language'])
    );
  }
}
add_action('save_post', 'feboko_save_language_metabox');

/**
 * Add language column to admin dashboard for Services and Posts
 */
function feboko_add_language_column($columns) {
  $columns['feboko_language'] = __('Language', 'feboko');
  return $columns;
}
add_filter('manage_service_posts_columns', 'feboko_add_language_column');
add_filter('manage_post_posts_columns', 'feboko_add_language_column');

/**
 * Populate language column in admin dashboard for Services and Posts
 */
function feboko_populate_language_column($column, $post_id) {
  if ($column === 'feboko_language') {
    $lang = get_post_meta($post_id, '_feboko_service_language', true);
    if ($lang === 'en') {
      echo 'English';
    } elseif ($lang === 'de') {
      echo 'German';
    } else {
      echo '—';
    }
  }
}
add_action('manage_service_posts_custom_column', 'feboko_populate_language_column', 10, 2);
add_action('manage_post_posts_custom_column', 'feboko_populate_language_column', 10, 2);

/**
 * Add Order column to admin dashboard for Services
 */
function feboko_add_service_order_column($columns) {
  $columns['menu_order'] = __('Order', 'feboko');
  return $columns;
}
add_filter('manage_service_posts_columns', 'feboko_add_service_order_column');

function feboko_populate_service_order_column($column, $post_id) {
  if ($column === 'menu_order') {
    $post = get_post($post_id);
    echo esc_html($post->menu_order);
  }
}
add_action('manage_service_posts_custom_column', 'feboko_populate_service_order_column', 10, 2);

function feboko_sortable_service_order_column($columns) {
  $columns['menu_order'] = 'menu_order';
  return $columns;
}
add_filter('manage_edit-service_sortable_columns', 'feboko_sortable_service_order_column');

/**
 * Filter main blog query by current language
 */
function feboko_filter_posts_by_language($query)
{
  if (is_admin() || !$query->is_main_query()) {
    return;
  }

  // Blog archive (index.php) and service archive
  if ($query->is_home() || $query->is_post_type_archive('service')) {
    $query->set('meta_query', [
      [
        'key'   => '_feboko_service_language',
        'value' => feboko_lang(),
      ],
    ]);
  }
}
add_action('pre_get_posts', 'feboko_filter_posts_by_language');


/**
 * Meta Box HTML
 */
function feboko_second_heading_callback($post)
{
  wp_nonce_field('feboko_save_second_heading', 'feboko_second_heading_nonce');

  $value = get_post_meta($post->ID, '_feboko_second_heading', true);

  echo '<input type="text" style="width:100%;" 
          name="feboko_second_heading" 
          value="' . esc_attr($value) . '" 
          placeholder="Enter second heading here">';
}

/**
 * Save Meta Box Data
 */
function feboko_save_second_heading($post_id)
{

  if (!isset($_POST['feboko_second_heading_nonce'])) {
    return;
  }

  if (!wp_verify_nonce($_POST['feboko_second_heading_nonce'], 'feboko_save_second_heading')) {
    return;
  }

  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }

  if (isset($_POST['feboko_second_heading'])) {
    update_post_meta(
      $post_id,
      '_feboko_second_heading',
      sanitize_text_field($_POST['feboko_second_heading'])
    );
  }
}
add_action('save_post', 'feboko_save_second_heading');

/**
 * Register custom post type for Team Members
 */
require get_template_directory() . '/inc/team-post-type.php';

/**
 * Register custom post type for Job Listings (Karriere)
 */
require get_template_directory() . '/inc/career-post-type.php';


/**
 * Add Theme Options Pages
 */
require_once get_template_directory() . '/inc/frontpage-options.php';
new FeBoKo_Frontpage_Options();
require_once get_template_directory() . '/inc/aboutpage-options.php';
new FeBoKo_Aboutpage_Options();
require_once get_template_directory() . '/inc/careerpage-options.php';
new FeBoKo_Careerpage_Options();

/**
 * Language detection (fallback to DE)
 *
 * Language is derived solely from the ?lang= query parameter so that each
 * language is a distinct, indexable, cacheable URL. No sessions or cookies
 * are used. German is the default and lives on clean URLs.
 */
function feboko_lang()
{
  $lang = isset($_GET['lang']) ? sanitize_text_field(wp_unslash($_GET['lang'])) : '';
  return in_array($lang, array('de', 'en'), true) ? $lang : 'de';
}

/**
 * Append the current language parameter to an internal URL.
 *
 * German (default) keeps clean URLs; English URLs carry ?lang=en so the
 * chosen language persists as visitors navigate the site.
 *
 * @param string $url An internal URL.
 * @return string
 */
function feboko_localize_url($url)
{
  if (!is_string($url) || $url === '' || feboko_lang() !== 'en') {
    return $url;
  }

  // Only localize internal URLs (absolute same-host or root-relative).
  $home = home_url();
  if (strpos($url, $home) !== 0 && strpos($url, '/') !== 0) {
    return $url;
  }

  return add_query_arg('lang', 'en', $url);
}

/**
 * Localize permalinks/archive links generated by core so template links
 * (the_permalink(), get_permalink(), get_post_type_archive_link(), etc.)
 * automatically preserve the active language. Skipped in admin so editor
 * links stay clean.
 */
function feboko_localize_permalink($url)
{
  if (is_admin()) {
    return $url;
  }
  return feboko_localize_url($url);
}
add_filter('post_link', 'feboko_localize_permalink');
add_filter('page_link', 'feboko_localize_permalink');
add_filter('post_type_link', 'feboko_localize_permalink');
add_filter('post_type_archive_link', 'feboko_localize_permalink');

/**
 * Localize nav menu links (primary + footer menus) so the language persists
 * when navigating via wp_nav_menu().
 */
function feboko_localize_nav_links($atts, $item, $args)
{
  if (!empty($atts['href'])) {
    $atts['href'] = feboko_localize_url($atts['href']);
  }
  return $atts;
}
add_filter('nav_menu_link_attributes', 'feboko_localize_nav_links', 20, 3);

/**
 * Simple translation helper – returns DE or EN string based on current language.
 */
function feboko_t($de, $en)
{
  return (feboko_lang() === 'en') ? $en : $de;
}

/**
 * Get option value safely
 */
function feboko_option($options, $section, $field)
{
  if ($field == "image") {
    return $options[$section][$field];
  }

  $lang = feboko_lang();

  if (!empty($options[$section][$field][$lang])) {
    return $options[$section][$field][$lang];
  }

  // fallback to DE if EN empty
  return $options[$section][$field]['de'] ?? '';
}
function frontpage_option($section, $field)
{
  $options = get_option('feboko_frontpage_options');

  return feboko_option($options, $section, $field);
}
function aboutpage_option($section, $field)
{
  $options = get_option('feboko_aboutpage_options');

  return feboko_option($options, $section, $field);
}
function careerpage_option($section, $field)
{
  $options = get_option('feboko_careerpage_options');

  return feboko_option($options, $section, $field);
}
function mytheme_enqueue_admin_styles()
{
  // Get the theme directory URI
  $theme_url = get_template_directory_uri();

  // Enqueue admin.css for admin pages only
  wp_enqueue_style(
    'feboko-theme-admin-css',                  // Handle
    $theme_url . '/assets/css/admin.css', // File path
    array(),                              // Dependencies
    '1.0.0'                               // Version
  );
}
add_action('admin_enqueue_scripts', 'mytheme_enqueue_admin_styles');

/**
 * SEO Features
 */
require_once get_template_directory() . '/inc/seo.php';