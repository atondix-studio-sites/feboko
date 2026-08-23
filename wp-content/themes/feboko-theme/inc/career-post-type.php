<?php
/**
 * Career / Job Listing Custom Post Type
 *
 * @package FeBoKo
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Register Job Post Type
 */
function feboko_register_job_post_type()
{
  $labels = array(
    'name'               => _x('Jobs', 'post type general name', 'feboko'),
    'singular_name'      => _x('Job', 'post type singular name', 'feboko'),
    'menu_name'          => _x('Karriere', 'admin menu', 'feboko'),
    'add_new'            => _x('Add New', 'job', 'feboko'),
    'add_new_item'       => __('Add New Job', 'feboko'),
    'edit_item'          => __('Edit Job', 'feboko'),
    'new_item'           => __('New Job', 'feboko'),
    'view_item'          => __('View Job', 'feboko'),
    'search_items'       => __('Search Jobs', 'feboko'),
    'not_found'          => __('No jobs found', 'feboko'),
    'not_found_in_trash' => __('No jobs found in Trash', 'feboko'),
  );

  $args = array(
    'labels'           => $labels,
    'public'           => true,
    'publicly_queryable' => true,
    'show_ui'          => true,
    'show_in_menu'     => true,
    'query_var'        => true,
    'rewrite'          => array('slug' => 'karriere'),
    'capability_type'  => 'post',
    'has_archive'      => true,
    'hierarchical'     => false,
    'menu_position'    => 7,
    'menu_icon'        => 'dashicons-id-alt',
    'supports'         => array('title', 'page-attributes'),
  );

  register_post_type('job', $args);
}
add_action('init', 'feboko_register_job_post_type');


/**
 * Add Meta Boxes for Job
 */
function feboko_add_job_meta_boxes()
{
  add_meta_box(
    'feboko_job_details',
    __('Job Details', 'feboko'),
    'feboko_job_meta_box_callback',
    'job',
    'normal',
    'high'
  );
}
add_action('add_meta_boxes', 'feboko_add_job_meta_boxes');


/**
 * Meta Box Output
 */
