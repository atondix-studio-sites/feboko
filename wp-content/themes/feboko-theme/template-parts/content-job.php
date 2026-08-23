<?php
/**
 * Template Part: Job Card
 * Team-showcase style card with click-to-expand.
 */

$job_id         = get_the_ID();
$location       = get_post_meta($job_id, '_job_location', true);
$type           = get_post_meta($job_id, '_job_type', true);
$department_de  = get_post_meta($job_id, '_job_department_de', true);
$department_en  = get_post_meta($job_id, '_job_department_en', true);
$deadline       = get_post_meta($job_id, '_job_deadline', true);
$summary_de     = get_post_meta($job_id, '_job_summary_de', true);
$summary_en     = get_post_meta($job_id, '_job_summary_en', true);
$desc_de        = get_post_meta($job_id, '_job_description_de', true);
$desc_en        = get_post_meta($job_id, '_job_description_en', true);
$req_de         = get_post_meta($job_id, '_job_requirements_de', true);
$req_en         = get_post_meta($job_id, '_job_requirements_en', true);
$contact        = get_post_meta($job_id, '_job_contact_email', true);

$lang        = feboko_lang();
$department  = ($lang === 'en' && $department_en) ? $department_en : $department_de;
$summary     = ($lang === 'en' && $summary_en) ? $summary_en : $summary_de;
$description = ($lang === 'en' && $desc_en) ? $desc_en : $desc_de;
$requirements = ($lang === 'en' && $req_en) ? $req_en : $req_de;

$type_map = [
  'fulltime'   => feboko_t('Vollzeit', 'Full-Time'),
  'parttime'   => feboko_t('Teilzeit', 'Part-Time'),
  'freelance'  => 'Freelance',
  'internship' => feboko_t('Praktikum', 'Internship'),
];
$type_label = $type_map[$type] ?? '';

$apply_subject = feboko_t('Bewerbung: ', 'Application: ') . get_the_title();
$apply_href    = $contact
  ? 'mailto:' . esc_attr($contact) . '?subject=' . esc_attr($apply_subject)
  : esc_url('#contact');
?>

<article class="job-grid-card" data-job-id="<?php echo esc_attr($job_id); ?>">
  <div class="job-card-content">

    <!-- Header: tags + title -->
    <div class="job-card-header">
      <div class="job-card__meta">
        <?php if ($department): ?>
          <span class="job-tag job-tag--dept"><?php echo esc_html($department); ?></span>
        <?php endif; ?>
        <?php if ($type_label): ?>
          <span class="job-tag job-tag--type"><?php echo esc_html($type_label); ?></span>
        <?php endif; ?>
      </div>
      <h3><?php the_title(); ?></h3>
    </div>

    <!-- Info pills -->
    <div class="job-card__info-row">
      <?php if ($location): ?>
        <span class="job-info-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <?php echo esc_html($location); ?>
        </span>
      <?php endif; ?>
      <?php if ($deadline): ?>
        <span class="job-info-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <?php echo esc_html(feboko_t('Bis', 'Deadline')); ?>: <?php echo esc_html(date_i18n('d.m.Y', strtotime($deadline))); ?>
        </span>
      <?php endif; ?>
    </div>

    <!-- Summary (clamped to 3 lines when collapsed) -->
    <?php if ($summary): ?>
      <p class="job-summary"><?php echo esc_html($summary); ?></p>
    <?php endif; ?>

    <!-- Expanded details (hidden until active) -->
    <div class="job-card-details">
      <?php if ($description): ?>
        <div class="job-card__section">
          <h4 class="job-card__section-heading"><?php echo esc_html(feboko_t('Deine Aufgaben', 'Responsibilities')); ?></h4>
          <div class="job-card__richtext"><?php echo wp_kses_post($description); ?></div>
        </div>
      <?php endif; ?>

      <?php if ($requirements): ?>
        <div class="job-card__section">
          <h4 class="job-card__section-heading"><?php echo esc_html(feboko_t('Das bringst du mit', 'Requirements')); ?></h4>
          <div class="job-card__richtext"><?php echo wp_kses_post($requirements); ?></div>
        </div>
      <?php endif; ?>

      <div class="job-card__apply">
        <a class="job-close-btn" href="#" data-job-id="<?php echo esc_attr($job_id); ?>">
          <?php echo esc_html(feboko_t('Schließen', 'Close')); ?>
        </a>
        <a href="<?php echo $apply_href; ?>" class="btn-primary">
          <?php echo esc_html(feboko_t('Jetzt bewerben', 'Apply Now')); ?>
        </a>
        <?php if ($contact): ?>
          <span class="job-card__apply-note">
            <?php echo esc_html(feboko_t('oder schreib uns direkt:', 'or contact us directly:')); ?>
            <a href="mailto:<?php echo esc_attr($contact); ?>"><?php echo esc_html($contact); ?></a>
          </span>
        <?php endif; ?>
      </div>
    </div>

    <!-- Read More link (hidden when active) -->
    <a class="read-more" href="#" data-job-id="<?php echo esc_attr($job_id); ?>">
      <?php echo esc_html(feboko_t('Weiterlesen', 'Read More')); ?>
    </a>

  </div>
</article>
