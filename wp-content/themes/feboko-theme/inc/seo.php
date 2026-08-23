<?php
/**
 * SEO & Rich Presence Features
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Custom Robots Meta
 */
function feboko_custom_robots( $robots ) {
    $allow_index = is_front_page() ||
                   is_home() ||
                   is_singular( array( 'post', 'service', 'team', 'job' ) ) ||
                   is_post_type_archive( array( 'service', 'team', 'job' ) ) ||
                   is_page( array( 'blog', 'service', 'services', 'team', 'impressum' ) );

    if ( ! $allow_index ) {
        // noindex but keep following so first-party links are still crawled.
        $robots['noindex'] = true;
        unset( $robots['index'] );
        unset( $robots['max-image-preview'] );
        unset( $robots['max-snippet'] );
        unset( $robots['max-video-preview'] );
    }

    return $robots;
}
add_filter( 'wp_robots', 'feboko_custom_robots' );

/**
 * Clean, language-agnostic base URL for the current request (no ?lang=).
 *
 * @return string
 */
function feboko_current_base_url() {
    if ( is_singular() ) {
        $post = get_queried_object();
        // get_permalink() is filtered to append ?lang=en; strip it for the base.
        $url = $post ? get_permalink( $post ) : home_url( '/' );
    } else {
        global $wp;
        $url = home_url( add_query_arg( array(), $wp->request ) );
    }

    return remove_query_arg( 'lang', $url );
}

/**
 * Meta description for the current view.
 *
 * @return string
 */
function feboko_meta_description() {
    $description = '';

    if ( is_singular() ) {
        $post = get_queried_object();
        if ( $post ) {
            $description = wp_strip_all_tags( $post->post_excerpt );
            if ( empty( $description ) ) {
                $description = wp_trim_words( strip_shortcodes( $post->post_content ), 30 );
            }
        }
    }

    if ( empty( $description ) ) {
        $description = get_bloginfo( 'description' );
    }

    return trim( $description );
}

/**
 * Replace core's canonical with a language-aware one and emit hreflang
 * alternates so each language is discoverable as a distinct URL.
 */
remove_action( 'wp_head', 'rel_canonical' );
function feboko_canonical_and_hreflang() {
    if ( is_404() ) {
        return;
    }

    $base   = feboko_current_base_url();
    $de_url = $base;
    $en_url = add_query_arg( 'lang', 'en', $base );

    $canonical = ( feboko_lang() === 'en' ) ? $en_url : $de_url;

    echo '<link rel="canonical" href="' . esc_url( $canonical ) . '" />' . "\n";
    echo '<link rel="alternate" hreflang="de" href="' . esc_url( $de_url ) . '" />' . "\n";
    echo '<link rel="alternate" hreflang="en" href="' . esc_url( $en_url ) . '" />' . "\n";
    echo '<link rel="alternate" hreflang="x-default" href="' . esc_url( $de_url ) . '" />' . "\n";
}
add_action( 'wp_head', 'feboko_canonical_and_hreflang', 1 );

/**
 * Rich Presence / Open Graph + meta description
 */
function feboko_rich_presence() {
    $title       = wp_get_document_title();
    $description = feboko_meta_description();
    $site_name   = get_bloginfo( 'name' );
    $type        = is_singular() ? 'article' : 'website';
    $image       = '';
    $is_en       = ( feboko_lang() === 'en' );

    $base = feboko_current_base_url();
    $url  = $is_en ? add_query_arg( 'lang', 'en', $base ) : $base;

    if ( is_singular() ) {
        $post = get_queried_object();
        if ( $post ) {
            $image = get_the_post_thumbnail_url( $post, 'large' );
        }
    }

    if ( empty( $image ) && has_custom_logo() ) {
        $custom_logo_id = get_theme_mod( 'custom_logo' );
        $image = wp_get_attachment_image_url( $custom_logo_id, 'full' );
    }

    if ( ! empty( $description ) ) {
        echo '<meta name="description" content="' . esc_attr( $description ) . '" />' . "\n";
    }

    echo '<meta property="og:title" content="' . esc_attr( $title ) . '" />' . "\n";
    if ( ! empty( $description ) ) {
        echo '<meta property="og:description" content="' . esc_attr( $description ) . '" />' . "\n";
    }
    echo '<meta property="og:url" content="' . esc_url( $url ) . '" />' . "\n";
    echo '<meta property="og:site_name" content="' . esc_attr( $site_name ) . '" />' . "\n";
    echo '<meta property="og:type" content="' . esc_attr( $type ) . '" />' . "\n";
    echo '<meta property="og:locale" content="' . ( $is_en ? 'en_US' : 'de_DE' ) . '" />' . "\n";
    echo '<meta property="og:locale:alternate" content="' . ( $is_en ? 'de_DE' : 'en_US' ) . '" />' . "\n";
    if ( ! empty( $image ) ) {
        echo '<meta property="og:image" content="' . esc_url( $image ) . '" />' . "\n";
        echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
        echo '<meta name="twitter:image" content="' . esc_url( $image ) . '" />' . "\n";
    }
    echo '<meta name="twitter:title" content="' . esc_attr( $title ) . '" />' . "\n";
    if ( ! empty( $description ) ) {
        echo '<meta name="twitter:description" content="' . esc_attr( $description ) . '" />' . "\n";
    }
}
add_action( 'wp_head', 'feboko_rich_presence', 5 );

