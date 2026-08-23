<footer class="site-footer" id="contact">
  <div class="footer-contact-area">
    <div class="footer-contact-form">
      <div class="footer-contact-form-intro">
        <p class="section-subtitle">
          <?php echo esc_html(feboko_t('Kostenloses Erstgespräch', 'Free Initial Consultation')); ?>
        </p>

        <h2 class="section-title">
          <?php echo esc_html(feboko_t('Sprechen Sie mit unserem Beraterteam', 'Speak with Our Advisory Team')); ?>
        </h2>

        <p class="section-description">
          <?php echo esc_html(feboko_t(
            'Profitieren Sie von globaler Perspektive und lokaler Expertise – für Ihren Markteintritt in Indien. Fundierte Marktanalysen, Standortbewertungen und unser starkes Netzwerk sichern Ihren nachhaltigen Erfolg.',
            'Benefit from a global perspective and local expertise – for your market entry in India. Thorough market analyses, location assessments, and our strong network ensure your sustainable success.'
          )); ?>
        </p>
      </div>

      <div class="footer-contact-form-wrapper">
        <?php

        $language = feboko_lang();
        if ($language === 'en') {
          echo do_shortcode('[contact-form-7 id="d23f6e1" title="Contact Form EN"]');
        } else {
          echo do_shortcode('[contact-form-7 id="9e16b11" title="Contact Form DE"]');
        }
        ?>
      </div>
    </div>
  </div>

  <div class="footer-main">
    <div class="footer-contact">
      <div class="footer-contact-block">
        <h4>FeBoKo Consulting GbR</h4>
        <p>Rosestraße 2</p>
        <p style="margin-bottom: 6px;">95448 Bayreuth</p>
        <p>E-Mail: <a href="mailto:info@feboko.com">info@feboko.com</a></p>
        <p>Tel.: +49 (0) 157 33717052</p>
      </div>

      <div class="footer-contact-block">
        <h4>FeBoKo & Partners India Pvt. Ltd.</h4>
        <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 6px;">
          <div style="flex: 1; min-width: 200px;">
            <p>15th Floor, Eros Corporate Tower Nehru Place</p>
            <p>New-Delhi, Delhi 110019</p>
			<p>E-Mail: <a href="mailto:delhi.office@feboko.com">delhi.office@feboko.com</a></p>
        	<p>Tel.: +91 88604 50708</p>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <p>Office No. 901, 9th Floor</p>
            <p>Sunit Capital, Senapati Bapat Rd</p>
            <p>Pune, Maharashtra 411016</p>
			<p>E-Mail: <a href="mailto:pune.office@feboko.com">pune.office@feboko.com</a></p>
        	<p>Tel.: +91 99991 83114</p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-spacer"></div>

    <div class="footer-column">
      <h4>FeBoKo</h4>
      <?php
      wp_nav_menu(array(
        'theme_location' => 'footer-feboko',
        'menu_class' => '',
        'container' => false,
        'fallback_cb' => 'feboko_footer_feboko_menu',
      ));
      ?>
    </div>

    <div class="footer-column">
      <h4><?php echo esc_html(feboko_t('Rechtliches', 'Legal')); ?></h4>
      <?php
      wp_nav_menu(array(
        'theme_location' => 'footer-legal',
        'menu_class' => '',
        'container' => false,
        'fallback_cb' => 'feboko_footer_legal_menu',
      ));
      ?>
    </div>
  </div>

  <div class="footer-social">
    <a href="https://www.linkedin.com/company/feboko" target="_blank" class="social-icon" aria-label="LinkedIn">
      <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
        <rect width="45" height="45" fill="#787DB9" />
        <path
          d="M16.5 19.5H12V33H16.5V19.5ZM14.25 17.625C15.6375 17.625 16.7625 16.5 16.7625 15.1125C16.7625 13.725 15.6375 12.6 14.25 12.6C12.8625 12.6 11.7375 13.725 11.7375 15.1125C11.7375 16.5 12.8625 17.625 14.25 17.625ZM33 33H33.0075V25.65C33.0075 22.125 32.2125 19.35 28.0875 19.35C26.1 19.35 24.75 20.475 24.225 21.5625H24.1725V19.5H19.95V33H24.45V26.4C24.45 24.675 24.75 22.95 26.925 22.95C29.1 22.95 29.1 24.975 29.1 26.55V33H33Z"
          fill="#F5F5F5" />
      </svg>
    </a>
  </div>

  <div class="footer-bottom">
    <p>Copyright &copy; <?php echo date('Y'); ?> FeBoKo Consulting</p>
  </div>
  <style>
    .border-box ul li::before {
      -webkit-mask: url("<?php echo get_template_directory_uri(); ?>/assets/icons/check-circle.svg") no-repeat center;
      mask: url("<?php echo get_template_directory_uri(); ?>/assets/icons/check-circle.svg") no-repeat center;

      -webkit-mask-size: contain;
      mask-size: contain;
    }
  </style>

</footer>

<?php wp_footer(); ?>
</body>

</html>

<?php
/**
 * Fallback menu for footer FeBoKo
 */
function feboko_footer_feboko_menu()
{
  ?>
  <ul>
    <li><a href="<?php echo esc_url(feboko_localize_url(home_url('/'))); ?>">Homepage</a></li>
    <li><a href="<?php echo esc_url(feboko_localize_url(home_url('/services'))); ?>">Services</a></li>
    <li><a href="<?php echo esc_url(feboko_localize_url(home_url('/team'))); ?>">Team</a></li>
    <li><a href="<?php echo esc_url(get_post_type_archive_link('job')); ?>"><?php echo esc_html(feboko_t('Karriere', 'Careers')); ?></a></li>
    <li><a href="<?php echo esc_url(feboko_localize_url(home_url('/blog'))); ?>">Blog</a></li>
  </ul>
  <?php
}

/**
 * Fallback menu for footer Legal
 */
function feboko_footer_legal_menu()
{
  ?>
  <ul>
    <li><a
        href="<?php echo esc_url(feboko_localize_url(home_url('/impressum'))); ?>"><?php echo esc_html(feboko_t('Impressum', 'Imprint')); ?></a>
    </li>
    <li><a
        href="<?php echo esc_url(feboko_localize_url(home_url('/datenschutz'))); ?>"><?php echo esc_html(feboko_t('Datenschutz', 'Privacy Policy')); ?></a>
    </li>
    <li><a
        href="<?php echo esc_url(feboko_localize_url(home_url('/nutzungsbedingungen'))); ?>"><?php echo esc_html(feboko_t('Nutzungsbedingungen', 'Terms of Use')); ?></a>
    </li>
    <li><a
        href="<?php echo esc_url(feboko_localize_url(home_url('/#contact'))); ?>"><?php echo esc_html(feboko_t('Kontakt', 'Contact')); ?></a>
    </li>
  </ul>
  <?php
}
