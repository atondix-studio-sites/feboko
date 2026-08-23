<article class="blog-grid-card">

  <?php if (has_post_thumbnail()): ?>
    <div class="blog-card-image">
      <?php the_post_thumbnail('large'); ?>
    </div>
  <?php endif; ?>

  <?php
    // Calculate reading time (avg 200 words per minute, rounded, min 1 min)
    $word_count    = str_word_count(wp_strip_all_tags(get_the_content()));
    $reading_time  = max(1, round($word_count / 200));
  ?>

  <div class="blog-card-body">
    <div class="blog-meta">
      <span class="blog-date">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <?php echo get_the_date('d.m.Y'); ?>
      </span>
      <span class="blog-reading-time">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <?php echo $reading_time; ?> <?php echo esc_html(feboko_t('Min. Lesezeit', 'min read')); ?>

      </span>
    </div>

    <h3><?php the_title(); ?></h3>

    <a class="read-more" href="<?php the_permalink(); ?>">
      <?php echo esc_html(feboko_t('Weiterlesen', 'Read More')); ?> &rarr;
    </a>
  </div>

</article>