/**
 * Organization JSON-LD structured data (emitted on the front page).
 *
 * Sourced from the company details shown in the site footer.
 */
function feboko_organization_schema() {
    if ( ! is_front_page() ) {
        return;
    }

    $logo = '';
    if ( has_custom_logo() ) {
        $logo = wp_get_attachment_image_url( get_theme_mod( 'custom_logo' ), 'full' );
    }
    if ( empty( $logo ) ) {
        $logo = get_template_directory_uri() . '/assets/images/logo.svg';
    }

    $data = array(
        '@context' => 'https://schema.org',
        '@type'    => 'ProfessionalService',
        'name'     => 'FeBoKo Consulting GbR',
        'url'      => home_url( '/' ),
        'logo'     => $logo,
        'email'    => 'info@feboko.com',
        'telephone' => '+49 157 33717052',
        'description' => get_bloginfo( 'description' ),
        'address'  => array(
            '@type'           => 'PostalAddress',
            'streetAddress'   => 'Rosestraße 2',
            'postalCode'      => '95448',
            'addressLocality' => 'Bayreuth',
            'addressCountry'  => 'DE',
        ),
        'sameAs'   => array(
            'https://www.linkedin.com/company/feboko',
        ),
        'subOrganization' => array(
            array(
                '@type'     => 'Organization',
                'name'      => 'FeBoKo & Partners India Pvt. Ltd.',
                'email'     => 'delhi.office@feboko.com',
                'telephone' => '+91 88604 50708',
                'address'   => array(
                    '@type'           => 'PostalAddress',
                    'streetAddress'   => '15th Floor, Eros Corporate Tower, Nehru Place',
                    'postalCode'      => '110019',
                    'addressLocality' => 'New Delhi',
                    'addressRegion'   => 'Delhi',
                    'addressCountry'  => 'IN',
                ),
            ),
            array(
                '@type'     => 'Organization',
                'name'      => 'FeBoKo & Partners India Pvt. Ltd. (Pune)',
                'email'     => 'pune.office@feboko.com',
                'telephone' => '+91 99991 83114',
                'address'   => array(
                    '@type'           => 'PostalAddress',
                    'streetAddress'   => 'Office No. 901, 9th Floor, Sunit Capital, Senapati Bapat Rd',
                    'postalCode'      => '411016',
                    'addressLocality' => 'Pune',
                    'addressRegion'   => 'Maharashtra',
                    'addressCountry'  => 'IN',
                ),
            ),
        ),
    );

    echo '<script type="application/ld+json">' . wp_json_encode( $data ) . '</script>' . "\n";
}
add_action( 'wp_head', 'feboko_organization_schema', 6 );

/**
 * XML sitemap: drop providers that advertise non-indexable URLs.
 *
 * Author archives redirect home; category archives are noindex via feboko_custom_robots().
 *
 * @param WP_Sitemaps_Provider|false $provider Provider instance or false to disable.
 * @param string                     $name     Provider name.
 * @return WP_Sitemaps_Provider|false
 */
function feboko_sitemaps_filter_providers( $provider, $name ) {
    if ( 'users' === $name ) {
        return false;
    }
    return $provider;
}
add_filter( 'wp_sitemaps_add_provider', 'feboko_sitemaps_filter_providers', 10, 2 );

/**
 * Disable taxonomy sitemaps (category / tag archives are noindex).
 *
 * @return array
 */
function feboko_sitemaps_disable_taxonomies() {
    return array();
}
add_filter( 'wp_sitemaps_taxonomies', 'feboko_sitemaps_disable_taxonomies' );

