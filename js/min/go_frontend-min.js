function go_blog_favorite(e){if(blog_post_id=jQuery(e).attr("data-post_id"),jQuery(e).is(":checked"))var o=!0;else o=!1;var t,a={action:"go_blog_favorite_toggle",_ajax_nonce:GO_EVERY_PAGE_DATA.nonces.go_blog_favorite_toggle,blog_post_id:blog_post_id,checked:o};jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:a,success:function(e){}})}function go_blog_tags_select2(){jQuery(".go_feedback_go_blog_tags_select").select2({ajax:{url:MyAjax.ajaxurl,dataType:"json",delay:400,data:function(e){return{q:e.term,action:"go_make_taxonomy_dropdown_ajax",taxonomy:"go_blog_tags",is_hier:!1}},processResults:function(e){return jQuery(".go_feedback_go_blog_tags_select").select2("destroy"),jQuery(".go_feedback_go_blog_tags_select").children().remove(),jQuery(".go_feedback_go_blog_tags_select").select2({data:e,placeholder:"Show All",allowClear:!0}).trigger("change"),jQuery(".go_feedback_go_blog_tags_select").select2("open"),{results:e}},cache:!0},minimumInputLength:0,multiple:!0,placeholder:"Show All",allowClear:!0})}function task_stage_check_input(e,o){console.log("button clicked"),go_enable_loading(e);var t="";void 0!==jQuery(e).attr("button_type")&&(t=jQuery(e).attr("button_type"),console.log("button_type: "+t));var a="";void 0!==jQuery(e).attr("status")&&(a=jQuery(e).attr("status"));var l="";void 0!==jQuery(e).attr("check_type")&&(l=jQuery(e).attr("check_type"),console.log("Check Type: "+l));var r=!1;jQuery("#go_blog_stage_error_msg").text(""),jQuery("#go_blog_error_msg").text("");var _="<h3>Your post was not saved.</h3><ul> ",n=jQuery(e).attr("url_toggle"),g=jQuery(e).attr("video_toggle"),i=jQuery(e).attr("file_toggle"),s=jQuery(e).attr("text_toggle"),u=jQuery(e).attr("blog_suffix"),c="#go_result_video"+u,d="#go_result_url"+u,b="#go_result_media"+u,p;if(console.log("suffix: "+u),"blog"==l||"blog_lightbox"==l){if("1"==g){var y=jQuery(c).attr("value").replace(/\s+/,"");console.log(y),y.length>0?!y.match(/^(http:\/\/|https:\/\/).*\..*$/)||y.lastIndexOf("http://")>0||y.lastIndexOf("https://")>0?(_+="<li>Enter a valid video URL. YouTube and Vimeo are supported.</li>",r=!0):-1==y.search("youtube")&&-1==y.search("vimeo")&&(_+="<li>Enter a valid video URL. YouTube and Vimeo are supported.</li>",r=!0):(_+="<li>Enter a valid video URL. YouTube and Vimeo are supported.</li>",r=!0)}if("1"==s){var h=jQuery(e).attr("min_words"),f=tinymce_getContentLength_new(l);f<h&&(_+="<li>Your post is not long enough. There must be "+h+" words minimum. You have "+f+" words.</li>",r=!0)}}"password"!==l&&"unlock"!=l||(jQuery("#go_result").attr("value").length>0||(_+="Retrieve the password from "+go_task_data.admin_name+".",r=!0));if("URL"==l||("blog"==l||"blog_lightbox"==l)&&1==n){if("URL"==l)var y=jQuery("#go_result").attr("value").replace(/\s+/,"");else var y=jQuery(d).attr("value").replace(/\s+/,""),j=jQuery(e).attr("required_string");console.log("URL"+y),y.length>0?!y.match(/^(http:\/\/|https:\/\/).*\..*$/)||y.lastIndexOf("http://")>0||y.lastIndexOf("https://")>0?(_+="<li>Enter a valid URL.</li>",r=!0):"blog"!=l&&"blog_lightbox"!=l||-1==y.indexOf(j)&&(_+='<li>Enter a valid URL. The URL must contain "'+j+'".</li>',r=!0):(_+="<li>Enter a valid URL.</li>",go_disable_loading(),r=!0)}if("upload"==l||("blog"==l||"blog_lightbox"==l)&&1==i){if("upload"==l)var v=jQuery("#go_result").attr("value");else var v=jQuery(b).attr("value");null==v&&(_+="<li>Please attach a file.</li>",r=!0)}if("quiz"==l){var Q=jQuery(".go_test_list");if(Q.length>=1){for(var m=0,w=0;w<Q.length;w++){var k="#"+Q[w].id+" input:checked",x;jQuery(k).length>=1&&m++}m>=Q.length?(go_quiz_check_answers(a,e),r=!1):Q.length>1?(_+="<li>Please answer all questions!</li>",r=!0):(_+="<li>Please answer the question!</li>",r=!0)}}if(_+="</ul>",1==r)return 1==o?(console.log("error_stage"),jQuery("#go_blog_stage_error_msg").append(_),jQuery("#go_blog_stage_error_msg").show()):(console.log("error_blog"),jQuery("#go_blog_error_msg").append(_),jQuery("#go_blog_error_msg").show()),console.log("error validation"),void go_disable_loading();jQuery("#go_blog_stage_error_msg").hide(),jQuery("#go_blog_error_msg").hide(),1==o?task_stage_change(e):go_blog_submit(e,!0)}function go_enable_loading(e){jQuery(".go_loading").remove(),e.innerHTML='<span class="go_loading"></span>'+e.innerHTML}function go_disable_loading(){jQuery(".go_loading").remove(),jQuery("#go_button").off().one("click",function(e){task_stage_check_input(this,!0)}),jQuery("#go_back_button").off().one("click",function(e){task_stage_change(this)}),jQuery("#go_save_button").off().one("click",function(e){go_blog_submit(this,!1)}),jQuery("#go_bonus_button").off().one("click",function(e){go_update_bonus_loot(this)}),jQuery(".go_str_item").off().one("click",function(e){go_lb_opener(this.id)}),jQuery(".go_blog_opener").off().one("click",function(e){go_blog_opener(this)}),jQuery(".go_blog_trash").off().one("click",function(e){go_blog_trash(this)}),jQuery("#go_blog_submit").off().one("click",function(e){task_stage_check_input(this,!1)}),jQuery(".progress").closest(".go_checks_and_buttons").addClass("active")}function tinymce_getContentLength_new(e){if("blog_lightbox"==e)var o=go_tmce_getContent("go_blog_post_lightbox");else var o=go_tmce_getContent("go_blog_post");var t=0;if(o){var a=(o=(o=(o=(o=o.replace(/\.\.\./g," ")).replace(/<.[^<>]*?>/g," ").replace(/&nbsp;|&#160;/gi," ")).replace(/(\w+)(&#?[a-z0-9]+;)+(\w+)/i,"$1$3").replace(/&.+?;/g," ")).replace(/[0-9.(),;:!?%#$?\x27\x22_+=\\\/\-]*/g,"")).match(/[\w\u2019\x27\-\u00C0-\u1FFF]+/g);a&&(t=a.length)}return t}function go_blog_opener(e){go_enable_loading(e),jQuery("#go_hidden_mce").remove(),jQuery(".go_blog_opener").prop("onclick",null).off("click");var o=jQuery(e).attr("data-check_for_understanding"),t=jQuery(e).attr("blog_post_id"),a,l={action:"go_blog_opener",_ajax_nonce:GO_EVERY_PAGE_DATA.nonces.go_blog_opener,blog_post_id:t,check_for_understanding:o};jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:l,cache:!1,success:function(e){jQuery.featherlight(e,{afterContent:function(){console.log("aftercontent"),jQuery("body").attr("data-go_blog_saved","0"),jQuery("body").attr("data-go_blog_updated","0"),jQuery("#go_result_url_lightbox, #go_result_video_lightbox").change(function(){jQuery("body").attr("data-go_blog_updated","1")}),jQuery(".go_frontend-button").on("click",function(){jQuery("body").attr("data-go_blog_updated","1")});var e="go_blog_post_lightbox";tinymce.execCommand("mceRemoveEditor",!0,e),quicktags({id:e}),tinymce.init({selector:e,setup:function(e){e.on("keyup",function(e){jQuery("body").attr("data-go_blog_updated","1"),console.log("updated")})},branding:!1,theme:"modern",skin:"lightgray",language:"en",formats:{alignleft:[{selector:"p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",styles:{textAlign:"left"}},{selector:"img,table,dl.wp-caption",classes:"alignleft"}],aligncenter:[{selector:"p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",styles:{textAlign:"center"}},{selector:"img,table,dl.wp-caption",classes:"aligncenter"}],alignright:[{selector:"p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",styles:{textAlign:"right"}},{selector:"img,table,dl.wp-caption",classes:"alignright"}],strikethrough:{inline:"del"}},relative_urls:!1,remove_script_host:!1,convert_urls:!1,browser_spellcheck:!0,fix_list_elements:!0,entities:"38,amp,60,lt,62,gt",entity_encoding:"raw",keep_styles:!1,paste_webkit_styles:"font-weight font-style color",preview_styles:"font-family font-size font-weight font-style text-decoration text-transform",wpeditimage_disable_captions:!1,wpeditimage_html5_captions:!0,plugins:"charmap,hr,lists,media,paste,tabfocus,textcolor,fullscreen,wordpress,wpeditimage,wpgallery,wplink,wpdialogs,wpview,wordcount",selector:"#"+e,resize:"vertical",menubar:!1,wpautop:!0,wordpress_adv_hidden:!1,indent:!1,toolbar1:"formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,fullscreen,wp_adv",toolbar2:"strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",toolbar3:"",toolbar4:"",tabfocus_elements:":prev,:next",body_class:"id post-type-post post-status-publish post-format-standard"}),tinyMCE.execCommand("mceAddEditor",!1,e)},beforeClose:function(){var e,o;if(console.log("beforeClose"),"1"==jQuery("body").attr("data-go_blog_updated"))return swal({title:"You have unsaved changes.",text:"Would you like to save? If you don't save you will not be able to recover these changes.",icon:"warning",buttons:{exit:{text:"Close without Saving",value:"exit"},save:{text:"Save and Close",value:"save"}}}).then(e=>{switch(e){case"exit":swal("Your changes were not saved."),jQuery("body").attr("data-go_blog_updated","0"),jQuery.featherlight.close();break;case"save":jQuery("#go_blog_submit").trigger("click");break;default:}}),!1;(jQuery(".go_blog_post_wrapper_"+t).length=0)&&location.reload()}}),jQuery(".featherlight").css("background","rgba(0,0,0,.8)"),jQuery(".featherlight .featherlight-content").css("width","80%"),jQuery(".go_blog_opener").one("click",function(e){go_blog_opener(this)}),go_disable_loading()}})}function go_blog_submit(e,o){go_enable_loading(e);var t=GO_EVERY_PAGE_DATA.nonces.go_blog_submit,a=jQuery(e).attr("blog_suffix"),l=jQuery("#go_blog_title"+a).val(),r=jQuery(e).attr("button_type"),_=go_get_tinymce_content_blog(a);console.log("go_blog_submit");var n=jQuery("#go_blog_title"+a).attr("data-blog_post_id");console.log("blog_post_id: "+n);var g=".go_blog_post_wrapper_"+n,i=jQuery(e).attr("data-bonus_status"),s=jQuery(e).attr("status"),u=jQuery(e).attr("task_id"),c=jQuery(e).attr("data-check_for_understanding"),d=jQuery("#go_result_url"+a).val();if(jQuery("#go_private_post"+a).is(":checked"))var b=!0;var p=jQuery("#go_result_media"+a).attr("value"),y=jQuery("#go_result_video"+a).val();console.log("blog_private: "+b);var h={action:"go_blog_submit",_ajax_nonce:t,result:_,result_title:l,blog_post_id:n,blog_url:d,blog_media:p,blog_video:y,blog_private:b,go_blog_task_stage:s,go_blog_bonus_stage:i,post_id:u,button:r,check_for_understanding:c};jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:h,cache:!1,success:function(e){console.log("success1");var t={};try{var t=JSON.parse(e)}catch(e){t={json_status:"101",message:"",blog_post_id:"",wrapper:""}}if(jQuery("body").attr("data-go_blog_updated","0"),jQuery("body").append(t.message),go_disable_loading(),jQuery("#go_save_button"+a).off().one("click",function(e){go_blog_submit(this,!1)}),jQuery("#go_save_button"+a).attr("blog_post_id",t.blog_post_id),jQuery("#go_blog_title"+a).attr("data-blog_post_id",t.blog_post_id),1==o){var l=jQuery(g).length,r;console.log("reload is true:"+l),jQuery.featherlight.current().close(),jQuery(g).length>0?(jQuery(g).replaceWith(t.wrapper),jQuery(".feedback_accordion").accordion({collapsible:!0}),go_disable_loading()):location.reload()}}})}function go_blog_trash(e){go_enable_loading(e),swal({title:"Are you sure?",text:"Do you really want to delete this post?",icon:"warning",buttons:!0,dangerMode:!0}).then(o=>{if(o){var t=GO_EVERY_PAGE_DATA.nonces.go_blog_trash,a=jQuery(e).attr("blog_post_id"),l={action:"go_blog_trash",_ajax_nonce:t,blog_post_id:a};jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:l,cache:!1,success:function(e){var o;jQuery("body").append(e),jQuery(".go_blog_post_wrapper_"+a).hide(),jQuery(".go_blog_trash").off().one("click",function(e){go_blog_trash(this)}),swal("Poof! Your post has been deleted!",{icon:"success"})}}),go_disable_loading(e)}else swal("Your post is safe!"),go_disable_loading(e)})}function go_get_tinymce_content_blog(e){return jQuery("#wp-go_blog_post_edit-wrap .wp-editor-area").is(":visible")?jQuery("#wp-go_blog_post_edit-wrap .wp-editor-area").val():go_tmce_getContent("_lightbox"==e?"go_blog_post_lightbox":"go_blog_post")}function go_blog_user_task(e,o){console.log("blogs!");var t=GO_EVERY_PAGE_DATA.nonces.go_blog_user_task;jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:t,action:"go_blog_user_task",uid:e,task_id:o},success:function(e){jQuery.featherlight(e,{variant:"blogs",afterOpen:function(e){go_fit_and_max_only("#go_blog_container")}})}})}function go_tmce_getContent(e,o){return void 0===e&&(e=wpActiveEditor),void 0===o&&(o=e),jQuery("#wp-"+e+"-wrap").hasClass("tmce-active")&&tinyMCE.get(e)?tinyMCE.get(e).getContent():jQuery("#"+o).val()}function go_tmce_setContent(e,o,t){return void 0===o&&(o=wpActiveEditor),void 0===t&&(t=o),jQuery("#wp-"+o+"-wrap").hasClass("tmce-active")&&tinyMCE.get(o)?tinyMCE.get(o).setContent(e):jQuery("#"+t).val(e)}function go_tmce_focus(e,o){return void 0===e&&(e=wpActiveEditor),void 0===o&&(o=e),jQuery("#wp-"+e+"-wrap").hasClass("tmce-active")&&tinyMCE.get(e)?tinyMCE.get(e).focus():jQuery("#"+o).focus()}jQuery(document).ready(function(){jQuery(".go_blog_opener").one("click",function(e){go_blog_opener(this)}),jQuery(".go_blog_trash").one("click",function(e){go_blog_trash(this)}),jQuery("#go_hidden_mce").remove(),jQuery("#go_hidden_mce_edit").remove(),jQuery(".feedback_accordion").accordion({collapsible:!0}),jQuery(".go_blog_favorite").click(function(){go_blog_favorite(this)})});