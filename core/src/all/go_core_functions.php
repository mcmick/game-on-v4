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

    if ($post_id == 0){
        if ($print){
            echo get_admin_url(null, 'post-new.php?post_type=tasks');
            die();
        }
    }
    /*
     * and all the original post data then
     */
    $post = get_post( $post_id );

    /*
     * if you don't want current user to be the new post author,
     * then change next couple of lines to this: $new_post_author = $post->post_author;
     */
    $current_user = wp_get_current_user();
    $new_post_author = $current_user->ID;

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
        $new_post_id = wp_insert_post( $args );

        /*
         * get all current post terms ad set them to the new post draft
         */
        $taxonomies = get_object_taxonomies($post->post_type); // returns array of taxonomy names for post type, ex array("category", "post_tag");
        foreach ($taxonomies as $taxonomy) {
            $post_terms = wp_get_object_terms($post_id, $taxonomy, array('fields' => 'slugs'));
            wp_set_object_terms($new_post_id, $post_terms, $taxonomy, false);
        }

        /*
         * duplicate all post meta just in two SQL queries
         */
        $post_meta_infos = $wpdb->get_results("SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id=$post_id");
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

        if ($print){
            echo  admin_url( 'post.php?action=edit&post=' . $new_post_id );
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
function go_make_tax_select ($taxonomy, $is_lightbox = false, $value = false, $value_name = false, $activate_filter = false){
    if ($is_lightbox){
        $location = 'lightbox';
    }
    else{
        $location = 'page';
    }

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
        $list = implode("<br>", $list);
        //$list = '<span class="tooltip" data-tippy-content="'. $list .'">'. $list . '</span>';
        $list = '<span>'. $list . '</span>';

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