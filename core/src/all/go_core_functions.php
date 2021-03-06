<?php
/**
 * Created by PhpStorm.
 * User: mcmurray
 * Date: 2019-05-15
 * Time: 21:44
 */



//clone a post
//if it's a template clone it as a task
/**
 * @param bool $is_template
 * @param bool $print
 */
function go_clone_post_new($is_template = false, $print = false){
    global $wpdb;
    /*
     * get the original post id
     */
    $post_id = (isset($_GET['post']) ? absint( $_GET['post'] ) : absint( $_POST['post'] ) );
    $global = (isset($_GET['global']) ? $_GET['global']  : false );
    $chain_id = (isset($_GET['chain_id']) ? $_GET['chain_id']  : false );
    $frontend_edit = (isset($_GET['frontend_edit']) ? $_GET['frontend_edit']  : false );

    /*
    * if you don't want current user to be the new post author,
    * then change next couple of lines to this: $new_post_author = $post->post_author;
    */
    $current_user = wp_get_current_user();
    $new_post_author = $current_user->ID;

    if ($post_id == 0){
        if($frontend_edit){
            //make a new empty post
            $args = array (
                'comment_status' => 'open',
                'ping_status' => 'closed',
                'post_author' => $new_post_author,
                'post_content' => '',
                'post_excerpt' => '',
                'post_name' => '',
                'post_parent' => 0,
                'post_password' => '',
                'post_status' => 'draft',
                'post_title' => 'New Post Title',
                'post_type' => 'tasks',
                'to_ping' => '',
                'menu_order' => 0,
            );


            $new_post_id = wp_insert_post( $args );
            if($chain_id){
                update_post_meta( $new_post_id, 'go-location_map_toggle', 1 );
                update_post_meta( $new_post_id, 'go-location_map_loc', $chain_id );
                $order = count(go_get_chain_posts($chain_id, 'task_chains'))+1;
                update_post_meta( $new_post_id, 'go-location_map_order_item', $order );
                update_post_meta( $new_post_id, 'go_stages', 1 );
                wp_set_post_terms( $new_post_id, $chain_id, 'task_chains');
                wp_update_post(array(
                    'ID'    =>  $new_post_id,
                    'post_status'   =>  'publish'
                ));

                $key = 'go_get_chain_posts_' . $chain_id;
                go_delete_transient($key);
            }



            echo json_encode(array('redirect' => 'false', 'post_id' => $new_post_id));
            die();
        }
        if ($print){
            $link = get_admin_url(null, 'post-new.php?post_type=tasks');
            echo json_encode(array('redirect' => 'true', 'link' => $link));
            die();
        }
    }
    /*
     * and all the original post data then
     */
    if($global == "true" && is_gameful()){
        $primary_blog_id = get_main_site_id();
        switch_to_blog(intval($primary_blog_id));
    }
    $post = get_post( $post_id );



    /*
     * if post data exists, create the post duplicate
     */
    if (isset( $post ) && $post != null) {

        if ($is_template) {
            $post_type = 'tasks';
        }else{
            $post_type = $post->post_type;
        }

        /*
         * new post data array
         */
        $args = array(
            'comment_status' => $post->comment_status,
            'ping_status'    => $post->ping_status,
            'post_author'    => $new_post_author,
            'post_content'   => $post->post_content,
            'post_excerpt'   => $post->post_excerpt,
            'post_name'      => $post->post_name,
            'post_parent'    => $post->post_parent,
            'post_password'  => $post->post_password,
            'post_status'    => 'draft',
            'post_title'     => $post->post_title . " copy",
            'post_type'      => $post_type,
            'to_ping'        => $post->to_ping,
            'menu_order'     => $post->menu_order
        );

        /*
         * insert the post by wp_insert_post() function
         */
        if($global == "true" && is_gameful()){
            restore_current_blog();
        }

        $new_post_id = wp_insert_post( $args );

        if($global !== "true") {
            /*
             * get all current post terms ad set them to the new post draft
             */
            $taxonomies = get_object_taxonomies($post->post_type); // returns array of taxonomy names for post type, ex array("category", "post_tag");

            foreach ($taxonomies as $taxonomy) {
                $post_terms = wp_get_object_terms($post_id, $taxonomy, array('fields' => 'slugs'));
                wp_set_object_terms($new_post_id, $post_terms, $taxonomy, false);
            }
        }
        /*
         * duplicate all post meta just in two SQL queries
         */
        if($global == "true" && is_gameful()){
            $primary_blog_id = get_main_site_id();
            switch_to_blog(intval($primary_blog_id));
        }
        $post_meta_infos = $wpdb->get_results("SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id=$post_id");
        if($global == "true" && is_gameful()){
            restore_current_blog();
        }



        if (count($post_meta_infos)!=0) {
            $sql_query = "INSERT INTO $wpdb->postmeta (post_id, meta_key, meta_value) ";
            foreach ($post_meta_infos as $meta_info) {
                $meta_key = $meta_info->meta_key;
                if( $meta_key == '_wp_old_slug' ) continue;
                $meta_value = addslashes($meta_info->meta_value);
                $sql_query_sel[]= "SELECT $new_post_id, '$meta_key', '$meta_value'";
            }
            $sql_query.= implode(" UNION ALL ", $sql_query_sel);
            $wpdb->query($sql_query);
        }

        if($chain_id){
            update_post_meta( $new_post_id, 'go-location_map_toggle', 1 );
            update_post_meta( $new_post_id, 'go-location_map_loc', $chain_id );
            wp_set_post_terms( $new_post_id, $chain_id, 'task_chains');
            wp_update_post(array(
                'ID'    =>  $new_post_id,
                'post_status'   =>  'publish'
            ));

            $key = 'go_get_chain_posts_' . $chain_id;
            go_delete_transient($key);

        }

        if($frontend_edit){
            echo json_encode(array('redirect' => 'false', 'post_id' => $new_post_id));
            die();
        }

        if ($print){
            $link =  admin_url( 'post.php?action=edit&post=' . $new_post_id );
            echo json_encode(array('redirect' => 'true', 'link' => $link));
            die();
        }
        /*
         * finally, redirect to the edit post screen for the new draft
         */
        wp_redirect( admin_url( 'post.php?action=edit&post=' . $new_post_id ) );
        exit;
    } else {
        wp_die('Post creation failed, could not find original post: ' . $post_id);
    }
}

/**
 * Called by the ajax dataloaders.
 * @param $TIMESTAMP
 * @return false|string
 */
function go_clipboard_time($TIMESTAMP){
    if ($TIMESTAMP != null) {
        $time = date("m/d/y g:i A", strtotime($TIMESTAMP));
    }else{
        $time = "N/A";
    }
    return $time;
}


//this then uses select2 and ajax to make dropdown
//if is ca
/**
 * @param $taxonomy
 * @param null $is_lightbox (location is needed in case there are multiple dropdowns for the same taxonomy ie: messages on the clipboard)
 * @param bool $value //optional: the value of the term
 * @param bool $value_name //optional: the title of the term
 * @param bool $activate_filter
 */
function go_make_tax_select ($taxonomy, $location = 'page', $value = false, $value_name = false, $activate_filter = false){

    if($activate_filter){
        $class = 'go_activate_filter';
    }else{
        $class = '';
    }

    echo "<select id='go_". $location . "_" . $taxonomy . "_select' ";
    if ($value) {
        echo " data-value='$value' ";
    }
    if($value_name){
        echo "data-value_name='$value_name' ";
    }
    echo " class='$class'></select>";
}



/**
 * @param $term_ids
 * @return array|string|null
 */
function go_print_term_list($term_ids){
    if (is_serialized($term_ids)) {
        $term_ids = unserialize($term_ids);
    }

    if (!is_array($term_ids)){
            $term_ids = explode(',', $term_ids);
    }
    if (is_array($term_ids)){
        $list = array();
        foreach ($term_ids as $term_id){
            $term_id = intval($term_id);
            if (!empty($term_id)) {
                $term = get_term($term_id);
                if (!empty($term)) {
                    $name = $term->name;
                    $list[] = $name;
                }
            }
        }
        if(!empty($list)) {
            $list = implode("<br>", $list);
            //$list = '<span class="tooltip" data-tippy-content="'. $list .'">'. $list . '</span>';
            $list = '<span>' . $list . '</span>';
        }else{
            $list = '';
        }

    }
    else{
        $list = null;

    }
    return $list;
}