/**
 * Exclude noindex legal pages from the page sitemap.
 *
 * @param array  $args      WP_Query args for sitemap entries.
 * @param string $post_type Post type.
 * @return array
 */
function feboko_sitemaps_exclude_pages( $args, $post_type ) {
    if ( 'page' !== $post_type ) {
        return $args;
    }

    $exclude_ids = array();
    foreach ( array( 'datenschutz', 'nutzungsbedingungen' ) as $slug ) {
        $page = get_page_by_path( $slug );
        if ( $page ) {
            $exclude_ids[] = (int) $page->ID;
        }
    }

    if ( empty( $exclude_ids ) ) {
        return $args;
    }

    $existing              = isset( $args['post__not_in'] ) ? (array) $args['post__not_in'] : array();
    $args['post__not_in']  = array_values( array_unique( array_merge( $existing, $exclude_ids ) ) );

    return $args;
}
add_filter( 'wp_sitemaps_posts_query_args', 'feboko_sitemaps_exclude_pages', 10, 2 );

/**
 * Extra sitemap entries: CPT archives and English variants of bilingual surfaces.
 *
 * Core sitemaps omit post type archives. English lives on ?lang=en for pages/archives/team
 * (services and blog posts are separate DE/EN posts and already listed individually).
 */
function feboko_register_sitemap_provider() {
    if ( ! class_exists( 'WP_Sitemaps_Provider' ) ) {
        return;
    }

    if ( ! class_exists( 'Feboko_Sitemaps_Provider' ) ) {
        /**
         * Custom sitemap provider for archive + language URLs.
         */
        class Feboko_Sitemaps_Provider extends WP_Sitemaps_Provider {
            /**
             * Constructor.
             */
            public function __construct() {
                $this->name        = 'feboko';
                $this->object_type = 'feboko';
            }

            /**
             * @param int    $page_num       Page of results.
             * @param string $object_subtype Unused.
             * @return array[]
             */
            public function get_url_list( $page_num, $object_subtype = '' ) {
                $urls = array();
                foreach ( $this->get_entry_locs() as $loc ) {
                    $urls[] = array( 'loc' => $loc );
                }
                return $urls;
            }

            /**
             * @param string $object_subtype Unused.
             * @return int
             */
            public function get_max_num_pages( $object_subtype = '' ) {
                return 1;
            }

            /**
             * Build absolute locs for archives and EN variants.
             *
             * @return string[]
             */
            private function get_entry_locs() {
                $locs = array();

                foreach ( array( 'service', 'team', 'job' ) as $post_type ) {
                    $link = get_post_type_archive_link( $post_type );
                    if ( ! $link ) {
                        continue;
                    }
                    $link   = remove_query_arg( 'lang', $link );
                    $locs[] = $link;
                    $locs[] = add_query_arg( 'lang', 'en', $link );
                }

                $page_ids = array_filter(
                    array_map(
                        'intval',
                        array(
                            get_option( 'page_on_front' ),
                            get_option( 'page_for_posts' ),
                        )
                    )
                );

                $impressum = get_page_by_path( 'impressum' );
                if ( $impressum ) {
                    $page_ids[] = (int) $impressum->ID;
                }

                foreach ( array_unique( $page_ids ) as $page_id ) {
                    $link = get_permalink( $page_id );
                    if ( ! $link ) {
                        continue;
                    }
                    $locs[] = add_query_arg( 'lang', 'en', remove_query_arg( 'lang', $link ) );
                }

                // Team + job singles use bilingual fields (same path, ?lang=en).
                foreach ( array( 'team', 'job' ) as $post_type ) {
                    $ids = get_posts(
                        array(
                            'post_type'              => $post_type,
                            'post_status'            => 'publish',
                            'posts_per_page'         => -1,
                            'fields'                 => 'ids',
                            'no_found_rows'          => true,
                            'update_post_meta_cache' => false,
                            'update_post_term_cache' => false,
                        )
                    );
                    foreach ( $ids as $post_id ) {
                        $link = get_permalink( $post_id );
                        if ( ! $link ) {
                            continue;
                        }
                        $locs[] = add_query_arg( 'lang', 'en', remove_query_arg( 'lang', $link ) );
                    }
                }

                return array_values( array_unique( $locs ) );
            }
        }
    }

    wp_register_sitemap_provider( 'feboko', new Feboko_Sitemaps_Provider() );
}
add_action( 'init', 'feboko_register_sitemap_provider', 20 );
