<?php
if (!defined('ABSPATH'))
  exit;

class FeBoKo_Aboutpage_Options
{

  private $option_name = 'feboko_aboutpage_options';

  public function __construct()
  {
    add_action('admin_menu', [$this, 'add_menu']);
    add_action('admin_init', [$this, 'register_settings']);
    add_action('admin_enqueue_scripts', [$this, 'enqueue_media']);

    add_filter('option_page_capability_feboko_aboutpage_group', function () {
      return 'edit_pages';
    });
  }

  public function add_menu()
  {
    add_menu_page(
      'About Page',
      'About Page',
      'edit_pages',
      'feboko-aboutpage-settings',
      [$this, 'render_page'],
      'dashicons-edit',
      20
    );
  }

  public function register_settings()
  {
    register_setting(
      'feboko_aboutpage_group',
      $this->option_name,
      [$this, 'sanitize']
    );
  }
  public function enqueue_media($hook)
  {
    if ($hook !== 'toplevel_page_feboko-aboutpage-settings') {
      return;
    }

    // Load WP media library
    wp_enqueue_media();

    // Add inline JS properly
    add_action('admin_footer', function () {
      ?>
            <script>
              jQuery(document).ready(function ($) {

                $('.feboko-upload-button').on('click', function (e) {
                  e.preventDefault();

                  const button = $(this);
                  const container = button.closest('div');
                  const imageField = container.find('.feboko-image-id');
                  const preview = container.find('.feboko-image-preview');

                  // Create a new media frame for this button
                  const mediaFrame = wp.media({
                    title: 'Select or Upload Image',
                    button: { text: 'Use this image' },
                    multiple: false
                  });

                  mediaFrame.on('select', function () {
                    const attachment = mediaFrame.state().get('selection').first().toJSON();
                    imageField.val(attachment.id);
                    preview.attr('src', attachment.url).show();
                  });

                  mediaFrame.open();
                });

                $('.feboko-remove-button').on('click', function () {
                  const container = $(this).closest('div');
                  container.find('.feboko-image-id').val('');
                  container.find('.feboko-image-preview').hide();
                });

              });
            </script>
            <?php
    });
  }



  public function sanitize($input)
  {
    if (!is_array($input))
      return [];

    foreach ($input as $section_key => &$section) {

      // Image field
      if (isset($section['image'])) {
        $section['image'] = absint($section['image']);
      }

      // Text fields
      if (is_array($section)) {
        foreach ($section as $field_key => &$field) {
          if ($field_key === 'image')
            continue;

          if (is_array($field)) {
            foreach ($field as &$lang_value) {
              $lang_value = wp_kses_post($lang_value);
            }
          }
        }
      }
    }

    return $input;
  }


  public function render_page()
  {

    $options = get_option($this->option_name);
    ?>

        <div class="wrap">
          <h1>Frontpage Settings</h1>

          <form method="post" action="options.php">
            <?php settings_fields('feboko_aboutpage_group'); ?>

            <h2>Introduction Section</h2>
            <?php $this->field($options, 'intro', 'title', 'Introduction Title'); ?>
            <?php $this->field($options, 'intro', 'text', 'Introduction Text', textarea: true); ?>
            <?php $this->image_field($options, 'intro', 'Introduction Image'); ?>

            <hr>

            <h2>Our Mission Section</h2>
            <?php $this->field($options, 'mission', 'title', 'Mission Title'); ?>
            <?php $this->field($options, 'mission', 'text', 'Mission Text', true); ?>
            <?php $this->field($options, 'mission', 'cta', 'Mission Button'); ?>
            <?php $this->image_field($options, 'mission', 'Mission Image'); ?>

            <hr>

            <h2>Our Vision Section</h2>
            <?php $this->field($options, 'vision', 'title', 'Vision Title'); ?>
            <?php $this->field($options, 'vision', 'text', 'Vision Text', true); ?>
            <?php $this->image_field($options, 'vision', 'Vision Image'); ?>


            <hr>

            <?php submit_button(); ?>
          </form>
        </div>

        <?php
  }

  private function field($options, $section, $field, $label, $textarea = false)
  {

    $de = $options[$section][$field]['de'] ?? '';
    $en = $options[$section][$field]['en'] ?? '';

    ?>
        <div class="admin-form-flex">
          <h4>
            <?php echo esc_html($label); ?>
          </h4>
          <div class="admin-form-flex">
            <div class="column1">
              <h5>Deutsch</h5>
              <div>
                <?php if ($textarea): ?>
                    <textarea name="<?php echo $this->option_name; ?>[<?php echo $section; ?>][<?php echo $field; ?>][de]" rows="4"
                      class="large-text"><?php echo esc_textarea($de); ?></textarea>
                <?php else: ?>
                    <input type="text" name="<?php echo $this->option_name; ?>[<?php echo $section; ?>][<?php echo $field; ?>][de]"
                      value="<?php echo esc_attr($de); ?>" class="regular-text">
                <?php endif; ?>
              </div>
            </div>
            <div class="column2">
              <h5>English</h5>
              <div>
                <?php if ($textarea): ?>
                    <textarea name="<?php echo $this->option_name; ?>[<?php echo $section; ?>][<?php echo $field; ?>][en]" rows="4"
                      class="large-text"><?php echo esc_textarea($en); ?></textarea>
                <?php else: ?>
                    <input type="text" name="<?php echo $this->option_name; ?>[<?php echo $section; ?>][<?php echo $field; ?>][en]"
                      value="<?php echo esc_attr($en); ?>" class="regular-text">
                <?php endif; ?>
              </div>
            </div>
          </div>
        </div>
        <?php
  }

  private function image_field($options, $section, $label)
  {
    $image_id = $options[$section]['image'] ?? '';
    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'medium') : '';
    ?>

        <div class="admin-form-flex">
          <h4><?php echo esc_html($label); ?></h4>

          <div>
            <img class="feboko-image-preview" src="<?php echo esc_url($image_url); ?>"
              style="max-width:200px; display:<?php echo $image_url ? 'block' : 'none'; ?>; margin-bottom:10px;">

            <input type="hidden" class="feboko-image-id"
              name="<?php echo $this->option_name; ?>[<?php echo $section; ?>][image]"
              value="<?php echo esc_attr($image_id); ?>">

            <button type="button" class="button feboko-upload-button">
              Upload Image
            </button>

            <button type="button" class="button feboko-remove-button">
              Remove
            </button>
          </div>
        </div>

        <?php
  }
}