/**
 * @param $key
 * @return string
 */
function go_prefix_key($key){

    global $wpdb;
    $prefix = $wpdb->prefix;
    if ($prefix) {
        $key = $prefix . $key;
    }
    return $key;
}

function go_get_terms_ordered($taxonomy, $parent = '', $number = ''){
    $args = array(
        'number' => $number,
        'parent' => $parent,
        'orderby' => 'meta_value_num',
        'order' => 'ASC',
        'meta_query' => array(
            'relation' => 'OR',
            array(
                'key' => 'go_order',
                'compare' => 'NOT EXISTS'
            ),
            array(
                'key' => 'go_order',
                'value' => 0,
                'compare' => '>='
            )
        ),
        'hide_empty' => false
    );

    $terms = get_terms($taxonomy, $args);//the rows

    return $terms;
}

function go_get_ordered_posts($term_id, $taxonomy = ''){
    $taxonomy = null;
    if(empty($taxonomy)) {
        $term = get_term($term_id);
        $taxonomy = $term->taxonomy;
    }

    if($taxonomy === 'task_chains'){
        $post_type = 'tasks';
        $order_key_name = 'go-location_map_order_item';
        $toggle_key = 'go-location_map_toggle';
        $loc_key = 'go-location_map_loc';
    }
    else if($taxonomy === 'store_types'){
        $post_type = 'go_store';
        $order_key_name = 'go-store-location_store_item';
        $toggle_key = 'go-store-location_store-sec_toggle';
        $loc_key = 'go-store-location_store-sec_loc';
    }else{
        return;
    }
    $args = array(
        'post_type' => $post_type,
        'orderby' => 'meta_value_num',
        'order' => 'ASC',
        'posts_per_page' => -1,
        'meta_key' => $order_key_name,
        'post_status' => 'publish',
        'suppress_filters' => true,
        'meta_query' => array(
            array(
                'key'     => $toggle_key,
                'value'   => 1,
            )
        ),
        'meta_query' => array(
            array(
                'key'     => $loc_key,
                'value'   => $term_id,
            )
        ),
    );


    $posts = get_posts($args);

    return $posts;
}


function go_get_page_uri(){
    $request_uri = (isset($_SERVER['REQUEST_URI']) ?  $_SERVER['REQUEST_URI'] : null);//page currently being loaded

    $str = basename($request_uri);
    $sub = substr($str, 0, 1);
    if ($sub == '?'){
        $request_uri = str_replace($str, '', $request_uri);
        $str = basename($request_uri);
    }
    $page_uri = strtok($str,'?');


    return $page_uri;
}

function go_get_fullname($user_id = ''){
    if(empty($user_id)){
        $user_id = get_current_user_id();
    }

    if(empty($user_id)) {
        return;
    }
    $user_data = get_userdata($user_id);

    $user_display_name = go_get_user_display_name($user_id);

    $full_name_toggle = get_option('options_go_full-names_toggle');
    $is_admin = go_user_is_admin();

    //$show_real_names = go_show_hidden();

    if ($full_name_toggle == 'full' || ($is_admin)) {
        $name = "{$user_data->first_name} {$user_data->last_name} ({$user_display_name})";
    } else if ($full_name_toggle == 'first') {
        $name = "{$user_data->first_name} ({$user_display_name})";

    } else {
        $name = $user_display_name;
    }

    return $name;
}
//
function go_get_user_display_name($user_id = ''){
    if(empty($user_id)){
        $user_id = get_current_user_id();
    }
    $user_data = get_userdata($user_id);
    if(empty($user_id)) {
        return;
    }

    $user_display_name = get_user_option('go_nickname', $user_id);
    if (empty($user_display_name)) {
        $user_display_name = get_user_meta($user_id, 'nickname', true);
        if (empty($user_display_name)) {
            $user_display_name = $user_data->display_name;
        }
    }

    $name = $user_display_name;

    return $name;
}

function go_get_website($user_id = ''){
    if(empty($user_id)){
        $user_id = get_current_user_id();
    }
    $website = get_user_option( 'go_website', $user_id );
    if(empty($website)){
        $current_user = get_userdata($user_id);
        $website = $current_user->user_url;
    }
    return $website;
}
//
function go_get_avatar($user_id = false, $avatar_html = false, $size = 'thumbnail'){
    if(!$user_id){
        $user_id =  get_current_user_id();
    }
    $user_avatar_id = get_user_option( 'go_avatar', $user_id );
    if (wp_attachment_is_image($user_avatar_id)  ) {

        $user_avatar = wp_get_attachment_image($user_avatar_id, $size, false, array( "class" => "avatar avatar-64 photo" ));
    }else{
        if ($avatar_html) {
            $user_avatar = $avatar_html;
        }else{
            $user_avatar = false;
        }
    }
    return $user_avatar;
}

function go_override_avatar ($avatar_html, $id_or_email, $size, $default, $alt) {
    $user = false;
    $avatar = $avatar_html;
    if ( is_numeric( $id_or_email ) ) {

        $id = (int) $id_or_email;
        $user = get_user_by( 'id' , $id );

    } elseif ( is_object( $id_or_email ) ) {

        if ( ! empty( $id_or_email->user_id ) ) {
            $id = (int) $id_or_email->user_id;
            $user = get_user_by( 'id' , $id );
        }

    } else {
        $user = get_user_by( 'email', $id_or_email );
    }

    if ( $user && is_object( $user ) ) {
        $user_id = $user->ID;
        $new_avatar = go_get_avatar($user_id, $avatar_html, array(64, 64));
        if(!empty($new_avatar)){
            $avatar = $new_avatar;
        }

    }


    return $avatar;
}


add_action( 'admin_bar_menu', function(){
    add_filter ('get_avatar', 'go_override_avatar', 1, 5);
},0);

add_action( 'wp_after_admin_bar_render', function(){
    remove_filter ('get_avatar', 'go_override_avatar', 1, 5);
});




function go_acf_labels( $field ) {
    //badges
    //groups
    $text = $field['label'];
    preg_match_all("/\[[^\]]*\]/", $text, $matches);
    $my_matches = $matches[0];
    foreach($my_matches as $match){
        $replace_with = go_acf_replace_text($match);
        if(!empty($replace_with)){
            $field['label'] = str_replace($match, $replace_with, $field['label']);
        }
    }

    $instructions = $field['instructions'];
    preg_match_all("/\[[^\]]*\]/", $instructions, $matches);
    $my_matches = $matches[0];
    foreach($my_matches as $match){
        $replace_with = go_acf_replace_text($match);
        if(!empty($replace_with)){
            $field['instructions'] = str_replace($match, $replace_with, $field['instructions']);
        }
    }

    if(isset($field['choices']['parent'])) {
        $parent_text = $field['choices']['parent'];
        preg_match_all("/\[[^\]]*\]/", $parent_text, $matches);
        $my_matches = $matches[0];
        foreach ($my_matches as $match) {
            $replace_with = go_acf_replace_text($match);
            if (!empty($replace_with)) {
                $field['choices']['parent'] = str_replace($match, $replace_with, $field['choices']['parent']);
            }
        }
    }

    if(isset($field['choices']['child'])){
        $child_text = $field['choices']['child'];
        preg_match_all("/\[[^\]]*\]/", $child_text, $matches);
        $my_matches = $matches[0];
        foreach ($my_matches as $match) {
            $replace_with = go_acf_replace_text($match);
            if (!empty($replace_with)) {
                $field['choices']['child'] = str_replace($match, $replace_with, $field['choices']['child']);
            }
        }
    }



    return $field;

}
add_filter('acf/prepare_field', 'go_acf_labels');

function go_acf_replace_text($match){
    $replace_with = $match;
    if($match === '[Experience]'){
        $replace_with = get_option("options_go_loot_xp_name");
    }
    else if($match === '[XP]'){
        $replace_with = get_option("options_go_loot_xp_abbreviation");
    }
    else if($match === '[Gold]'){
        $replace_with = go_get_gold_name();
    }
    else if($match === '[G]'){
        $replace_with =  go_get_loot_short_name('gold');
    }
    else if($match === '[Reputation]'){
        $replace_with = get_option("options_go_loot_health_name");
    }
    else if($match === '[Rep]'){
        $replace_with = get_option("options_go_loot_health_abbreviation");
    }
    else if($match === '[Badges]'){
        $replace_with = ucwords(get_option('options_go_badges_name_plural'));
    }
    else if($match === '[Badge]'){
        $replace_with = ucwords(get_option('options_go_badges_name_singular'));
    }
    else if($match === '[Group]'){
        $replace_with = ucwords(get_option('options_go_groups_name_singular'));
    }
    else if($match === '[Groups]'){
        $replace_with = ucwords(get_option('options_go_groups_name_plural'));
    }
    else if($match === '[Quest]'){
        $replace_with = ucwords(get_option( 'options_go_tasks_name_singular'  ));
    }
    else if($match === '[Quests]'){
        $replace_with = ucwords(get_option( 'options_go_tasks_name_plural'  ));
    }
    return $replace_with;
}


