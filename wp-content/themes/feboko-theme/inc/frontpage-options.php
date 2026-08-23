<?php
if (!defined('ABSPATH'))
  exit;

class FeBoKo_Frontpage_Options
{

  private $option_name = 'feboko_frontpage_options';

  public function __construct()
  {
    add_action('admin_menu', [$this, 'add_menu']);
    add_action('admin_init', [$this, 'register_settings']);
    add_action('admin_enqueue_scripts', [$this, 'enqueue_media']);

    add_filter('option_page_capability_feboko_frontpage_group', function () {
      return 'edit_pages';
    });
  }

  public function add_menu()
  {
    add_menu_page(
      'Frontpage',
      'Frontpage',
      'edit_pages',
      'feboko-frontpage-settings',
      [$this, 'render_page'],
      'dashicons-edit',
      20
    );
  }

  public function register_settings()
  {
    register_setting(
      'feboko_frontpage_group',
      $this->option_name,
      [$this, 'sanitize']
    );
  }
  public function enqueue_media($hook)
  {
    if ($hook !== 'toplevel_page_feboko-frontpage-settings') {
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
            <?php settings_fields('feboko_frontpage_group'); ?>

            <h2>Hero Section</h2>
            <?php $this->field($options, 'hero', 'title', 'Hero Title'); ?>
            <?php $this->field($options, 'hero', 'cta', 'Hero Button'); ?>

            <hr>

            <h2>About Section</h2>
            <?php $this->field($options, 'about', 'title', 'About Title'); ?>
            <?php $this->field($options, 'about', 'strong', 'About Text (Bold)'); ?>
            <?php $this->field($options, 'about', 'text', 'About Text', true); ?>
            <?php $this->field($options, 'about', 'cta', 'About Button'); ?>
            <?php $this->image_field($options, 'about', 'About Image'); ?>


            <hr>

            <h2>Running Team Section</h2>
            <?php $this->field($options, 'team', 'subtitle', 'Team Subtitle'); ?>
            <?php $this->field($options, 'team', 'title', 'Team Title'); ?>
            <?php $this->field($options, 'team', 'text', 'Team Text', true); ?>
            <?php $this->field($options, 'team', 'cta', 'Team Button'); ?>
            <?php $this->image_field($options, 'team', 'Team Image'); ?>

            <hr>

            <h2>Running Team Section (Argument 1)</h2>
            <p>Line Item becomes bold up to ":"</p>
            <?php $this->field($options, 'team_arg1', 'title', 'Argument Title'); ?>
            <?php $this->field($options, 'team_arg1', 'li1', 'Line 1'); ?>
            <?php $this->field($options, 'team_arg1', 'li2', 'Line 2'); ?>
            <?php $this->field($options, 'team_arg1', 'li3', 'Line 3'); ?>

            <hr>

            <h2>Running Team Section (Argument 2)</h2>
            <p>Line Item becomes bold up to ":"</p>
            <?php $this->field($options, 'team_arg2', 'title', 'Argument Title'); ?>
            <?php $this->field($options, 'team_arg2', 'li1', 'Line 1'); ?>
            <?php $this->field($options, 'team_arg2', 'li2', 'Line 2'); ?>
            <?php $this->field($options, 'team_arg2', 'li3', 'Line 3'); ?>

            <hr>

            <h2>Quote Section</h2>
            <p>Use [TEXT HERE] for bold text.</p>
            <?php $this->field($options, 'quote', 'text', 'Quote Text', true); ?>
            <?php $this->field($options, 'quote', 'author', 'Quote Author'); ?>

            <hr>

            <h2>Why FeBoKo Section</h2>
            <?php $this->field($options, 'why', 'subtitle', 'Why Subtitle'); ?>
            <?php $this->field($options, 'why', 'title', 'Why Title'); ?>
            <?php $this->field($options, 'why', 'text', 'Why Description', true); ?>
            <?php $this->field($options, 'why', 'cta', 'Why Button'); ?>
            <?php $this->field($options, 'why', 'bottom', 'Bottom Text'); ?>

            <hr>

            <h2>Why FeBoKo Section (Argument 1)</h2>
            <?php $this->field($options, 'why_arg1', 'title', 'Argument Title'); ?>
            <?php $this->field($options, 'why_arg1', 'text', 'Argument Text', true); ?>

            <hr>

            <h2>Why FeBoKo Section (Argument 2)</h2>
            <?php $this->field($options, 'why_arg2', 'title', 'Argument Title'); ?>
            <?php $this->field($options, 'why_arg2', 'text', 'Argument Text', true); ?>

            <hr>

            <h2>Why FeBoKo Section (Argument 3)</h2>
            <?php $this->field($options, 'why_arg3', 'title', 'Argument Title'); ?>
            <?php $this->field($options, 'why_arg3', 'text', 'Argument Text', true); ?>

            <hr>

            <h2>Free Consultation Section</h2>
            <?php $this->field($options, 'consult', 'subtitle', 'Consult Subtitle'); ?>
            <?php $this->field($options, 'consult', 'title', 'Consult Title'); ?>
            <?php $this->field($options, 'consult', 'text', 'Consult Description', true); ?>
            <?php $this->field($options, 'consult', 'cta', 'Consult Button'); ?>

            <hr>

            <h2>Services Section</h2>
            <?php $this->field($options, 'services', 'subtitle', 'Services Subtitle'); ?>
            <?php $this->field($options, 'services', 'title', 'Services Title'); ?>
            <?php $this->field($options, 'services', 'text', 'Services Description', true); ?>
            <?php $this->field($options, 'services', 'cta', 'Services Button'); ?>

            <hr>

            <h2>Why India Section</h2>
            <?php $this->field($options, 'india', 'subtitle', 'India Subtitle'); ?>
            <?php $this->field($options, 'india', 'title', 'India Title'); ?>
            <?php $this->field($options, 'india', 'text', 'India Description', true); ?>
            <?php $this->field($options, 'india', 'cta', 'India Button'); ?>

            <hr>

            <h2>Why India Section (Argument 1)</h2>
            <?php $this->field($options, 'india_arg1', 'title', 'Argument Title'); ?>
            <?php $this->field($options, 'india_arg1', 'subtitle', 'Argument Subtitle'); ?>
            <?php $this->field($options, 'india_arg1', 'text', 'Argument Text', true); ?>

            <hr>

            <h2>Why India Section (Argument 2)</h2>
            <?php $this->field($options, 'india_arg2', 'title', 'Argument Title'); ?>
            <?php $this->field($options, 'india_arg2', 'subtitle', 'Argument Subtitle'); ?>
            <?php $this->field($options, 'india_arg2', 'text', 'Argument Text', true); ?>

            <hr>

            <h2>Why India Section (Argument 3)</h2>
            <?php $this->field($options, 'india_arg3', 'title', 'Argument Title'); ?>
            <?php $this->field($options, 'india_arg3', 'subtitle', 'Argument Subtitle'); ?>
            <?php $this->field($options, 'india_arg3', 'text', 'Argument Text', true); ?>

            <hr>

            <h2>Our Founders Section</h2>
            <?php $this->field($options, 'founders', 'subtitle', 'Founders Subtitle'); ?>
            <?php $this->field($options, 'founders', 'title', 'Founders Title'); ?>
            <?php $this->field($options, 'founders', 'text', 'Founders Description', true); ?>
            <?php $this->field($options, 'founders', 'cta', 'Founders Button'); ?>

            <hr>

            <h2>Our Founders Section (Quotes)</h2>
            <?php $this->field($options, 'founders', 'philipp', 'Philipp Quote', true); ?>
            <?php $this->field($options, 'founders', 'Matthias', 'Matthias Quote', true); ?>
            <?php $this->image_field($options, 'founder1', 'Philipp Image'); ?>
            <?php $this->image_field($options, 'founder2', 'Matthias Image'); ?>

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

        <div class="admin-form-flex admin-image-form">
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