function feboko_job_meta_box_callback($post)
{
  wp_nonce_field('feboko_save_job_meta', 'feboko_job_meta_nonce');

  $location       = get_post_meta($post->ID, '_job_location', true);
  $type           = get_post_meta($post->ID, '_job_type', true);
  $department_de  = get_post_meta($post->ID, '_job_department_de', true);
  $department_en  = get_post_meta($post->ID, '_job_department_en', true);
  $deadline       = get_post_meta($post->ID, '_job_deadline', true);
  $summary_de     = get_post_meta($post->ID, '_job_summary_de', true);
  $summary_en     = get_post_meta($post->ID, '_job_summary_en', true);
  $description_de = get_post_meta($post->ID, '_job_description_de', true);
  $description_en = get_post_meta($post->ID, '_job_description_en', true);
  $requirements_de = get_post_meta($post->ID, '_job_requirements_de', true);
  $requirements_en = get_post_meta($post->ID, '_job_requirements_en', true);
  $contact_email  = get_post_meta($post->ID, '_job_contact_email', true);
  ?>

  <table class="form-table" style="width:100%;">
    <tr>
      <th><label for="job_location"><strong><?php _e('Location / Ort', 'feboko'); ?></strong></label></th>
      <td><input type="text" id="job_location" name="job_location" value="<?php echo esc_attr($location); ?>" style="width:100%;" placeholder="z.B. München, Remote, Hybrid" /></td>
    </tr>
    <tr>
      <th><label for="job_type"><strong><?php _e('Employment Type / Anstellungsart', 'feboko'); ?></strong></label></th>
      <td>
        <select name="job_type" id="job_type" style="width:100%;">
          <option value=""><?php _e('— Select —', 'feboko'); ?></option>
          <option value="fulltime" <?php selected($type, 'fulltime'); ?>><?php _e('Full-Time / Vollzeit', 'feboko'); ?></option>
          <option value="parttime" <?php selected($type, 'parttime'); ?>><?php _e('Part-Time / Teilzeit', 'feboko'); ?></option>
          <option value="freelance" <?php selected($type, 'freelance'); ?>><?php _e('Freelance', 'feboko'); ?></option>
          <option value="internship" <?php selected($type, 'internship'); ?>><?php _e('Internship / Praktikum', 'feboko'); ?></option>
        </select>
      </td>
    </tr>
    <tr>
      <th><label for="job_department_de"><strong><?php _e('Department DE', 'feboko'); ?></strong></label></th>
      <td><input type="text" id="job_department_de" name="job_department_de" value="<?php echo esc_attr($department_de); ?>" style="width:100%;" placeholder="z.B. Beratung, Marketing" /></td>
    </tr>
    <tr>
      <th><label for="job_department_en"><strong><?php _e('Department EN', 'feboko'); ?></strong></label></th>
      <td><input type="text" id="job_department_en" name="job_department_en" value="<?php echo esc_attr($department_en); ?>" style="width:100%;" placeholder="e.g. Consulting, Marketing" /></td>
    </tr>
    <tr>
      <th><label for="job_deadline"><strong><?php _e('Application Deadline / Bewerbungsfrist', 'feboko'); ?></strong></label></th>
      <td><input type="date" id="job_deadline" name="job_deadline" value="<?php echo esc_attr($deadline); ?>" style="width:250px;" /></td>
    </tr>
    <tr>
      <th><label for="job_contact_email"><strong><?php _e('Contact Email', 'feboko'); ?></strong></label></th>
      <td><input type="email" id="job_contact_email" name="job_contact_email" value="<?php echo esc_attr($contact_email); ?>" style="width:100%;" placeholder="careers@feboko.com" /></td>
    </tr>
  </table>

  <hr style="margin: 20px 0;">

  <h3 style="margin-bottom:10px;"><?php _e('Short Summary / Kurzbeschreibung', 'feboko'); ?></h3>
  <table class="form-table" style="width:100%;">
    <tr>
      <th style="width:120px;"><label for="job_summary_de"><strong>DE</strong></label></th>
      <td><textarea id="job_summary_de" name="job_summary_de" rows="3" style="width:100%;"><?php echo esc_textarea($summary_de); ?></textarea></td>
    </tr>
    <tr>
      <th><label for="job_summary_en"><strong>EN</strong></label></th>
      <td><textarea id="job_summary_en" name="job_summary_en" rows="3" style="width:100%;"><?php echo esc_textarea($summary_en); ?></textarea></td>
    </tr>
  </table>

  <hr style="margin: 20px 0;">

  <h3 style="margin-bottom:10px;"><?php _e('Full Job Description / Stellenbeschreibung', 'feboko'); ?></h3>
  <p style="color:#666; font-size:13px; margin-bottom:10px;"><?php _e('HTML is supported. Use &lt;ul&gt;&lt;li&gt; for bullet lists.', 'feboko'); ?></p>
  <table class="form-table" style="width:100%;">
    <tr>
      <th style="width:120px;"><label for="job_description_de"><strong>DE</strong></label></th>
      <td><textarea id="job_description_de" name="job_description_de" rows="8" style="width:100%;"><?php echo esc_textarea($description_de); ?></textarea></td>
    </tr>
    <tr>
      <th><label for="job_description_en"><strong>EN</strong></label></th>
      <td><textarea id="job_description_en" name="job_description_en" rows="8" style="width:100%;"><?php echo esc_textarea($description_en); ?></textarea></td>
    </tr>
  </table>

  <hr style="margin: 20px 0;">

  <h3 style="margin-bottom:10px;"><?php _e('Requirements / Anforderungen', 'feboko'); ?></h3>
  <p style="color:#666; font-size:13px; margin-bottom:10px;"><?php _e('HTML is supported. Use &lt;ul&gt;&lt;li&gt; for bullet lists.', 'feboko'); ?></p>
  <table class="form-table" style="width:100%;">
    <tr>
      <th style="width:120px;"><label for="job_requirements_de"><strong>DE</strong></label></th>
      <td><textarea id="job_requirements_de" name="job_requirements_de" rows="6" style="width:100%;"><?php echo esc_textarea($requirements_de); ?></textarea></td>
    </tr>
    <tr>
      <th><label for="job_requirements_en"><strong>EN</strong></label></th>
      <td><textarea id="job_requirements_en" name="job_requirements_en" rows="6" style="width:100%;"><?php echo esc_textarea($requirements_en); ?></textarea></td>
    </tr>
  </table>

  <?php
}


