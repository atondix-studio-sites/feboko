<?php
/**
 * Team Custom Post Type
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Register Team Post Type
 */
function feboko_register_team_post_type()
{

  $labels = array(
    'name' => _x('Team Members', 'post type general name', 'feboko'),
    'singular_name' => _x('Team Member', 'post type singular name', 'feboko'),
    'menu_name' => _x('Team', 'admin menu', 'feboko'),
    'add_new' => _x('Add New', 'team member', 'feboko'),
    'add_new_item' => __('Add New Team Member', 'feboko'),
    'edit_item' => __('Edit Team Member', 'feboko'),
    'new_item' => __('New Team Member', 'feboko'),
    'view_item' => __('View Team Member', 'feboko'),
    'search_items' => __('Search Team Members', 'feboko'),
    'not_found' => __('No team members found', 'feboko'),
    'not_found_in_trash' => __('No team members found in Trash', 'feboko'),
  );

  $args = array(
    'labels' => $labels,
    'public' => true,
    'publicly_queryable' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'query_var' => true,
    'rewrite' => array('slug' => 'team'),
    'capability_type' => 'post',
    'has_archive' => true,
    'hierarchical' => false,
    'menu_position' => 6,
    'menu_icon' => 'dashicons-groups',
    'supports' => array(
      'title',
      'thumbnail', // Profile picture
      'page-attributes',
    ),
  );

  register_post_type('team', $args);
}
add_action('init', 'feboko_register_team_post_type');


/**
 * Add Meta Boxes
 */
function feboko_add_team_meta_boxes()
{

  add_meta_box(
    'feboko_team_details',
    __('Team Member Details', 'feboko'),
    'feboko_team_meta_box_callback',
    'team',
    'normal',
    'default'
  );
}
add_action('add_meta_boxes', 'feboko_add_team_meta_boxes');


/**
 * Meta Box Output
 */
function feboko_team_meta_box_callback($post)
{

  wp_nonce_field('feboko_save_team_meta', 'feboko_team_meta_nonce');

  $position = get_post_meta($post->ID, '_team_position', true);
  $email = get_post_meta($post->ID, '_team_email', true);
  $phone = get_post_meta($post->ID, '_team_phone', true);
  $about = get_post_meta($post->ID, '_team_about', true);
  $abouten = get_post_meta($post->ID, '_team_about_en', true);
  ?>

  <p>
    <label for="team_position"><strong><?php _e('Position', 'feboko'); ?></strong></label><br>
    <input type="text" id="team_position" name="team_position" value="<?php echo esc_attr($position); ?>"
      style="width:100%;" />
  </p>

  <p>
    <label for="team_email"><strong><?php _e('Email', 'feboko'); ?></strong></label><br>
    <input type="email" id="team_email" name="team_email" value="<?php echo esc_attr($email); ?>" style="width:100%;" />
  </p>

  <p>
    <label for="team_phone"><strong><?php _e('Telephone Number', 'feboko'); ?></strong></label><br>
    <input type="text" id="team_phone" name="team_phone" value="<?php echo esc_attr($phone); ?>" style="width:100%;" />
  </p>

  <p>
    <label for="team_about"><strong><?php _e('About German', 'feboko'); ?></strong></label><br>
    <textarea id="team_about" name="team_about" rows="5"
      style="width:100%;"><?php echo esc_textarea($about); ?></textarea>
  </p>

  <p>
    <label for="team_about_en"><strong><?php _e('About English', 'feboko'); ?></strong></label><br>
    <textarea id="team_about_en" name="team_about_en" rows="5"
      style="width:100%;"><?php echo esc_textarea($abouten); ?></textarea>
  </p>

  <p>
    <em><?php _e('Profile picture can be set using the Featured Image panel.', 'feboko'); ?></em>
  </p>

  <?php
}


/**
 * Save Meta Data
 */
function feboko_save_team_meta($post_id)
{

  if (!isset($_POST['feboko_team_meta_nonce'])) {
    return;
  }

  if (!wp_verify_nonce($_POST['feboko_team_meta_nonce'], 'feboko_save_team_meta')) {
    return;
  }

  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }

  if (!current_user_can('edit_post', $post_id)) {
    return;
  }

  if (isset($_POST['team_position'])) {
    update_post_meta($post_id, '_team_position', sanitize_text_field($_POST['team_position']));
  }

  if (isset($_POST['team_email'])) {
    update_post_meta($post_id, '_team_email', sanitize_email($_POST['team_email']));
  }

  if (isset($_POST['team_phone'])) {
    update_post_meta($post_id, '_team_phone', sanitize_text_field($_POST['team_phone']));
  }

  if (isset($_POST['team_about'])) {
    update_post_meta($post_id, '_team_about', sanitize_textarea_field($_POST['team_about']));
  }

  if (isset($_POST['team_about_en'])) {
    update_post_meta($post_id, '_team_about_en', sanitize_textarea_field($_POST['team_about_en']));
  }
}
add_action('save_post_team', 'feboko_save_team_meta');
