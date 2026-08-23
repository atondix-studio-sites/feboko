<article class="service-grid-card">

  <?php if (has_post_thumbnail()): ?>
    <?php the_post_thumbnail('large'); ?>
  <?php endif; ?>

  <h3><?php the_title(); ?></h3>

  <p>
    <?php echo get_the_excerpt(); ?>
  </p>

  <a class="read-more" href="<?php the_permalink(); ?>">
    <?php echo esc_html(feboko_t('Weiterlesen', 'Read More')); ?>
  </a>

</article>