/**
 * Save Job Meta Data
 */
function feboko_save_job_meta($post_id)
{
  if (!isset($_POST['feboko_job_meta_nonce'])) {
    return;
  }

  if (!wp_verify_nonce($_POST['feboko_job_meta_nonce'], 'feboko_save_job_meta')) {
    return;
  }

  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }

  if (!current_user_can('edit_post', $post_id)) {
    return;
  }

  $fields = array(
    'job_location'        => '_job_location',
    'job_type'            => '_job_type',
    'job_department_de'   => '_job_department_de',
    'job_department_en'   => '_job_department_en',
    'job_deadline'        => '_job_deadline',
    'job_contact_email'   => '_job_contact_email',
    'job_summary_de'      => '_job_summary_de',
    'job_summary_en'      => '_job_summary_en',
  );

  foreach ($fields as $post_key => $meta_key) {
    if (isset($_POST[$post_key])) {
      if ($post_key === 'job_contact_email') {
        update_post_meta($post_id, $meta_key, sanitize_email($_POST[$post_key]));
      } else {
        update_post_meta($post_id, $meta_key, sanitize_text_field($_POST[$post_key]));
      }
    }
  }

  // Allow basic HTML in description and requirements fields
  $html_fields = array(
    'job_description_de'  => '_job_description_de',
    'job_description_en'  => '_job_description_en',
    'job_requirements_de' => '_job_requirements_de',
    'job_requirements_en' => '_job_requirements_en',
  );

  $allowed_html = array(
    'p'      => array(),
    'strong' => array(),
    'em'     => array(),
    'ul'     => array(),
    'ol'     => array(),
    'li'     => array(),
    'br'     => array(),
    'a'      => array('href' => array(), 'target' => array()),
    'h3'     => array(),
    'h4'     => array(),
  );

  foreach ($html_fields as $post_key => $meta_key) {
    if (isset($_POST[$post_key])) {
      update_post_meta($post_id, $meta_key, wp_kses($_POST[$post_key], $allowed_html));
    }
  }
}
add_action('save_post_job', 'feboko_save_job_meta');


/**
 * Add columns to the admin job list
 */
function feboko_job_admin_columns($columns)
{
  $new = array();
  foreach ($columns as $key => $value) {
    $new[$key] = $value;
    if ($key === 'title') {
      $new['job_type']     = __('Type', 'feboko');
      $new['job_location'] = __('Location', 'feboko');
      $new['job_deadline'] = __('Deadline', 'feboko');
    }
  }
  return $new;
}
add_filter('manage_job_posts_columns', 'feboko_job_admin_columns');

function feboko_job_admin_columns_content($column, $post_id)
{
  $type_labels = array(
    'fulltime'   => 'Vollzeit',
    'parttime'   => 'Teilzeit',
    'freelance'  => 'Freelance',
    'internship' => 'Praktikum',
  );

  switch ($column) {
    case 'job_type':
      $type = get_post_meta($post_id, '_job_type', true);
      echo esc_html($type_labels[$type] ?? '—');
      break;
    case 'job_location':
      echo esc_html(get_post_meta($post_id, '_job_location', true) ?: '—');
      break;
    case 'job_deadline':
      $deadline = get_post_meta($post_id, '_job_deadline', true);
      echo $deadline ? esc_html(date_i18n('d.m.Y', strtotime($deadline))) : '—';
      break;
  }
}
add_action('manage_job_posts_custom_column', 'feboko_job_admin_columns_content', 10, 2);