function go_acf_select_labels( $field ) {
    //badges
    //groups
    $choices = $field['choices'];
    foreach ($choices as $key => $value){
        $text = $value;
        if(is_string($text)) {
            preg_match_all("/\[[^\]]*\]/", $text, $matches);
            $my_matches = $matches[0];

            foreach ($my_matches as $match) {
                if ($match === '[Experience]') {
                    $replace_with = get_option("options_go_loot_xp_name");
                } else if ($match === '[XP]') {
                    $replace_with = get_option("options_go_loot_xp_abbreviation");
                } else if ($match === '[Gold]') {
                    $replace_with = go_get_gold_name();
                } else if ($match === '[G]') {
                    $replace_with = go_get_loot_short_name('gold');
                } else if ($match === '[Reputation]') {
                    $replace_with = get_option("options_go_loot_health_name");
                } else if ($match === '[Rep]') {
                    $replace_with = get_option("options_go_loot_health_abbreviation");
                } else if ($match === '[Badges]') {
                    $replace_with = ucwords(get_option('options_go_badges_name_plural'));
                } else if ($match === '[Badge]') {
                    $replace_with = ucwords(get_option('options_go_badges_name_singular'));
                } else if ($match === '[Group]') {
                    $replace_with = ucwords(get_option('options_go_groups_name_singular'));
                } else if ($match === '[Groups]') {
                    $replace_with = ucwords(get_option('options_go_groups_name_plural'));
                }

                if (!empty($replace_with)) {
                    $text = str_replace($match, $replace_with, $text);
                    $field['choices'][$key] = $text;
                }
            }
        }
    }

    return $field;

}
add_filter('acf/prepare_field/type=select', 'go_acf_select_labels');


add_filter( 'generate_404_text','generate_custom_404_text' );
function generate_custom_404_text()
{
    return '';
}
add_filter( 'get_search_form','go_remove_search_form' );
function go_remove_search_form()
{
    $template = $GLOBALS['template'];
    $template_file = substr($template, strrpos($template, '/') + 1);
    if ($template_file === '404.php') {
        return '';
    }
}

add_action( 'edit_terms', 'go_before_update_terms', 10, 2 );
function go_before_update_terms( $term_id, $taxonomy ) {
    // do something after update

    $term = get_term($term_id, $taxonomy);
    $termParent = $term->parent;
    global $originalTermParent;
    $originalTermParent = $termParent;
    //$newParent = $_POST['parent'];

    /*
    if(empty($termParent)){//if there is no current parent, make it the last parent term in the order
        $order = get_term_meta($term_id, 'go_order', true);
        if(empty($order)){
            $myterms = get_terms( array( 'taxonomy' => $taxonomy, 'parent' => 0, 'hide_empty' => false ) );
            $count = count($myterms);
            update_term_meta($term_id, 'go_order', $count+1);
        }
    }

    else if($termParent != $newParent){
        $children = get_term_children( $newParent, $taxonomy );
        $count = count($children);
        update_term_meta($term_id, 'go_order', $count+1);
    }*/
}

add_action( 'edited_term', 'go_after_update_terms', 10, 3 );
function go_after_update_terms( $term_id, $ttid, $taxonomy ) {
    // do something after update

    $term = get_term($term_id, $taxonomy);
    $newParent = $term->parent;
    global $originalTermParent;

    //$newParent = $_POST['parent'];

    if(empty($newParent)){
        $order = get_term_meta($term_id, 'go_order', true);
        if(empty($order)){
            $myterms = get_terms( array( 'taxonomy' => $taxonomy, 'parent' => 0, 'hide_empty' => false ) );
            $count = count($myterms);
            update_term_meta($term_id, 'go_order', $count+1);
        }
    }
    else if($originalTermParent != $newParent){
        $children = get_term_children( $newParent, $taxonomy );
        $count = count($children);
        update_term_meta($term_id, 'go_order', $count+1);
    }
}

add_action( 'create_term', 'go_last_in_order', 10, 3 );
function go_last_in_order( $term_id, $ttid, $taxonomy ) {
    // do something after update
    $term = get_term($term_id, $taxonomy);
    $termParent = $term->parent;
    if(empty($termParent)){
        $order = get_term_meta($term_id, 'go_order', true);
        if(empty($order)){
            $myterms = get_terms( array( 'taxonomy' => $taxonomy, 'parent' => 0, 'hide_empty' => false ) );
            $count = count($myterms);
            update_term_meta($term_id, 'go_order', $count+1);
        }
    }
    else {
        $children = get_term_children( $termParent, $taxonomy );
        $count = count($children);
        update_term_meta($term_id, 'go_order', $count+1);
    }
}

function go_get_all_admin(){
    $users = get_users( 'role=administrator' );
    $user_ids = array();
    foreach($users as $user){
        $user_ids[] = $user->id;
    }
    return $user_ids;
}

function go_get_gold_name(){
    $gold_name = get_option('options_go_loot_gold_name');
    $coins_currency = get_option("options_go_loot_gold_currency");
    if($coins_currency === 'coins') {
        $gold_name = get_option("options_go_loot_gold_coin_names_gold_coin_name");
    }
    return $gold_name;
}

function go_get_link_from_option($option_name, $admin = false){
    $option = get_option($option_name);
    $option = urlencode((string)$option);
    if($admin){
        $option = "edit_" . lcfirst($option);
    }
    $link = get_site_url(null, $option);
    return $link;
}


/**
 * Can be called as a function or shortcode
 * @param $var //can be an array of atts if shortcode, or just a single variable
 * @param null $message
 * @param false $icon_only
 * @return string
 */
function go_copy_var_to_clipboard($var, $message = null, $icon_only = false){
    if(is_array($var)){
        //$var = $var['content'];
        $var = (isset($var['content']) ?  $var['content'] : null);
        if(empty($var)){
           return;
        }
        $message = (isset($var['message']) ?  $var['message'] : null);
        $icon_only = (isset($var['icon_only']) ?  $var['icon_only'] : false);
    }
    if(empty($message)){
        $message = 'Copy to Clipboard';
    }
    if($icon_only){
        $copy_icon = "  <span onclick='go_copy_to_clipboard(this)' class='tooltip action_icon' data-tippy-content='$message'>
                            <span class='tooltip_click' data-tippy-content='Copied!'>
                                <span  style='background-color: white; display:none;' class='go_copy_this '>$var</span> 
                                <a><i style='' class='far fa-1x fa-link'></i></a>
                            </span>
                    </span>";
    }else {
        $copy_icon = "  <span onclick='go_copy_to_clipboard(this)' class='tooltip' data-tippy-content='$message'>
                            <span class='tooltip_click' data-tippy-content='Copied!'>
                                <span class='go_copy_this action_icon' style='background-color: white;'>$var</span> 
                                <a><i style='' class='far fa-1x fa-link'></i></a>
                            </span>
                    </span>";
    }
    return $copy_icon;
}
add_shortcode ( 'copy_to_clipboard', 'go_copy_var_to_clipboard' );

// Allow for shortcodes in messages
function go_acf_load_field_message($field  ) {
    $type = get_post_type();
    if ($type !== "acf-field-group") {
        //$field['message'] = do_shortcode($field['message']);
        $field['message'] = apply_filters( 'go_awesome_text', $field['message'] );
        $field['message'] = urldecode($field['message']);

    }
    return $field;
}

add_filter('acf/load_field/type=message', 'go_acf_load_field_message', 10, 3);


