<?php
/*
Plugin Name: WP Security Hardening
Description: Mitigates REST API batch route confusion (CVE-2026-63030), author__not_in SQLi (CVE-2026-60137), and public user enumeration.
Version: 1.1.0
Author: WordPress Security
*/

// Block unauthenticated REST batch endpoints (attackers used /batch/v1, not only /v2/batch).
add_filter('rest_pre_dispatch', function ($result, $server, $request) {
	if ($result !== null) {
		return $result;
	}
	$route = $request->get_route();
	if (preg_match('#/(?:wp/v2/)?batch(?:/v1)?\b#i', $route) && !is_user_logged_in()) {
		return new WP_Error(
			'rest_batch_forbidden',
			'Batch endpoint requires authentication.',
			array('status' => 403)
		);
	}
	return $result;
}, 5, 3);

// Harden author__not_in against SQLi-style abuse.
add_action('pre_get_posts', function ($query) {
	if (!empty($query->query_vars['author__not_in'])) {
		$query->query_vars['author__not_in'] = array_map(
			'absint',
			(array) $query->query_vars['author__not_in']
		);
	}
});

// Stop public user enumeration via REST.
add_filter('rest_endpoints', function ($endpoints) {
	if (isset($endpoints['/wp/v2/users'])) {
		unset($endpoints['/wp/v2/users']);
	}
	if (isset($endpoints['/wp/v2/users/(?P<id>[\d]+)'])) {
		if (!is_user_logged_in()) {
			unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
		}
	}
	return $endpoints;
});

add_filter('rest_prepare_user', function ($response, $user, $request) {
	if (!is_user_logged_in()) {
		return new WP_Error(
			'rest_user_cannot_view',
			'User listing is disabled.',
			array('status' => 401)
		);
	}
	return $response;
}, 10, 3);

// Author archives are not public content. Return a real 404 instead of
// 301→home (soft-404), which caused Google to keep indexing /author/* URLs.
add_action('template_redirect', function () {
	if (!is_author() || is_user_logged_in()) {
		return;
	}
	global $wp_query;
	$wp_query->set_404();
	status_header(404);
	nocache_headers();
	$template = get_query_template('404');
	if ($template) {
		include $template;
	}
	exit;
}, 0);

/**
 * Attachment pretty-permalinks (/fbk/, /img_…/, /post/image-slug/) are not
 * real pages. Core redirects them to the media file when attachment pages
 * are disabled, which still leaves crawlable “page” URLs in the index.
 * Send them to the parent post (or 404) so Google drops the phantoms.
 */
add_action('template_redirect', function () {
	if (!is_attachment()) {
		return;
	}

	$parent_id = wp_get_post_parent_id(get_queried_object_id());
	if ($parent_id && get_post_status($parent_id) === 'publish') {
		wp_safe_redirect(get_permalink($parent_id), 301);
		exit;
	}

	global $wp_query;
	$wp_query->set_404();
	status_header(404);
	nocache_headers();
	$template = get_query_template('404');
	if ($template) {
		include $template;
	}
	exit;
}, 0);
