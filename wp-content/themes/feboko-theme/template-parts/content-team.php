<?php
$active_team = isset($_GET['team']) ? intval($_GET['team']) : 0;
$classes = 'team-grid-card' . ($active_team === get_the_ID() ? ' active' : '');
?>

<article class="<?php echo esc_attr($classes); ?>" data-team-id="<?php echo esc_attr(get_the_ID()); ?>">
  <div class="team-photo-large-wrapper">
    <?php if (has_post_thumbnail()): ?>
      <?php
      the_post_thumbnail("large", array('class' => 'team-photo-large'));
      ?>
    <?php endif; ?>
  </div>
  <div class="team-content">
    <div class="team-header">
      <?php if (has_post_thumbnail()): ?>
        <?php
        the_post_thumbnail("thumbnail", array('class' => 'team-photo'));
        ?>
      <?php endif; ?>
      <div>
        <h3>
          <?php the_title(); ?>
        </h3>

        <?php
        $text = get_post_meta(get_the_ID(), '_team_position', true);

        if ($text) {
          echo '<p class="position">' . esc_html($text) . '</p>';
        }
        ?>
      </div>
      <div class="contact">

        <?php
        $text = get_post_meta(get_the_ID(), '_team_email', true);

        if ($text) {
          echo '<p>' . esc_html($text) . '</p>';
        }
        ?>

        <?php
        $text = get_post_meta(get_the_ID(), '_team_phone', true);

        if ($text) {
          echo '<p>' . esc_html($text) . '</p>';
        }
        ?>

      </div>
    </div>

    <?php
    $text = get_post_meta(get_the_ID(), '_team_about', true);
    $texten = get_post_meta(get_the_ID(), '_team_about_en', true);

    if (feboko_lang() === 'en' and $texten) {
      echo '<p class="about">' . esc_html($texten) . '</p>';
    } else {
      if ($text) {
        echo '<p class="about">' . esc_html($text) . '</p>';
      }
    }
    ?>

    <?php
    $archive_url = function_exists('get_post_type_archive_link') ? get_post_type_archive_link('team') : '';
    if (!$archive_url) {
      global $wp;
      $archive_url = home_url(add_query_arg(array(), $wp->request));
    }

    if ($active_team === get_the_ID()) {
      $link = esc_url(remove_query_arg('active', $archive_url));
    } else {
      $link = esc_url(add_query_arg('active', get_the_ID(), $archive_url));
    }
    ?>

    <a class="read-more" href="<?php echo $link; ?>" data-team-id="<?php echo esc_attr(get_the_ID()); ?>">
      <?php echo esc_html(feboko_t('Weiterlesen', 'Read More')); ?>
    </a>
  </div>
</article>