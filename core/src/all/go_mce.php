<?php
/**
 * Created by PhpStorm.
 * User: mmcmurray
 * Date: 10/13/18
 * Time: 8:28 PM
 */

//these are the text filters
//https://themehybrid.com/weblog/how-to-apply-content-filters
add_filter( 'go_awesome_text', 'go_oembed_text' );
add_filter( 'go_awesome_text', 'wptexturize'       );//this one converts double hyphens to dashes
add_filter( 'go_awesome_text', 'convert_smilies'   );
add_filter( 'go_awesome_text', 'convert_chars'     );
add_filter( 'go_awesome_text', 'wpautop'           );
add_filter( 'go_awesome_text', 'shortcode_unautop' );
add_filter( 'go_awesome_text', 'do_shortcode'      );



//the go_awesome_text filter uses this to embed content
function go_oembed_text($content)
{
    $content = $GLOBALS['wp_embed']->autoembed($content);
    return $content;
}

/*
Plugin Name: Frameitron
Plugin URI: http://ninnypants.com
Description: Allow iframes in tinymce for all user levels
Version: 1.0
Author: ninnypants
Author URI: http://ninnypants.com
License: GPL2
Copyright 2013  Tyrel Kelsey  (email : tyrel@ninnypants.com)
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vT3CBcDQA4Huj8EalgAXx0MzVThWwARsPSEbnqCD9aStkxikS6hsETNnJyYOnXg2Jcz1ObKrbar07kE/embed?start=false&loop=false&delayms=3000"
frameborder="0" width="960" height="569"
allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
*/
add_action( 'init', 'go_frame_it_up' );
add_filter( 'tiny_mce_before_init', 'go_frame_it_up_tinymce' );
function go_frame_it_up( $init_array ){
    global $allowedtags, $allowedposttags;
    $allowedposttags['iframe'] = $allowedtags['iframe'] = array(
        'name' => true,
        'id' => true,
        'class' => true,
        'style' => true,
        'src' => true,
        'width' => true,
        'height' => true,
        'allowtransparency' => true,
        'frameborder' => true,
        'allowfullscreen' => true,
        'mozallowfullscreen' => true,
        'webkitallowfullscreen' => true,
    );
}


function go_frame_it_up_tinymce( $init_array ){
    if( isset( $init_array['extended_valid_elements'] ) )
        $init_array['extended_valid_elements'] .= ',iframe[id|name|class|style|src|width|height|allowtransparency|frameborder|allowfullscreen|webkitallowfullscreen|mozallowfullscreen]';
    else
        $init_array['extended_valid_elements'] = 'iframe[id|name|class|style|src|width|height|allowtransparency|frameborder|allowfullscreen|webkitallowfullscreen|mozallowfullscreen]';
    return $init_array;
}



//This allows all users to use oembed in the WYSIWYG
function override_caps($allcaps){
    $post_action = (isset($_POST['action']) ?  $_POST['action'] : null);

    if ( $post_action == 'parse-embed' ){// override capabilities when embedding content in WYSIWIG
        $role_name = 'administrator';
        $role = get_role($role_name); // Get the role object by role name
        $allcaps = $role->capabilities;  // Get the capabilities for the role
        $allcaps['contributor'] = true;     // Add role name to capabilities
    }
    return $allcaps;
}
add_filter( 'user_has_cap', 'override_caps' );


function go_changeMceDefaults($in) {

    // customize the buttons
    $in['theme_advanced_buttons1'] = 'bold,italic,underline,bullist,numlist,hr,blockquote,link,unlink,justifyleft,justifycenter,justifyright,justifyfull,outdent,indent';
    $in['theme_advanced_buttons2'] = 'formatselect,pastetext,pasteword,charmap,undo,redo';

    // Keep the "kitchen sink" open
    $in[ 'wordpress_adv_hidden' ] = FALSE;

    $in[ 'menubar' ] = FALSE;
    return $in;

}
add_filter( 'tiny_mce_before_init', 'go_changeMceDefaults' );