function go_customize_register( $wp_customize ) {
    /**
     * Add our Header & Navigation Panel
     */
    $heading = '#c3eafb';
    $available = '#fff7aa';
    $done = '#cee3ac';
    $locked = '#cccccc';
    $up = '#90EE90';
    $down = '#ffc0cb';
    $background = '#ffffff';
    $font = '#000000';

    $palette = array( // Optional. Select the colours for the colour palette . Default: WP color control palette
        $heading,
        $available,
        $done,
        $locked,
        $background,
        $font,
        '#7ed934',
        '#1571c1'
    );

        $wp_customize->add_panel( 'go_panel',
            array(
                'title' => __( 'Gameful Display' ),
                'description' => esc_html__( 'Adjust the Player Bar and Map display settings.' ), // Include html tags such as
                'priority' => 10, // Not typically needed. Default is 160
                'capability' => 'edit_theme_options', // Not typically needed. Default is edit_theme_options
                'theme_supports' => '', // Rarely needed
                'active_callback' => '', // Rarely needed
            )
        );

    $wp_customize->add_section( 'go_map_controls_section',
        array(
            'title' => __( 'Game Colors and Fonts' ),
            'description' => esc_html__( 'Customize the Map & Store.' ),
            'panel' => 'go_panel',
            'priority' => 10, // Not typically needed. Default is 160
            'capability' => 'edit_theme_options', // Not typically needed. Default is edit_theme_options

        )
    );


    $google_fonts_default = json_encode(
        array(
            'font' => 'Muli',
            'regularweight' => 'regular',
            'italicweight' => 'italic',
            'boldweight' => '700',
            'category' => 'sans-serif'
        )
    );
    // Test of Google Font Select Control
    $wp_customize->add_setting( 'go_map_google_font_select',
        array(
            'default' => $google_fonts_default,
            //'transport' => 'postMessage',
            //'sanitize_callback' => 'skyrocket_google_font_sanitization',
            'type' => 'option',
        )
    );
    $wp_customize->add_control( new Skyrocket_Google_Font_Select_Custom_Control( $wp_customize, 'go_map_google_font_select',
        array(
            'label' => __( 'Font', 'go' ),
            'description' => esc_html__( 'All Google Fonts sorted alphabetically. The default value is Muli.', 'skyrocket' ),
            'section' => 'go_map_controls_section',
            'settings' => 'go_map_google_font_select',
            'input_attrs' => array(
                'font_count' => 'all',
                'orderby' => 'alpha',
            ),
        )
    ) );

    // Test of Slider Custom Control
    $wp_customize->add_setting( 'go_map_font_size_control',
        array(
            'default' => '15',
            'transport' => 'postMessage',
            'type' => 'option',
            //'sanitize_callback' => 'absint'
        )
    );
    $wp_customize->add_control( new Skyrocket_Slider_Custom_Control( $wp_customize, 'go_map_font_size_control',
        array(
            'label' => __( 'Font Size (px)', 'go' ),
            'section' => 'go_map_controls_section',
            'settings' => 'go_map_font_size_control',
            'input_attrs' => array(
                'min' => 8,
                'max' => 24,
                'step' => 1,
            ),
        )
    ) );


    $wp_customize->add_control( 'go_reset_map', array(
        'type' => 'button',
        'settings' => array(), // 👈
        'priority' => 10,
        'section' => 'go_map_controls_section',
        'input_attrs' => array(
            'value' => __( 'Reset Map Colors', 'textdomain' ), // 👈
            'class' => 'button button-primary', // 👈
        ),
    ) );

    $wp_customize->add_setting( 'go_map_bkg_color',
        array(
            'default' => $background,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_map_bkg_color',
        array(
            'label' => __( 'Main Background Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );

    $wp_customize->add_setting( 'go_map_font_color',
        array(
            'default' => $font,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_map_font_color',
        array(
            'label' => __( 'Main Font Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );


    $wp_customize->add_setting( 'go_map_chain_color',
        array(
            'default' => $heading,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_map_chain_color',
        array(
            'label' => __( 'Column Heading Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );

    $wp_customize->add_setting( 'go_map_chain_font_color',
        array(
            'default' => $font,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_map_chain_font_color',
        array(
            'label' => __( 'Column Heading Font Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );

    $wp_customize->add_setting( 'go_map_available_color',
        array(
            'default' => $available,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_map_available_color',
        array(
            'label' => __( 'Available Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );

    $wp_customize->add_setting( 'go_map_available_font_color',
        array(
            'default' => $font,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_map_available_font_color',
        array(
            'label' => __( 'Available Font Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );

    $wp_customize->add_setting( 'go_map_done_color',
        array(
            'default' => $done,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_map_done_color',
        array(
            'label' => __( 'Done Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );

    $wp_customize->add_setting( 'go_map_done_font_color',
        array(
            'default' => $font,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_map_done_font_color',
        array(
            'label' => __( 'Done Font Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );

    $wp_customize->add_setting( 'go_map_locked_color',
        array(
            'default' => $locked,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_map_locked_color',
        array(
            'label' => __( 'Locked Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );


    $wp_customize->add_setting( 'go_map_locked_font_color',
        array(
            'default' => $font,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_map_locked_font_color',
        array(
            'label' => __( 'Locked Font Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );


    $wp_customize->add_setting( 'go_store_up_color',
        array(
            'default' => $up,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_store_up_color',
        array(
            'label' => __( 'Reward Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );


    $wp_customize->add_setting( 'go_store_up_font_color',
        array(
            'default' => $font,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_store_up_font_color',
        array(
            'label' => __( 'Reward Font Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );

    $wp_customize->add_setting( 'go_store_down_color',
        array(
            'default' => $down,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_store_down_color',
        array(
            'label' => __( 'Cost Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );


    $wp_customize->add_setting( 'go_store_down_font_color',
        array(
            'default' => $font,
            'transport' => 'postMessage',
            'type' => 'option'
        )
    );
    $wp_customize->add_control( new Skyrocket_Customize_Alpha_Color_Control( $wp_customize, 'go_store_down_font_color',
        array(
            'label' => __( 'Cost Font Color', 'go' ),
            //'description' => esc_html__( 'Sample custom control description' ),
            'section' => 'go_map_controls_section',
            'show_opacity' => false, // Optional. Show or hide the opacity value on the opacity slider handle. Default: true
            'palette' => $palette,
        )
    ) );




    //PLAYERBAR SECTION

    $wp_customize->add_section( 'go_playerbar',
        array(
            'title' => __( 'PlayerBar Colors' ),
            'description' => esc_html__( 'Customize the PlayerBar' ),
            'panel' => 'go_panel',
            'priority' => 160, // Not typically needed. Default is 160
            'capability' => 'edit_theme_options', // Not typically needed. Default is edit_theme_options

        )
    );

    // Another Test of WPColorPicker Alpha Color Picker Control
    $wp_customize->add_setting( 'go_playerbar_bkg_wpcolorpicker',
        array(
            'default' => "#268FBB",
            'transport' => 'refresh',
            'type' => 'option',
            //'sanitize_callback' => 'skyrocket_hex_rgba_sanitization'
        )
    );
    $wp_customize->add_control( 'go_playerbar_bkg_wpcolorpicker',
        array(
            'label' => __( 'Background Color', 'go' ),
            'description' => esc_html__( 'Change the PlayerBar Background Color', 'go' ),
            'section' => 'go_playerbar',
            'type' => 'color',
        )
    ) ;

    // Another Test of WPColorPicker Alpha Color Picker Control
    $wp_customize->add_setting( 'go_playerbar_link_wpcolorpicker',
        array(
            'default' => "#FFFFFF",
            'transport' => 'refresh',
            'type' => 'option',
            //'sanitize_callback' => 'skyrocket_hex_rgba_sanitization'
        )
    );
    $wp_customize->add_control( 'go_playerbar_link_wpcolorpicker',
        array(
            'label' => __( 'Link Color', 'go' ),
            'description' => esc_html__( 'Change the PlayerBar Link Color', 'go' ),
            'section' => 'go_playerbar',
            'type' => 'color',
        )
    ) ;

    // Another Test of WPColorPicker Alpha Color Picker Control
    $wp_customize->add_setting( 'go_playerbar_hover_wpcolorpicker',
        array(
            'default' => "#FFFFFF",
            'transport' => 'refresh',
            'type' => 'option',
            //'sanitize_callback' => 'skyrocket_hex_rgba_sanitization'
        )
    );
    $wp_customize->add_control( 'go_playerbar_hover_wpcolorpicker',
        array(
            'label' => __( 'Link Hover Color', 'go' ),
            'description' => esc_html__( 'Change the PlayerBar Link Hover Color', 'go' ),
            'section' => 'go_playerbar',
            'type' => 'color',
        )
    ) ;

    // Another Test of WPColorPicker Alpha Color Picker Control
    $wp_customize->add_setting( 'go_playerbar_dropdown_wpcolorpicker',
        array(
            'default' => "#268FBB",
            'transport' => 'refresh',
            'type' => 'option',
            //'sanitize_callback' => 'skyrocket_hex_rgba_sanitization'
        )
    );
    $wp_customize->add_control( 'go_playerbar_dropdown_wpcolorpicker',
        array(
            'label' => __( 'Dropdown Color', 'go' ),
            'description' => esc_html__( 'Change the PlayerBar DropDown Menu Color', 'go' ),
            'section' => 'go_playerbar',
            'type' => 'color',
        )
    ) ;
//***VIDEO SECTION***//
    $wp_customize->add_section( 'go_video_display',
        array(
            'title' => __( 'Videos' ),
            'description' => esc_html__( 'Customize Video Display' ),
            'panel' => 'go_panel',
            'priority' => 160, // Not typically needed. Default is 160
            'capability' => 'edit_theme_options', // Not typically needed. Default is edit_theme_options

        )
    );
    $wp_customize->add_setting( 'go_video_width_type_control',
        array(
            'default' => 'px',
            'transport' => 'refresh',
            'type' => 'option',
            //'sanitize_callback' => 'absint'
        )
    );
    $wp_customize->add_control( 'go_video_width_type_control',
        array(
            'label' => __( 'Video Width', 'go' ),
            'section' => 'go_video_display',
            'settings' => 'go_video_width_type_control',
            'type' => 'radio',
            'capability' => 'edit_theme_options', // Optional. Default: 'edit_theme_options'
            'choices' => array( // Optional.
                'px' => 'Pixels (px)',
                '%' => 'Percent (%)',

            )
        )
    );
    $wp_customize->add_setting( 'go_video_width_px_control',
        array(
            'default' => '400',
            'transport' => 'refresh',
            'type' => 'option',
            //'sanitize_callback' => 'absint'
        )
    );
    $wp_customize->add_control( new Skyrocket_Slider_Custom_Control( $wp_customize, 'go_video_width_px_control',
        array(
            'label' => __( 'Video Width (px)', 'go' ),
            'section' => 'go_video_display',
            'settings' => 'go_video_width_px_control',
            'input_attrs' => array(
                'min' => 200,
                'max' => 1000,
                'step' => 10,
            ),
        )
    ) );

    $wp_customize->add_setting( 'go_video_width_percent_control',
        array(
            'default' => '100',
            'transport' => 'refresh',
            'type' => 'option',
            //'sanitize_callback' => 'absint'
        )
    );
    $wp_customize->add_control( new Skyrocket_Slider_Custom_Control( $wp_customize, 'go_video_width_percent_control',
        array(
            'label' => __( 'Video Width (%)', 'go' ),
            'section' => 'go_video_display',
            'settings' => 'go_video_width_percent_control',
            'input_attrs' => array(
                'min' => 10,
                'max' => 100,
                'step' => 5,
            ),
        )
    ) );

    $wp_customize->add_setting( 'go_video_lightbox_toggle_switch',
        array(
            'default' => 1,
            'transport' => 'refresh',
            'type' => 'option',
            //'sanitize_callback' => 'skyrocket_switch_sanitization'
        )
    );
    $wp_customize->add_control( new Skyrocket_Toggle_Switch_Custom_control( $wp_customize, 'go_video_lightbox_toggle_switch',
        array(
            'label' => __( 'Use Lightbox for Video', 'go' ),
            'section' => 'go_video_display',
            'settings' => 'go_video_lightbox_toggle_switch',
        )
    ) );

    //SOUND SECTION

    $wp_customize->add_section( 'go_sounds',
        array(
            'title' => __( 'Game Sounds' ),
            'description' => esc_html__( 'Customize the Action Sounds' ),
            'panel' => 'go_panel',
            'priority' => 160, // Not typically needed. Default is 160
            'capability' => 'edit_theme_options', // Not typically needed. Default is edit_theme_options

        )
    );

    // Test of Dropdown Select2 Control (single select)
    $wp_customize->add_setting( 'go_sound_up',
        array(
            'default' => '1',
            'transport' => 'postMessage',
            'type' => 'option',
            'sanitize_callback' => 'skyrocket_text_sanitization'
        )
    );
    $wp_customize->add_control( new Skyrocket_Dropdown_Select2_Custom_Control( $wp_customize, 'up_sound_selector',
        array(
            'label' => __( 'Select Reward Sound', 'skyrocket' ),
            //'description' => esc_html__( 'Sample Dropdown Select2 custom control (Single Select)', 'skyrocket' ),
            'section' => 'go_sounds',
            'settings' => 'go_sound_up',
            'input_attrs' => array(
                'placeholder' => __( 'Please select a sound...', 'skyrocket' ),
                'multiselect' => false,
            ),
            'choices' => array(
                'coins.mp3' => __( 'Coins', 'skyrocket' ),
                'chime.m4a' => __( 'Chime', 'skyrocket' ),
                'jingle.mp3' => __( 'Jingle', 'skyrocket' ),
                'notification.mp3' => __( 'Notification', 'skyrocket' ),
                'ping.m4a' => __( 'Ping', 'skyrocket' ),
                'Tones.m4a' => __( 'Tones', 'skyrocket' ),
            )
        )
    ) );

    // Test of Dropdown Select2 Control (single select)
    $wp_customize->add_setting( 'go_sound_down',
        array(
            'default' => '1',
            'transport' => 'postMessage',
            'type' => 'option',
            'sanitize_callback' => 'skyrocket_text_sanitization'
        )
    );
    $wp_customize->add_control( new Skyrocket_Dropdown_Select2_Custom_Control( $wp_customize, 'down_sound_selector',
        array(
            'label' => __( 'Select Penalty Sound', 'skyrocket' ),
            //'description' => esc_html__( 'Sample Dropdown Select2 custom control (Single Select)', 'skyrocket' ),
            'section' => 'go_sounds',
            'settings' => 'go_sound_down',
            'input_attrs' => array(
                'placeholder' => __( 'Please select a sound...', 'skyrocket' ),
                'multiselect' => false,
            ),
            'choices' => array(
                'down.mp3' => __( 'Down', 'skyrocket' ),
                'down2.m4a' => __( 'Down 2', 'skyrocket' ),
                'down3.m4a' => __( 'Down 3', 'skyrocket' ),
                'down4.m4a' => __( 'Down 4', 'skyrocket' ),
                'down5.m4a' => __( 'Down 5', 'skyrocket' ),
                'down6.m4a' => __( 'Down 6', 'skyrocket' ),
            )
        )
    ) );

    // Test of Dropdown Select2 Control (single select)
    $wp_customize->add_setting( 'go_sound_level_up',
        array(
            'default' => '1',
            'transport' => 'postMessage',
            'type' => 'option',
            'sanitize_callback' => 'skyrocket_text_sanitization'
        )
    );
    $wp_customize->add_control( new Skyrocket_Dropdown_Select2_Custom_Control( $wp_customize, 'level_down_sound_selector',
        array(
            'label' => __( 'Select Level Up Sound', 'skyrocket' ),
            //'description' => esc_html__( 'Sample Dropdown Select2 custom control (Single Select)', 'skyrocket' ),
            'section' => 'go_sounds',
            'settings' => 'go_sound_level_up',
            'input_attrs' => array(
                'placeholder' => __( 'Please select a sound...', 'skyrocket' ),
                'multiselect' => false,
            ),
            'choices' => array(
                'applause.m4a' => __( 'Applause', 'skyrocket' ),
                'calm_up.m4a' => __( 'Calm Up', 'skyrocket' ),
                'chime.m4a' => __( 'Chime', 'skyrocket' ),
                'jingle.mp3' => __( 'Jingle', 'skyrocket' ),
                'level_up_voice_1.m4a' => __( 'Level Up Voice 1', 'skyrocket' ),
                'level_up_voice_2.m4a' => __( 'Level Up Voice 2', 'skyrocket' ),
                'milestone2.mp3' => __( 'Trumpets', 'skyrocket' ),
                'notification.mp3' => __( 'Notification', 'skyrocket' ),
                'ping.m4a' => __( 'Ping', 'skyrocket' ),
                'Tones.m4a' => __( 'Tones', 'skyrocket' ),
                'power_up.mp3' => __( 'Power Up', 'skyrocket' )
            )
        )
    ) );

    // Test of Dropdown Select2 Control (single select)
    $wp_customize->add_setting( 'go_sound_level_down',
        array(
            'default' => '1',
            'transport' => 'postMessage',
            'type' => 'option',
            'sanitize_callback' => 'skyrocket_text_sanitization'
        )
    );
    $wp_customize->add_control( new Skyrocket_Dropdown_Select2_Custom_Control( $wp_customize, 'level_up_sound_selector',
        array(
            'label' => __( 'Select Level Down Sound', 'skyrocket' ),
            //'description' => esc_html__( 'Sample Dropdown Select2 custom control (Single Select)', 'skyrocket' ),
            'section' => 'go_sounds',
            'settings' => 'go_sound_level_down',
            'input_attrs' => array(
                'placeholder' => __( 'Please select a sound...', 'skyrocket' ),
                'multiselect' => false,
            ),
            'choices' => array(
                'down.mp3' => __( 'Down', 'skyrocket' ),
                'down2.m4a' => __( 'Down 2', 'skyrocket' ),
                'down3.m4a' => __( 'Down 3', 'skyrocket' ),
                'down4.m4a' => __( 'Down 4', 'skyrocket' ),
                'down5.m4a' => __( 'Down 5', 'skyrocket' ),
                'down6.m4a' => __( 'Down 6', 'skyrocket' ),
            )
        )
    ) );


}
add_action( 'customize_register', 'go_customize_register', 11 );


function add_custom_css() {
    wp_enqueue_style('custom-css', get_template_directory_uri() . '/custom.css');
    // Add dynamic style if a single page is displayed
    if ( !is_admin() ) {
        $xp_toggle = get_option('options_go_loot_xp_toggle');
        $health_toggle = get_option('options_go_loot_health_toggle');
        $height = 91;
        if(!$xp_toggle){
            $height = $height -16;
        }
        if(!$health_toggle){
            $height = $height -16;
        }
        $color = "#000111";
        $custom_css = "body{ height: {$height}px; }";
        wp_add_inline_style( 'custom-css', $custom_css );

        wp_localize_script(
            'go_frontend',
            'GO_STYLES',
            array(

                    'playerbar_height'          => $height,
            )
        );


    }
}
add_action( 'wp_enqueue_scripts', 'add_custom_css', 99 );


add_action( 'wp_head', 'go_user_bar_dynamic_styles', 99 );
add_action( 'admin_head', 'go_user_bar_dynamic_styles', 99 );
function go_user_bar_dynamic_styles() {

    $bkg_color = get_option('go_playerbar_bkg_wpcolorpicker');
    if(!$bkg_color) {
        $bkg_color = get_option('options_go_user_bar_background_color');//Old Option
    }
    if(!$bkg_color) {
        $bkg_color = "#268FBB";
    }

    $link_color = get_option('go_playerbar_link_wpcolorpicker');
    if(!$link_color) {
        $link_color = get_option('options_go_user_bar_link_color');//Old Option
    }
    if(!$link_color) {
        $link_color = "#FFFFFF";
    }

    $hover_color = get_option('go_playerbar_hover_wpcolorpicker');
    if(!$hover_color) {
        $hover_color = get_option('options_go_user_bar_hover_color');//Old Option
    }
    if(!$hover_color) {
        $hover_color = "#FFFFFF";
    }

    $drop_bkg_color = get_option('go_playerbar_dropdown_wpcolorpicker');
    if(!$drop_bkg_color) {
        $drop_bkg_color = get_option('options_go_user_bar_dropdown_bkg');//Old Option
    }
    if(!$drop_bkg_color) {
        $drop_bkg_color = "#268FBB";
    }

    $map_bkg = get_option('go_map_bkg_color');
    $map_bkg  = ($map_bkg ?  $map_bkg : "#ffffff");

    $map_font_color = get_option('go_map_font_color');
    $map_font_color  = ($map_font_color ?  $map_font_color : "#000000");

    $map_available = get_option('go_map_available_color');
    $map_available  = ($map_available ?  $map_available : "#fff7aa");

    $map_available_font_color = get_option('go_map_available_font_color');
    $map_available_font_color  = ($map_available_font_color ?  $map_available_font_color : "#000000");

    $map_done = get_option('go_map_done_color');
    $map_done  = ($map_done ?  $map_done : "#cee3ac");

    $map_done_font_color = get_option('go_map_done_font_color');
    $map_done_font_color  = ($map_done_font_color ?  $map_done_font_color : "#000000");

    $map_locked = get_option('go_map_locked_color');
    $map_locked  = ($map_locked ?  $map_locked : "#cccccc");

    $map_locked_font_color = get_option('go_map_locked_font_color');
    $map_locked_font_color  = ($map_locked_font_color ?  $map_locked_font_color : "#000000");

    $map_up = get_option('go_store_up_color');
    $map_up  = ($map_up ?  $map_up : "#90EE90");

    $map_up_font_color = get_option('go_store_up_font_color');
    $map_up_font_color  = ($map_up_font_color ?  $map_up_font_color : "#000000");

    $map_down = get_option('go_store_down_color');
    $map_down  = ($map_down ?  $map_down : "#ffc0cb");

    $map_down_font_color = get_option('go_store_down_font_color');
    $map_down_font_color  = ($map_down_font_color ?  $map_down_font_color : "#000000");


//
    $chain_box = get_option('go_map_chain_color');
    $chain_box  = ($chain_box ?  $chain_box : "#c3eafb");

    $go_map_chain_font_color = get_option('go_map_chain_font_color');
    $go_map_chain_font_color  = ($go_map_chain_font_color ?  $go_map_chain_font_color : "#000000");

    $font = get_option('go_map_google_font_select');
    if(!$font){
        $font = '{"font":"Muli","category":"sans-serif"}';
    }
    $font = json_decode($font);
    $myfont = $font->font;
    // $font_weight = $font->regularweight;
    // $font_boldweight = $font->boldweight;
    $font_category = $font->category;


    $get_font = $myfont;

    wp_enqueue_style( 'acft-gf', 'https://fonts.googleapis.com/css?family='.$get_font );


    $font_size = get_option('go_map_font_size_control');
    if(!$font_size){
        $font_size = 17;
    }
    $font_family = $myfont . "," . $font_category;

//
    ?>
    <style type="text/css" media="screen">
        #go_user_bar_top { background-color:<?php echo $bkg_color; ?> !important; color:<?php echo $link_color; ?>; }
        #go_user_bar a:link { color:<?php echo $link_color; ?>; text-decoration: none; }
        #go_user_bar a:visited { color:<?php echo $link_color; ?>; text-decoration: none; }
        #go_user_bar a:hover { color:<?php echo $hover_color; ?>; text-decoration: none; }
        #go_user_bar a:active { color:<?php echo $hover_color; ?>; text-decoration: underline; }
        .progress-bar-border { border-color:<?php echo $link_color; ?>; }
        #go_user_bar .userbar_dropdown-content {background-color: <?php echo $drop_bkg_color; ?>;  color:<?php echo $link_color; ?>; }




        .noty_theme__sunset.noty_type__success{
            background-color: <?php echo $map_done ; ?> !important;
            color: <?php echo $map_done_font_color; ?>  !important;
        }



        .noty_theme__sunset.noty_type__error{
            background-color: <?php echo $map_locked ; ?> !important;
            color: <?php echo $map_locked_font_color; ?>  !important;
        }

        .noty_theme__sunset.noty_type__warning{
            background-color: <?php echo $map_available ; ?> !important;
            color: <?php echo $map_available_font_color; ?>  !important;
        }

        .noty_theme__sunset.noty_type__info{
            background-color: <?php echo $chain_box ; ?> !important;
            color: <?php echo $go_map_chain_font_color; ?>  !important;
        }


        #maps .done, .go_checks_and_buttons {
            background-color: <?php echo $map_done; ?>;
            color: <?php echo $map_done_font_color; ?>; }

        #maps .locked, .go_locks, .go_lock, .go_late_mods, .go_sched_access_message, .go_timer_message {
            background-color: <?php echo $map_locked; ?>;
            color: <?php echo $map_locked_font_color; ?>; }

        #maps .go_store_loot_list_cost,
        .go_store_lightbox_container .go_cost,
        .loot-box.down,
        #gp_store_minus{
            background-color: <?php echo $map_down; ?>;
            color: <?php echo $map_down_font_color; ?>;
            border-color: <?php echo $map_down_font_color; ?>;}

        #maps .go_store_loot_list_reward,
        .go_store_lightbox_container .go_reward,
        .loot-box.up,
        #gp_store_plus
        {
            background-color: <?php echo $map_up; ?>;
            color: <?php echo $map_up_font_color; ?>;
            border-color: <?php echo $map_up_font_color; ?>;}

        #maps .available,
        .dropdown,
        .go_store_actions,
        .go_checks_and_buttons.active,
        #maps .mapLink{
            background-color: <?php echo $map_available; ?>;
            color: <?php echo $map_available_font_color; ?>;
        }

        #maps .down,
        #maps .reset,
        #maps .resetted{
            border-color:<?php echo $map_down; ?>;
        }

        #maps .up{
            border-color:<?php echo $map_up; ?>;
        }


        .go_checks_and_buttons a,
        .go_checks_and_buttons a:hover,
        .go_checks_and_buttons a:visited,
        .go_checks_and_buttons a:focus{
            color: <?php echo $map_bkg; ?>;
            mix-blend-mode: difference;
        }

        #go_map_container,
        .featherlight.store .featherlight-content,
        .go_checks_and_buttons .go_buttons{
            background-color: <?php echo $map_bkg; ?>;
            color: <?php echo $map_font_color; ?>;
            font-family: <?php echo $font_family; ?>;
            font-style: normal;
            font-size:<?php echo $font_size; ?>px;
        }


        <?php
        $map_bkg = get_option('go_map_bkg_color');
        if($map_bkg){
                ?>


            .go_checks_and_buttons .go_buttons{
                border: 1px solid;
            }<?php
        }
        ?>

        #maps .go_task_chain_map_box{
            background-color: <?php echo $chain_box; ?>;
            color: <?php echo $go_map_chain_font_color; ?>;
        }



    </style>
    <?php

}


/*
function go_show_hidden($user_id =null){
    if(empty($user_id)){
        $user_id = get_current_user_id();
    }
$is_admin = go_user_is_admin();
$show_hidden = false;
if($is_admin){
    $admin_view = get_user_option('go_admin_view', $user_id);
    if($admin_view === 'player'){
        $show_hidden = true;
    }
}
return $show_hidden;
}//
*/

//add_filter( 'option_generate_settings','lh_single_posts_settings' );
function lh_single_posts_settings( $options ) {
    $options['generate_package_typography'] = 'deactivated';
        $options['generate_package_spacing'] = 'deactivated';
        $options['generate_package_site_library'] = 'deactivated';
    $options['generate_package_sections'] = 'deactivated';
    $options['generate_package_secondary_nav'] = 'deactivated';
    $options['generate_package_menu_plus'] = 'deactivated';
    $options['generate_package_elements'] = 'deactivated';
    $options['generate_package_disable_elements'] = 'deactivated';
    $options['generate_package_copyright'] = 'deactivated';
    $options['generate_package_colors'] = 'deactivated';
    $options['generate_package_blog'] = 'deactivated';
    $options['generate_package_backgrounds'] = 'deactivated';
    return $options;
}

function go_leaderboard_filters($type = 'reader', $user_id = null) {

    $is_admin = go_user_is_admin();

    $initial =  (isset($_GET['is_initial_single_stage']) ?  $_GET['is_initial_single_stage'] : false);
    if($initial && !$is_admin){
        $type = 'single_quest';
    }

    $show_date_filters = true;
    $show_store_item_filter = true;

    $user_id_data = '';
    if ($type === 'reader'){
        $filter_on_change = false;
        $show_action_filters = true;
        $show_user_filters = true;
        $status_filter = true;
        $order_filter = true;
    }
    else if ($type === 'leaderboard'){
        $filter_on_change = true;
        $show_action_filters = false;
        $show_user_filters = true;
        $status_filter = false;
        $order_filter = false;
    }
    else if ($type === 'clipboard'){
        $filter_on_change = false;
        $show_action_filters = true;
        $show_user_filters = true;
        $status_filter = false;
        $order_filter = false;
    }
    else if ($type === 'single_quest'){
        $filter_on_change = false;
        $show_action_filters = false;
        $show_user_filters = true;
        $status_filter = false;
        $order_filter = false;
    }
    else if ($type === 'single_store_item'){
        $filter_on_change = false;
        $show_action_filters = true;
        $show_date_filters = true;
        $show_store_item_filter = false;
        $show_user_filters = true;
        $status_filter = false;
        $order_filter = false;
    }
    else if ($type === 'blog'){
        $filter_on_change = true;
        if($is_admin) {
            $show_action_filters = true;
            $order_filter = true;
        }else{
            $show_action_filters = false;
            $order_filter = true;
        }
        $show_user_filters = false;
        $status_filter = true;
    }
    else {//if($type === 'quest_stage')
        $filter_on_change = true;
        $show_action_filters = false;
        $show_user_filters = true;
        $status_filter = false;
        $order_filter = true;
    }



    //acf_form_head();

    $task_name = get_option( 'options_go_tasks_name_plural'  );

    $post_id = (isset($_REQUEST['post_id']) ? $_REQUEST['post_id'] : '');
    $stage = (isset($_REQUEST['stage']) ? $_REQUEST['stage'] : false);
    $is_single_stage = (isset($_REQUEST['is_single_stage']) ? $_REQUEST['is_single_stage'] : false);
    $is_initial_single_stage = (isset($_REQUEST['is_initial_single_stage']) ? $_REQUEST['is_initial_single_stage'] : false);
    if($is_initial_single_stage === 'true'){
        $is_single_stage = true;
    }


    if($post_id){
        $tasks = "data-tasks='{$post_id}'";
        $task_option = "<option value='$post_id' selected>$post_id</option>";
    }else{
        $tasks = '';
        $task_option = '';
    }

    $store_option = '';
    if($type === 'single_store_item'){
        if($post_id){
            $store_option = "<option value='$post_id' selected>$post_id</option>";
        }
    }

    if($stage){
        $stage = "data-stage='{$stage}'";
    }

   /* if(is_numeric($post_id)){
        $post_id = "data-post_id='{$post_id}'";
    }*/

    if($filter_on_change){
        $filter_on_change_data = "data-filter_on_change='true'";
    }else{
        $filter_on_change_data = "data-filter_on_change='false'";
    }

    if(is_numeric($user_id)){
        $user_id_data = "data-user_id='{$user_id}'";
    }

    ?>
<div id="go_leaderboard_filters" style="flex-wrap: wrap;" data-type="<?php echo $type; ?>"  <?php echo " " . $filter_on_change_data . " "  . $stage . " "  . $user_id_data . " "  . $tasks; ?>>
    <?php
    echo "<h3>Filters</h3>";
    if($show_user_filters) {
        ?>
        <div id="go_user_filters" class="filter_row">
            <div class="user_filter filter sections_filter"><div
                        class="label">Section </div><?php go_make_tax_select('user_go_sections', 'reader', false, false, true); ?>
            </div>
            <div class="user_filter filter"><div
                        class="label">Group </div><?php go_make_tax_select('user_go_groups', 'reader', false, false, true); ?>
            </div>
            <div class="user_filter filter"><div
                        class="label">Badge </div><?php go_make_tax_select('go_badges', 'reader', false, false, true); ?>
            </div>
        </div>
        <?php
    }

    if($show_action_filters === false) {
        $display_action = 'display:none;';
    }else{
        $display_action = 'display:flex;';
    }
    $display_action = 'display:none;';
        ?>
        <div id="go_action_filters" class="filter_row" style="<?php echo $display_action; ?>">
            <?php

            ?>
            <div class="filter"  style=" <?php //echo $display_date; ?> ">
                <div class="label">Date Range</div>
                <div id="go_datepicker_container"
                >

                    <div id="go_datepicker_clipboard">
                        <i class="fa fa-calendar" style="float: left; line-height: 1.5em;"></i>&nbsp;
                        <span id="go_datepicker"></span> <i id="go_reset_datepicker" class=""
                                                            select2-selection__clear><b> × </b></i><i
                                class="fa fa-caret-down"></i>
                    </div>
                </div>
            </div>


            <div id="go_task_filters" class="filter"><div
                        class="label"><?php echo $task_name; ?></div>
                <select
                        id="go_task_select" class="js-store_data"
                        style="width:250px;" ><?php echo $task_option; ?></select>
            </div>

            <div id="go_store_filters" class="filter" style="<?php //echo $display_store; ?>">
                <div class="label">Store Items</div>
                <select id="go_store_item_select" class="js-store_data" style="width:250px;"><?php echo $store_option; ?></select></div>

            <?php
            /*
            ?>
            <div id="go_show_unmatched" >
                <div class="label">Show Unmatched Users </div>
                <input id="go_unmatched_toggle" type="checkbox" class="checkbox" name="unmatched" >
                <span class="tooltip" data-tippy-content="Show a minimum of one row per user. This is useful to see who has not done something, in addition to those who have.">
                    <span><i class="fa fa-info-circle"></i></span>
                </span>
            </div>*/
            ?>

        </div>
            <?php
        //END OF ACTION FILTERS




        if($status_filter){
            ?>
            <div class="filter_row status_row">
            <div class="status_filters filter">
                <?php
                if($is_admin){
                    $action = (isset($_GET['action']) ? $_GET['action'] : false);
                    if($action === 'go_filter_reader'){
                        $unread = 'checked';
                        $read = 'checked';
                    }else if($type === 'reader'){
                        $unread = 'checked';
                        $read = '';
                    }else if($type === 'blog'){
                        $unread = 'checked';
                        $read = 'checked';
                    }else{
                        $read = 'checked';
                        $unread = '';
                    }

                    ?>
                    <input type="checkbox" id="go_reader_unread" class="go_reader_input" value="unread"
                           <?php echo $unread;?>><label for="go_reader_unread">Unread </label>
                    <input type="checkbox" id="go_reader_read" class="go_reader_input" value="read" <?php echo $read;?>><label
                            for="go_reader_read">Read </label>
                    <?php
                }
                else {
                    ?>
                    <input type="checkbox" id="go_reader_published" class="go_reader_input" value="go_reader_published"
                           checked><label for="go_reader_go_reader_published">Published </label>
                    <?php
                }
                    ?>

                <input type="checkbox" id="go_reader_reset" class="go_reader_input" value="reset"><label
                        for="go_reader_reset">Reset </label>
                <input type="checkbox" id="go_reader_trash" class="go_reader_input" value="trash"><label
                        for="go_reader_trash">Trash </label>
                <input type="checkbox" id="go_reader_draft" class="go_reader_input" value="draft"><label
                        for="go_reader_draft">Draft </label>
            </div>


<?php
if($order_filter){

    $oldest = '';
    $newest = '';
    $action = (isset($_GET['action']) ? $_GET['action'] : false);
    if($action === 'go_filter_reader'){
        $oldest = 'checked';
    }else if($type === 'reader'){
        $oldest = 'checked';
    }else if($type === 'blog'){
        $newest = 'checked';
    }else{
        $oldest = 'checked';
    }
    ?>
    <div class="order_filter filter">
        <input type="radio" id="go_reader_order_oldest" class="go_reader_input" name="go_reader_order"
               value="ASC" <?php echo $oldest; ?>><label for="go_reader_order_oldest"> Oldest First</label>
        <input type="radio" id="go_reader_order_newest" class="go_reader_input" name="go_reader_order"
               value="DESC" <?php echo $newest; ?>><label for="go_reader_order_newest"> Newest First</label>
        <span class="tooltip"
              data-tippy-content="Posts are sorted by the last modified time."><span><i
                        class="fa fa-info-circle"></i></span> </span>
    </div>
    <?php

}
?>

            </div>
            <?php
        }


    if(!$filter_on_change) {
        ?>
        <div style="width: 100%;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;">
        <?php
        if($order_filter){

            $oldest = '';
            $newest = '';
            $action = (isset($_GET['action']) ? $_GET['action'] : false);
            if($action === 'go_filter_reader'){
                $oldest = 'checked';
            }else if($type === 'reader'){
                $oldest = 'checked';
            }else if($type === 'blog'){
                $newest = 'checked';
            }else{
                $oldest = 'checked';
            }

        }
        ?>
        <div id="go_leaderboard_update_button"
             style="padding:20px; display: flex;">
            <div style="margin-right: 30px; float:left;">
                <button class="go_reset_filters dt-button ui-button ui-state-default ui-button-text-only buttons-collection">
                        <span class="ui-button-text">Clear Filters <i class="fa fa-undo"
                                                                      aria-hidden="true"></i></span>
                </button>
            </div>
            <div style="">
                <button class="go_apply_filters dt-button ui-button ui-state-default ui-button-text-only buttons-collection">
                    <span class="ui-button-text">Refresh Data <i class="fa fa-refresh"
                                                                 aria-hidden="true"></i></span></button>
            </div>
        </div>
        </div>
        <?php
    }

    ?>

    </div>


    <?php

}

//gets the task id from a Blog post Id
//works for v4 and v5 blog_posts
function go_get_task_id($blog_post_id){
    global $wpdb;
    $aTable = "{$wpdb->prefix}go_actions";
    $task_id = wp_get_post_parent_id($blog_post_id);

    if(!$task_id){
        $task_id = get_post_meta($blog_post_id, 'go_blog_task_id', true);
        //$go_blog_task_id = (isset($blog_meta['go_blog_task_id'][0]) ? $blog_meta['go_blog_task_id'][0] : null);
    }
    if(!$task_id) {
        $task_id = $wpdb->get_var($wpdb->prepare("SELECT source_id
				FROM {$aTable} 
				WHERE result = %d AND  action_type = %s
				ORDER BY id DESC LIMIT 1",
            intval($blog_post_id),
            'task'));
    }
    return $task_id;
}

function go_embed_defaults($embed_size){
    $go_video_unit = get_option ('go_video_width_type_control');$go_video_unit = get_option ('go_video_width_type_control');

    if ($go_video_unit == '%'){
        $pixels = 400;
    }else{
        $pixels = get_option( 'go_video_width_px_control' );
        if($pixels === false){
            $pixels = 400;
        }

    }
    $embed_size['width'] = $pixels;
    return $embed_size;
}
add_filter('embed_defaults', 'go_embed_defaults');


/**
 * Auto update slugs
 * @author  Mick McMurray
 * Based on info from:
 * @link http://thestizmedia.com/custom-post-type-filter-admin-custom-taxonomy/
 */
function go_update_slug( $data, $postarr ) {
    $slug_toggle = get_site_option( 'options_go_slugs_toggle');
    if ($slug_toggle) {
        $post_type = $data['post_type'];
        if ($post_type == 'tasks' || $post_type == 'go_store') {
            $data['post_name'] = wp_unique_post_slug(sanitize_title($data['post_title']), $postarr['ID'], $data['post_status'], $data['post_type'], $data['post_parent']);
        }
        return $data;
    }
}
add_filter( 'wp_insert_post_data', 'go_update_slug', 99, 2 );

// define the wp_update_term_data callback
/**
 * @param $data
 * @param $term_id
 * @param $taxonomy
 * @param $args
 * @return mixed
 */
function go_update_term_slug($data, $term_id, $taxonomy, $args ) {
    $slug_toggle = get_site_option( 'options_go_slugs_toggle');
    if ($slug_toggle) {
        $no_space_slug = sanitize_title($data['name']);
        $data['slug'] = wp_unique_term_slug($no_space_slug, (object)$args);
        return $data;
    }
};
add_filter( 'wp_update_term_data', 'go_update_term_slug', 10, 4 );

/**
 *
 */
function hide_all_slugs() {
    $slug_toggle = get_site_option( 'options_go_slugs_toggle');
    if ($slug_toggle) {
        global $post;
        $post_type = get_post_type( get_the_ID() );
        if ($post_type != 'post' && $post_type != 'page') {
            $hide_slugs = "<style type=\"text/css\"> #slugdiv, #edit-slug-box, .term-slug-wrap { display: none; }</style>";
            print($hide_slugs);
        }

    }
}
add_action( 'admin_head', 'hide_all_slugs'  );


/**
 * Filter the link query arguments to change the post types.
 * This limits the posts shown in the link picker in MCE.
 * Users were seeing all content.
 *
 * @param array $query An array of WP_Query arguments.
 * @return array $query
 */
function go_custom_link_query( $query ){

    // change the post types by hand:
    if(!go_user_is_admin()) {
        $query['post_type'] = array('post', 'pages', 'tasks');
    }
   else{
       $query['post_type'] = array();
   }

    return $query;
}

add_filter( 'wp_link_query_args', 'go_custom_link_query' );

