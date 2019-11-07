function go_save_archive(){console.log("go_save_archive"),Swal.fire({title:"Create Archive",text:"Choose an option below",type:"warning",showCancelButton:!0,confirmButtonText:"Create Archive",cancelButtonText:"No, cancel!",reverseButtons:!0,customClass:{confirmButton:"btn btn-success",cancelButton:"btn btn-danger"}}).then(e=>{e.value?Swal.fire({title:"What type of archive would you like to create?",text:"A public archive will only have blog posts that are publicly available. A private archive includes all posts, including private posts, as well as the feedback.",type:"warning",showCancelButton:!0,confirmButtonText:"Public Archive",cancelButtonText:"Private Archive",focusConfirm:!0,focusCancel:!1,reverseButtons:!0,cancelButtonColor:"#3085d6"}).then(e=>{if(e.value)var o="public";else if(e.dismiss===Swal.DismissReason.cancel)var o="private";Swal.fire({title:"Generating Archive . . .",text:"",onBeforeOpen:()=>{Swal.showLoading()}});var t,r={action:"go_make_user_archive_zip",archive_type:o,is_admin_archive:!1,_ajax_nonce:go_make_user_archive_zip_nonce};jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:r,error:function(e,o,t){Swal.fire({title:"Error",text:"There was a problem creating your archive.",type:"error",showCancelButton:!1}),console.log("errors"),console.log(e),console.log(o),console.log(t),jQuery("#go_save_archive").one("click",function(e){go_save_archive(this)})},success:function(e){0===e||"0"===e?Swal.fire({title:"Error",text:"There was a problem creating your archive.",type:"error",showCancelButton:!1}):(go_zip_archive(),jQuery("#go_save_archive").one("click",function(e){go_save_archive(this)}))}})}):jQuery("#go_save_archive").one("click",function(e){go_save_archive(this)})})}function go_loadmore_blog(){jQuery(function(e){e(".go_loadmore_blog").click(function(){var o=e(this),t={action:"loadmore",page:misha_loadmore_params.current_page,myargs:misha_loadmore_params.myargs};e.ajax({url:misha_loadmore_params.ajaxurl,data:t,type:"POST",beforeSend:function(e){o.text("Loading...")},success:function(e){e?(o.text("More posts").parent().before(e),misha_loadmore_params.current_page++,misha_loadmore_params.current_page==misha_loadmore_params.max_page&&o.remove(),go_blog_new_posts()):o.remove()}})})})}function go_loadmore_reader(){jQuery(function(e){e(".go_loadmore_reader").click(function(){console.log("go_loadmore_reader");let o=e(this).data("offset"),t=e(this).data("limit"),r=e(this).data("query");var a=e(this),s={action:"go_loadmore_reader",query:r,offset:o,limit:t};e.ajax({url:misha_loadmore_params.ajaxurl,data:s,type:"POST",beforeSend:function(e){a.text("Loading...")},success:function(e){e?(console.log(e),a.text("More posts").parent().before(e),go_blog_new_posts(),jQuery(".go_loadmore_reader").data("offset",++o),go_reader_activate_buttons()):a.remove()}})})})}function go_update_bonus_loot(){jQuery("#go_bonus_loot_mysterybox").html("<i class='fas fa-spinner fa-pulse fa-4x'></i>");var e=GO_EVERY_PAGE_DATA.nonces.go_update_bonus_loot,o=go_task_data.ID;jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:e,action:"go_update_bonus_loot",post_id:o},error:function(e,o,t){400===e.status&&jQuery(document).trigger("heartbeat-tick.wp-auth-check",[{"wp-auth-check":!1}])},success:function(e){console.log("Bonus Loot"),jQuery("#go_bonus_loot").html(e)}})}function getTimeRemaining(e){var o=e-Date.parse(new Date),t=Math.floor(o/1e3%60),r=Math.floor(o/1e3/60%60),a=Math.floor(o/36e5%24),s;return{total:o,days:Math.floor(o/864e5),hours:a,minutes:r,seconds:t}}function initializeClock(e,o){function t(){var e=getTimeRemaining(o),t;(e.days=Math.max(0,e.days),a.innerHTML=e.days,e.hours=Math.max(0,e.hours),s.innerHTML=("0"+e.hours).slice(-2),e.minutes=Math.max(0,e.minutes),n.innerHTML=("0"+e.minutes).slice(-2),e.seconds=Math.max(0,e.seconds),i.innerHTML=("0"+e.seconds).slice(-2),e.total=0)&&(clearInterval(c),new Audio(PluginDir.url+"media/sounds/airhorn.mp3").play())}console.log("initializeClock"),o+=Date.parse(new Date);var r=document.getElementById(e),a=r.querySelector(".days"),s=r.querySelector(".hours"),n=r.querySelector(".minutes"),i=r.querySelector(".seconds");t();var _=getTimeRemaining(o),l=_.total;if(console.log("total"+_.total),l>0)var c=setInterval(t,1e3)}function go_timer_abandon(){var e=go_task_data.redirectURL;window.location=e}function flash_error_msg(e){var o=jQuery(e).css("background-color");void 0===typeof o&&(o="white"),jQuery(e).animate({color:o},200,function(){jQuery(e).animate({color:"red"},200)})}function task_stage_change(e,o=null){console.log("task_stage_change");var t="";void 0!==jQuery(e).attr("button_type")&&(t=jQuery(e).attr("button_type")),console.log("Button:"+t);var r="";void 0!==jQuery(e).attr("status")&&(r=jQuery(e).attr("status"));var a="";void 0!==jQuery(e).attr("next_bonus")&&(a=jQuery(e).attr("next_bonus"));let s="";void 0!==jQuery(e).attr("check_type")&&(s=jQuery(e).attr("check_type"));let n="";void 0!==jQuery(e).attr("blog_post_id")&&(n=jQuery(e).attr("blog_post_id"));let i=jQuery("#go_result").attr("value"),_=null;if("blog"==s&&"undo_last_bonus"!=t)i=go_get_tinymce_content_blog("post"),_=jQuery("#go_blog_title").html();else{let e=null}console.log("required_elements"),console.log(o);const l=JSON.stringify(o);console.log(l),jQuery.ajax({type:"POST",data:{_ajax_nonce:go_task_data.go_task_change_stage,action:"go_task_change_stage",post_id:go_task_data.ID,user_id:go_task_data.userID,status:r,next_bonus:a,button_type:t,check_type:s,result:i,result_title:_,blog_post_id:n,required_elements:l},error:function(e,o,t){go_disable_loading(),400===e.status&&jQuery(document).trigger("heartbeat-tick.wp-auth-check",[{"wp-auth-check":!1}])},success:function(e){var o;if(console.log(e),"true"!=(o=go_ajax_error_checker(e))){var t={};try{var t=JSON.parse(e)}catch(e){t={json_status:"101",timer_start:"",button_type:"",time_left:"",html:"",redirect:"",rewards:{gold:0}}}if("101"===Number.parseInt(t.json_status)){console.log(101),jQuery("#go_stage_error_msg").show();var o="Server Error.";jQuery("#go_stage_error_msg").text()!=o?jQuery("#go_stage_error_msg").text(o):flash_error_msg("#go_stage_error_msg")}else if(302===Number.parseInt(t.json_status))console.log(302),window.location=t.location;else if("refresh"==t.json_status)location.reload();else if("bad_password"==t.json_status){jQuery("#go_stage_error_msg").show();var o="Invalid password.";jQuery("#go_stage_error_msg").text()!=o?jQuery("#go_stage_error_msg").text(o):flash_error_msg("#go_stage_error_msg"),go_disable_loading(),go_reader_activate_buttons()}else{if(console.log(1),"undo"==t.button_type)jQuery("#go_wrapper div").last().hide(),jQuery("#go_wrapper > div").slice(-3).hide("slow",function(){jQuery(this).remove()});else if("undo_last"==t.button_type)jQuery("#go_wrapper div").last().hide(),jQuery("#go_wrapper > div").slice(-2).hide("slow",function(){jQuery(this).remove()});else if("continue"==t.button_type||"complete"==t.button_type)jQuery("#go_wrapper > div").slice(-1).hide("slow",function(){jQuery(this).remove()});else if("show_bonus"==t.button_type)jQuery("#go_buttons").remove(),jQuery(".go_checks_and_buttons").removeClass("active");else if("continue_bonus"==t.button_type||"complete_bonus"==t.button_type)jQuery("#go_wrapper > div").slice(-1).hide("slow",function(){jQuery(this).remove()});else if("undo_bonus"==t.button_type)jQuery("#go_wrapper > div").slice(-2).hide("slow",function(){jQuery(this).remove()});else if("undo_last_bonus"==t.button_type)jQuery("#go_wrapper > div").slice(-1).hide("slow",function(){jQuery(this).remove()});else if("abandon_bonus"==t.button_type)jQuery("#go_wrapper > div").slice(-3).remove();else if("abandon"==t.button_type)window.location=t.redirect;else if("timer"==t.button_type){var r;jQuery("#go_wrapper > div").slice(-3).hide("slow",function(){jQuery(this).remove()}),new Audio(PluginDir.url+"media/sounds/airhorn.mp3").play()}go_append(t),jQuery(document).ready(function(){jQuery(".feedback_accordion").accordion({collapsible:!0,active:!1,heightStyle:"content"})}),go_reader_activate_buttons()}}}})}function go_mce_reset(){tinymce.execCommand("mceRemoveEditor",!0,"go_blog_post"),tinymce.execCommand("mceAddEditor",!0,"go_blog_post")}function go_append(e){console.log("go_append");var o=e.html;console.log(o),jQuery(e.html).appendTo("#go_wrapper").stop().hide().show("slow").promise().then(function(){console.log("1"),go_Vids_Fit_and_Box("body"),console.log("2"),go_make_clickable(),console.log("3"),go_disable_loading();var e="go_blog_post";tinymce.execCommand("mceRemoveEditor",!0,e),quicktags({id:e}),tinymce.init({selector:e,branding:!1,theme:"modern",skin:"lightgray",language:"en",formats:{alignleft:[{selector:"p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",styles:{textAlign:"left"}},{selector:"img,table,dl.wp-caption",classes:"alignleft"}],aligncenter:[{selector:"p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",styles:{textAlign:"center"}},{selector:"img,table,dl.wp-caption",classes:"aligncenter"}],alignright:[{selector:"p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",styles:{textAlign:"right"}},{selector:"img,table,dl.wp-caption",classes:"alignright"}],strikethrough:{inline:"del"}},relative_urls:!1,remove_script_host:!1,convert_urls:!1,browser_spellcheck:!0,fix_list_elements:!0,entities:"38,amp,60,lt,62,gt",entity_encoding:"raw",keep_styles:!1,paste_webkit_styles:"font-weight font-style color",preview_styles:"font-family font-size font-weight font-style text-decoration text-transform",wpeditimage_disable_captions:!1,wpeditimage_html5_captions:!0,plugins:"charmap,hr,lists,media,paste,tabfocus,textcolor,fullscreen,wordpress,wpeditimage,wpgallery,wplink,wpdialogs,wpview,wordcount",selector:"#"+e,resize:"vertical",menubar:!1,wpautop:!0,wordpress_adv_hidden:!1,indent:!1,toolbar1:"formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,fullscreen,wp_adv",toolbar2:"strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",toolbar3:"",toolbar4:"",tabfocus_elements:":prev,:next",body_class:"id post-type-post post-status-publish post-format-standard"}),tinyMCE.execCommand("mceAddEditor",!1,e)})}function go_make_clickable(){jQuery(".clickable").keyup(function(e){13===e.which&&jQuery("#go_button").click()})}function go_update_admin_view(e){jQuery.ajax({type:"POST",url:MyAjax.ajaxurl,data:{_ajax_nonce:GO_FRONTEND_DATA.nonces.go_update_admin_view,action:"go_update_admin_view",go_admin_view:e},error:function(e,o,t){400===e.status&&jQuery(document).trigger("heartbeat-tick.wp-auth-check",[{"wp-auth-check":!1}])},success:function(e){location.reload()}})}function go_quiz_check_answers(e,o){console.log("go_quiz_check_answers");for(var t=jQuery(o).closest(".go_checks_and_buttons").find(" .go_test_list"),r=t.length,a=[],s=[],n=0;n<r;n++){console.log("Question "+n);var i=t[n].children[1].children[0].type;a.push(i);var _="#"+t[n].id+" :checked",l="#"+t[n].id+" input:not(:checked)",c=jQuery(_),u=jQuery(l);if("radio"==i)console.log("test_type :"+i),null!=c[0]&&s.push(c[0].value);else if("checkbox"==i){for(var g=[],d=0;d<c.length;d++)g.push(c[d].value);s.push(g)}for(var d=0;d<c.length;d++)jQuery(c[d]).addClass("go_quiz_checked");for(var d=0;d<u.length;d++)jQuery(u[d]).removeClass("go_quiz_checked")}var p=s,h=a;jQuery.ajax({type:"POST",data:{_ajax_nonce:go_task_data.go_check_quiz_answers,action:"go_check_quiz_answers",task_id:go_task_data.ID,user_id:go_task_data.userID,list_size:r,chosen_answer:p,type:h,status:e},error:function(e,o,t){400===e.status&&jQuery(document).trigger("heartbeat-tick.wp-auth-check",[{"wp-auth-check":!1}])},success:function(r){if("login"===r&&jQuery(document).trigger("heartbeat-tick.wp-auth-check",[{"wp-auth-check":!1}]),"refresh"==r)location.reload();else if(1==r){var a="#go_test_container_"+(parseFloat(e)+1);console.log("All Correct"),console.log("container_id: "+a),jQuery(".go_test_container").hide("slow"),jQuery("#test_failure_msg").hide("slow"),jQuery(".go_test_submit_div").hide("slow"),jQuery(a+" .go_wrong_answer_marker").hide(),jQuery(a+" .go_correct_answer_marker").show(),jQuery("#go_stage_error_msg").hide(),go_send_save_quiz_result(o,e,function(){task_stage_change(o)}),go_disable_loading()}else if("string"==typeof r){for(var s=JSON.parse(r),n=0;n<t.length;n++){var i=t[n].id;-1===jQuery.inArray(i,s)?(console.log("correct"),jQuery("#"+i+" .go_wrong_answer_marker").hide(),jQuery("#"+i+" .go_correct_answer_marker").show()):(jQuery("#"+i+" .go_correct_answer_marker").hide(),jQuery("#"+i+" .go_wrong_answer_marker").show())}var _;"Try again!"!=jQuery("#go_stage_error_msg").text()?(jQuery(".go_error_msg").show(),jQuery(".go_error_msg").text("Try again!")):flash_error_msg("#go_stage_error_msg"),go_send_save_quiz_result(o,e,function(){}),go_disable_loading()}}})}function go_send_save_quiz_result(e,o,t){var r=jQuery(e).closest(".go_checks_and_buttons").find(" .go_test_container"),a=jQuery(r).clone();jQuery(a).find("input").prop("disabled",!0),jQuery(a).find(".go_quiz_checked").attr("checked","checked");var s=["type","checked","disabled"];jQuery(a).find("input").each(function(){for(var e=this.attributes,o=e.length;o--;){var t=e[o];-1==jQuery.inArray(t.name,s)&&this.removeAttributeNode(t)}});var n=jQuery(a).html();jQuery.ajax({type:"POST",data:{_ajax_nonce:go_task_data.go_save_quiz_result,action:"go_save_quiz_result",html:n,task_id:go_task_data.ID,user_id:go_task_data.userID,status:o},error:function(e,o,t){400===e.status&&jQuery(document).trigger("heartbeat-tick.wp-auth-check",[{"wp-auth-check":!1}])},success:function(){t()}})}function go_make_leaderboard_filter(e){console.log("go_make_leaderboard_filter"),jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{action:"go_make_leaderboard_filter",taxonomy:e},error:function(e,o,t){400===e.status&&jQuery(document).trigger("heartbeat-tick.wp-auth-check",[{"wp-auth-check":!1}])},success:function(o){let t;if("true"!=go_ajax_error_checker(o)){if(-1!==o&&o){var o=JSON.parse(o);go_make_select2_filter(e,!1,!1,!1);let t=o.term_id,s=o.term_name;var r=jQuery("#go_page_"+e+"_select"),a=new Option(s,t,!0,!0);r.append(a).trigger("change.select2"),jQuery("#go_page_"+e+"_select").val(t)}"user_go_sections"===e&&go_make_leaderboard_filter("user_go_groups"),"user_go_groups"===e&&go_stats_leaderboard_page()}}})}function go_stats_leaderboard_page(){console.log("go_stats_leaderboard_page");var e,o=3;1==GO_FRONTEND_DATA.go_is_admin&&(o=4);let t=!1;jQuery(".go_leaderboard_wrapper").show(),leaderboard=jQuery("#go_leaders_datatable").DataTable({processing:!0,serverSide:!0,ajax:{url:MyAjax.ajaxurl+"?action=go_stats_leaderboard_dataloader_ajax",data:function(e){var o=jQuery("#go_page_user_go_sections_select").val(),t=jQuery("#go_page_user_go_groups_select").val();e.section=o,e.group=t}},responsive:!1,autoWidth:!1,paging:!0,order:[[o,"desc"]],drawCallback:function(e){go_stats_links()},searching:!1,columnDefs:[{targets:[0,1,2],sortable:!1},{targets:"_all",type:"natural",sortable:!0,orderSequence:["desc"]}]}),jQuery("#go_page_user_go_sections_select, #go_page_user_go_groups_select").change(function(){console.log("redraw"),jQuery("#go_leaders_datatable").length&&leaderboard.draw()})}jQuery(document).ready(function(){if(jQuery("#go_user_bar").length){var e=jQuery("#go_user_bar_inner ").width()+40,o=e+1;console.log("UBW"+e),document.querySelector("style").textContent+="@media screen and (max-width:"+o+"px) { #go_user_bar .narrow_content  { display: table-cell !important; } #go_user_bar .wide_content {display: none !important;} #go_user_bar {height: 78px !important;} #go_user_bar .go_player_bar_text {display: none !important;}.admin-bar #go_user_bar { top: 46px;}  body{margin-top: 81px !important;} .userbar_dropdown-content {top: 43px !important;}}",document.querySelector("style").textContent+="@media screen and (min-width:"+e+"px) { body{margin-top: 91px !important;}}",jQuery(".userbar_dropdown_toggle.search").on("click",function(){console.log("show search"),jQuery(".userbar_dropdown-content.search").toggle(),jQuery("#go_admin_bar_task_search_input").focus(),jQuery("body").on("click",function(e){console.log("body"),console.log(e.target.id),"userbar_search"!=e.target.id?jQuery(e.target).closest("#userbar_search").length?console.log("2"):(console.log("3"),jQuery(".userbar_dropdown-content.search").toggle(),jQuery("body").off()):console.log("1")})}),jQuery("body").fadeIn(100)}else jQuery("body").show()}),jQuery(document).ready(function(){"undefined"!=typeof is_login_page&&jQuery("#go_save_archive").one("click",function(e){go_save_archive(this)})}),"undefined"!=typeof go_is_reader_or_blog&&jQuery(document).ready(function(){go_loadmore_blog(),go_loadmore_reader()}),jQuery(document).ready(function(){if("undefined"!=typeof go_task_data){console.log("go_tasks_submit READY"),jQuery(".go_quiz_checked").prop("checked",!0),jQuery.ajaxSetup({url:go_task_data.url+="/wp-admin/admin-ajax.php"}),go_make_clickable(),jQuery(".go_stage_message").show();var e=jQuery("#go_select_admin_view").val();console.log(e),jQuery("#go_bonus_button").off().one("click",function(e){go_update_bonus_loot(this)}),jQuery(".progress").closest(".go_checks_and_buttons").addClass("active"),jQuery("#go_admin_override").appendTo(".go_locks"),jQuery("#go_admin_override").click(function(){jQuery(".go_password").show(),jQuery(".go_password #go_result").focus()})}}),jQuery(document).ready(function(){"undefined"!=typeof IsLeaderboard&&go_make_leaderboard_filter("user_go_sections")});