// Enable font size and font family selects in the editor
if ( ! function_exists( 'am_add_mce_font_buttons' ) ) {
    function am_add_mce_font_buttons( $buttons ) {
        array_unshift( $buttons, 'fontselect' ); // Add Font Select
        array_unshift( $buttons, 'fontsizeselect' ); // Add Font Size Select
        return $buttons;
    }
}
add_filter( 'mce_buttons_2', 'am_add_mce_font_buttons' ); // you can use mce_buttons_2 or mce_buttons_3 to change the rows where the buttons will appear


// Add custom Fonts to the Fonts list
if ( ! function_exists( 'am_add_google_fonts_array_to_tiny_mce' ) ) {
    function am_add_google_fonts_array_to_tiny_mce( $initArray ) {
        $initArray['font_formats'] = 'Lato=Lato;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats';
        return $initArray;
    }
}
add_filter( 'tiny_mce_before_init', 'am_add_google_fonts_array_to_tiny_mce' );



//*******************************************************************************************
// Load tinymce wordcount
//*******************************************************************************************

add_filter('mce_external_plugins', 'go_tinymce_wordcount');

function go_tinymce_wordcount($plugins_array = array())
{
    $plugins = array('wordcount');
    //Build the response - the key is the plugin name, value is the URL to the plugin JS
    foreach ($plugins as $plugin )
    {
        $plugins_array[ $plugin ] = plugins_url('tinymce/', __FILE__) . $plugin . '/wordcount.js';
    }
    return $plugins_array;
}



//*******************************************************************************************
// Load tinymce annotate
//*******************************************************************************************

add_filter('mce_external_plugins', 'go_tinymce_annotate');

function go_tinymce_annotate($plugins_array = array())
{
    $plugins = array('annotate');
    //Build the response - the key is the plugin name, value is the URL to the plugin JS
    foreach ($plugins as $plugin )
    {
        $plugins_array[ $plugin ] = plugins_url('tinymce/', __FILE__) . $plugin . '/plugin.js';
    }
    return $plugins_array;
}



function go_mce_add_button( $buttons ) {
    if(go_user_is_admin()) {
        array_push($buttons, "separator", "go_shortcode_button");
        array_push($buttons, "separator", "go_admin_comment");
    }
    array_push($buttons, "separator", "tma_annotate");
    array_push($buttons, "separator", "tma_annotatedelete");
    array_push($buttons, "separator", "tma_annotatehide");
    return $buttons;
}
add_filter( 'mce_buttons', 'go_mce_add_button', 0);

function go_shortcode_button_register( $plugin_array ) {
    $url = plugin_dir_url(dirname(dirname(dirname(__FILE__))));
    if(go_user_is_admin()) {
        $url .= "js/scripts/go_shortcode_mce.js";
        $plugin_array['go_shortcode_button'] = $url;
    }
    return $plugin_array;
}
add_filter( 'mce_external_plugins', 'go_shortcode_button_register' );

function go_comments_button_register( $plugin_array ) {
    $url = plugin_dir_url(dirname(dirname(dirname(__FILE__))));
    if(go_user_is_admin()) {
        $url .= "js/scripts/go_admin_comments_mce.js";
        $plugin_array['go_admin_comment'] = $url;
    }
    return $plugin_array;
}
add_filter( 'mce_external_plugins', 'go_comments_button_register' );

function go_annotate_button_register( $plugin_array ) {
    $url = plugin_dir_url(dirname(dirname(dirname(__FILE__))));
    //if(go_user_is_admin()) {
        $url .= "core/src/all/tinymce/annotate/plugin.js";
        $plugin_array['go_admin_comment'] = $url;
   // }
    return $plugin_array;
}
add_filter( 'mce_external_plugins', 'go_annotate_button_register' );

function tma_annotate_css($mce_css) {
    if (!empty($mce_css))
        $mce_css .= ',';
    $mce_css = plugin_dir_url(dirname(dirname(dirname(__FILE__))));
    $mce_css .= "dev/css/files/annotate.css";
    return $mce_css;
}
add_filter('mce_css', 'tma_annotate_css');

