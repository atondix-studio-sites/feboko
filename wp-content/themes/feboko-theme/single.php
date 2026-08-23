<?php
/**
 * Template for displaying single blog posts/articles
 */

get_header(); ?>

<main class="content single-service">

  <!-- Page Header -->
  <section class="service-hero container">
    <h1 class="page-title"><?php the_title(); ?></h1>

    <a class="btn-primary" href="<?php echo esc_url(get_permalink(get_option('page_for_posts'))); ?>">
      <?php echo esc_html(feboko_t('Alle Artikel entdecken', 'Discover All Articles')); ?>
    </a>
  </section>


  <!-- Breadcrumbs -->
  <section class="container breadcrumbs">
    <a href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">Home</a>
    <span>›</span>
    <a href="<?php echo esc_url(get_permalink(get_option('page_for_posts'))); ?>">Blog</a>
    <span>›</span>
    <a class="current"><?php the_title(); ?></a>
  </section>


  <!-- Layout -->
  <section class="container content service-layout">

    <!-- Sidebar: Table of Contents -->
    <div class="service-sidebar toc-sidebar" id="toc-sidebar">
      <h3><?php echo esc_html(feboko_t('Inhaltsverzeichnis', 'Table of Contents')); ?></h3>
      <nav id="toc-nav" class="toc-nav">
        <!-- Populated by JavaScript -->
      </nav>
    </div>


    <!-- Content -->
    <div class="service-content">

      <div class="service-intro">

        <?php if (has_post_thumbnail()): ?>
          <div class="intro-image-large">
            <?php the_post_thumbnail('full'); ?>
          </div>
        <?php endif; ?>
      </div>

      <div class="service-body content no-padding-top" id="article-body">
        <?php the_content(); ?>
      </div>

      <hr>

      <!-- Related Articles -->
      <div class="service-next">
        <h2><?php echo esc_html(feboko_t('Weiterlesen', 'Continue Reading')); ?></h2>

        <div class="blog-grid">

          <?php
          $related_posts = new WP_Query([
            'post_type' => 'post',
            'posts_per_page' => 2,
            'post__not_in' => [get_the_ID()],
            'orderby' => 'date',
            'order' => 'DESC',
            'meta_query' => [
              [
                'key' => '_feboko_service_language',
                'value' => feboko_lang(),
              ],
            ],
          ]);

          if ($related_posts->have_posts()):
            while ($related_posts->have_posts()):
              $related_posts->the_post();

              get_template_part('template-parts/content', 'blog');

            endwhile;
            wp_reset_postdata();
          endif;
          ?>

        </div>
      </div>

    </div>
  </section>

</main>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var articleBody = document.getElementById('article-body');
    var tocNav = document.getElementById('toc-nav');

    if (!articleBody || !tocNav) return;

    var headings = articleBody.querySelectorAll('h2, h3, h4');

    if (headings.length === 0) {
      // Hide TOC sidebar if no headings found
      var sidebar = document.getElementById('toc-sidebar');
      if (sidebar) sidebar.style.display = 'none';
      return;
    }

    headings.forEach(function (heading, index) {
      // Generate an ID for each heading if it doesn't have one
      if (!heading.id) {
        heading.id = 'toc-heading-' + index;
      }

      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      link.className = 'toc-link toc-' + heading.tagName.toLowerCase();

      link.addEventListener('click', function (e) {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      tocNav.appendChild(link);
    });

    // Highlight active TOC item on scroll
    var tocLinks = tocNav.querySelectorAll('.toc-link');

    function updateActiveToc() {
      var scrollPos = window.scrollY + 120;

      var currentHeading = null;
      headings.forEach(function (heading) {
        if (heading.offsetTop <= scrollPos) {
          currentHeading = heading;
        }
      });

      tocLinks.forEach(function (link) {
        link.classList.remove('active');
      });

      if (currentHeading) {
        var activeLink = tocNav.querySelector('a[href="#' + currentHeading.id + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    }

    window.addEventListener('scroll', updateActiveToc);
    updateActiveToc();
  });
</script>

<?php get_footer(); ?>