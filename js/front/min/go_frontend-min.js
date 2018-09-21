function go_noty_close_oldest(){Noty.setMaxVisible(6);var e=jQuery("#noty_layout__topRight > div").length;0==e&&jQuery("#noty_layout__topRight").remove(),e>=5&&jQuery("#noty_layout__topRight > div").first().trigger("click")}function go_lightbox_blog_img(){jQuery("[class*= wp-image]").each(function(){if(1==jQuery(this).hasClass("size-full"))var e=jQuery(this).attr("src");else var t=jQuery(this).attr("class"),a=/.*wp-image/,s=t.replace(a,"wp-image"),o=jQuery(this).attr("src"),r=/-([^-]+).$/,i=/\.[0-9a-z]+$/i,n=o.match(i),e=o.replace(r,n);jQuery(this).featherlight(e)})}function go_admin_bar_stats_page_button(e){var t=GO_EVERY_PAGE_DATA.nonces.go_admin_bar_stats;jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:t,action:"go_admin_bar_stats",uid:e},success:function(e){-1!==e&&(jQuery.featherlight(e,{variant:"stats"}),go_stats_task_list(),jQuery("#stats_tabs").tabs(),jQuery(".stats_tabs").click(function(){switch(tab=jQuery(this).attr("tab"),tab){case"about":go_stats_about();break;case"tasks":go_stats_task_list();break;case"store":go_stats_item_list();break;case"history":go_stats_activity_list();break;case"badges":go_stats_badges_list();break;case"groups":go_stats_groups_list();break;case"leaderboard":go_stats_leaderboard();break}}))}})}function go_stats_links(){jQuery(".go_user_link_stats").prop("onclick",null).off("click"),jQuery(".go_user_link_stats").one("click",function(){go_admin_bar_stats_page_button(jQuery(this).attr("name"))})}function go_stats_about(e){console.log("about");var t=GO_EVERY_PAGE_DATA.nonces.go_stats_about;0==jQuery("#go_stats_about").length&&jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:t,action:"go_stats_about",user_id:jQuery("#go_stats_hidden_input").val()},success:function(e){-1!==e&&(console.log(e),console.log("about me"),jQuery("#stats_about").html(e))}})}function go_stats_task_list(){jQuery("#go_task_list_single").remove(),jQuery("#go_task_list").show(),jQuery("#go_tasks_datatable").DataTable().columns.adjust().draw();var e=GO_EVERY_PAGE_DATA.nonces.go_stats_task_list;0==jQuery("#go_tasks_datatable").length&&jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:e,action:"go_stats_task_list",user_id:jQuery("#go_stats_hidden_input").val()},success:function(e){-1!==e&&(jQuery("#stats_tasks").html(e),jQuery("#go_tasks_datatable").dataTable({responsive:!0,autoWidth:!1,order:[[jQuery("th.go_tasks_timestamps").index(),"desc"]],columnDefs:[{targets:"go_tasks_reset",sortable:!1}],drawCallback:function(){var e=jQuery("#go_stats_messages_icon_stats").attr("name");jQuery(".go_reset_task").prop("onclick",null).off("click"),jQuery(".go_reset_task").one("click",function(){go_messages_opener(e,this.id,"reset")}),jQuery(".go_tasks_reset_multiple").prop("onclick",null).off("click"),jQuery(".go_tasks_reset_multiple").one("click",function(){go_messages_opener(e,null,"reset_multiple")})}}))}})}function go_stats_single_task_activity_list(e){var t=GO_EVERY_PAGE_DATA.nonces.go_stats_single_task_activity_list;jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:t,action:"go_stats_single_task_activity_list",user_id:jQuery("#go_stats_hidden_input").val(),postID:e},success:function(e){-1!==e&&(jQuery("#go_task_list_single").remove(),jQuery("#go_task_list").hide(),jQuery("#stats_tasks").append(e),jQuery("#go_single_task_datatable").dataTable({bPaginate:!0,order:[[0,"desc"]],responsive:!0,autoWidth:!1}))}})}function go_stats_item_list(){var e=GO_EVERY_PAGE_DATA.nonces.go_stats_item_list;0==jQuery("#go_store_datatable").length&&jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:e,action:"go_stats_item_list",user_id:jQuery("#go_stats_hidden_input").val()},success:function(e){-1!==e&&(jQuery("#stats_store").html(e),jQuery("#go_store_datatable").dataTable({bPaginate:!0,order:[[0,"desc"]],responsive:!0,autoWidth:!1}))}})}function go_stats_activity_list(){var e=GO_EVERY_PAGE_DATA.nonces.go_stats_activity_list;0==jQuery("#go_activity_datatable").length&&jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:e,action:"go_stats_activity_list",user_id:jQuery("#go_stats_hidden_input").val()},success:function(e){-1!==e&&(jQuery("#stats_history").html(e),jQuery("#go_activity_datatable").dataTable({processing:!0,serverSide:!0,ajax:{url:MyAjax.ajaxurl+"?action=go_activity_dataloader_ajax",data:function(e){e.user_id=jQuery("#go_stats_hidden_input").val()}},responsive:!0,autoWidth:!1,columnDefs:[{targets:"_all",orderable:!1}],searching:!0}))}})}function go_stats_badges_list(){var e=GO_EVERY_PAGE_DATA.nonces.go_stats_badges_list;0==jQuery("#go_badges_list").length&&jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:e,action:"go_stats_badges_list",user_id:jQuery("#go_stats_hidden_input").val()},success:function(e){-1!==e&&jQuery("#stats_badges").html(e)}})}function go_stats_groups_list(){var e=GO_EVERY_PAGE_DATA.nonces.go_stats_groups_list;0==jQuery("#go_groups_list").length&&jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:e,action:"go_stats_groups_list",user_id:jQuery("#go_stats_hidden_input").val()},success:function(e){-1!==e&&jQuery("#stats_groups").html(e)}})}function go_sort_leaders(e,t){var a,s,o,r,i,n,_;for(a=document.getElementById(e),o=!0,console.log("switching");o;){for(o=!1,s=a.getElementsByTagName("TR"),r=1;r<s.length-1;r++)if(_=!1,i=s[r].getElementsByTagName("TD")[t],xVal=i.innerHTML,n=s[r+1].getElementsByTagName("TD")[t],yVal=n.innerHTML,parseInt(xVal)<parseInt(yVal)){_=!0;break}_&&(s[r].parentNode.insertBefore(s[r+1],s[r]),o=!0)}}function go_filter_datatables(){jQuery.fn.dataTable.ext.search.push(function(e,t,a){var s=e.sTableId;if("go_clipboard_stats_datatable"==s||"go_clipboard_messages_datatable"==s||"go_clipboard_activity_datatable"==s){var o=jQuery("#go_clipboard_user_go_sections_select").val(),r=jQuery("#go_clipboard_user_go_groups_select").val(),i=jQuery("#go_clipboard_go_badges_select").val(),n=t[4],_=t[3],l=t[2];console.log("data"+t),console.log("badges"+n),console.log("groups"+_),console.log("sections"+l),_=JSON.parse(_),console.log("groups"+_),n=JSON.parse(n),console.log("badges"+n),console.log("sections"+l);var c=!0;return c="none"==r||-1!=jQuery.inArray(r,_),c&&(c="none"==o||l==o),"go_clipboard_datatable"==s&&c&&(c="none"==i||-1!=jQuery.inArray(i,n)),c}if("go_xp_leaders_datatable"==s||"go_gold_leaders_datatable"==s||"go_c4_leaders_datatable"==s||"go_badges_leaders_datatable"==s){var o=jQuery("#go_user_go_sections_select").val(),r=jQuery("#go_user_go_groups_select").val(),_=t[2],l=t[1];_=JSON.parse(_),l=JSON.parse(l);var c=!0;return c="none"==r||-1!=jQuery.inArray(r,_),c&&(c="none"==o||-1!=jQuery.inArray(o,l)),c}return!0})}function go_stats_leaderboard(){jQuery("#go_stats_lite_wrapper").remove(),jQuery("#go_leaderboard_wrapper").show(),go_filter_datatables();var e=GO_EVERY_PAGE_DATA.nonces.go_stats_leaderboard;0==jQuery("#go_leaderboard_wrapper").length&&(jQuery(".go_leaderboard_wrapper").show(),jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:e,action:"go_stats_leaderboard",user_id:jQuery("#go_stats_hidden_input").val()},success:function(e){console.log("success");var t={};try{var t=JSON.parse(e)}catch(e){console.log("parse_error")}if(jQuery("#stats_leaderboard").html(t.html),console.log("________XP___________"),jQuery("#go_xp_leaders_datatable").length){go_sort_leaders("go_xp_leaders_datatable",4);var a=jQuery("#go_xp_leaders_datatable").DataTable({orderFixed:[[4,"desc"]],responsive:!0,autoWidth:!1,paging:!1,columnDefs:[{targets:[1],visible:!1},{targets:[2],visible:!1}],createdRow:function(e,t,a){jQuery(e).find("td:eq(0)").text(a+1)}})}if(jQuery("#go_gold_leaders_datatable").length){go_sort_leaders("go_gold_leaders_datatable",4);var s=jQuery("#go_gold_leaders_datatable").DataTable({paging:!1,orderFixed:[[4,"desc"]],responsive:!0,autoWidth:!1,columnDefs:[{targets:[1],visible:!1},{targets:[2],visible:!1}],createdRow:function(e,t,a){jQuery(e).find("td:eq(0)").text(a+1)}})}if(jQuery("#go_c4_leaders_datatable").length){go_sort_leaders("go_c4_leaders_datatable",4);var o=jQuery("#go_c4_leaders_datatable").DataTable({paging:!1,orderFixed:[[4,"desc"]],responsive:!0,autoWidth:!1,columnDefs:[{targets:[1],visible:!1},{targets:[2],visible:!1}],createdRow:function(e,t,a){jQuery(e).find("td:eq(0)").text(a+1)}})}if(jQuery("#go_badges_leaders_datatable").length){go_sort_leaders("go_badges_leaders_datatable",4);var r=jQuery("#go_badges_leaders_datatable").DataTable({paging:!1,orderFixed:[[4,"desc"]],responsive:!0,autoWidth:!1,columnDefs:[{targets:[1],visible:!1},{targets:[2],visible:!1}],createdRow:function(e,t,a){jQuery(e).find("td:eq(0)").text(a+1)}})}jQuery("#go_user_go_sections_select, #go_user_go_groups_select").change(function(){jQuery("#go_xp_leaders_datatable").length&&a.draw(),jQuery("#go_gold_leaders_datatable").length&&s.draw(),jQuery("#go_c4_leaders_datatable").length&&o.draw(),jQuery("#go_badges_leaders_datatable").length&&r.draw()})}}))}function go_stats_lite(e){var t=GO_EVERY_PAGE_DATA.nonces.go_stats_lite;jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:t,action:"go_stats_lite",uid:e},success:function(e){-1!==e&&(jQuery("#go_stats_lite_wrapper").remove(),jQuery("#stats_leaderboard").append(e),jQuery("#go_leaderboard_wrapper").hide(),jQuery("#go_tasks_datatable_lite").dataTable({destroy:!0,responsive:!0,autoWidth:!1}))}})}function decimalAdjust(e,t,a){return void 0===a||0==+a?Math[e](t):(t=+t,a=+a,isNaN(t)||"number"!=typeof a||a%1!=0?NaN:(t=t.toString().split("e"),t=Math[e](+(t[0]+"e"+(t[1]?+t[1]-a:-a))),t=t.toString().split("e"),+(t[0]+"e"+(t[1]?+t[1]+a:a))))}function go_lb_opener(e){if(jQuery("#light").css("display","block"),jQuery(".go_str_item").prop("onclick",null).off("click"),"none"==jQuery("#go_stats_page_black_bg").css("display")&&jQuery("#fade").css("display","block"),!jQuery.trim(jQuery("#lb-content").html()).length){var t=e,a=GO_EVERY_PAGE_DATA.nonces.go_the_lb_ajax,s={action:"go_the_lb_ajax",_ajax_nonce:a,the_item_id:t},o="<?php echo admin_url( '/admin-ajax.php' ); ?>";jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:s,beforeSend:function(){jQuery("#lb-content").append('<div class="go-lb-loading"></div>')},cache:!1,success:function(e){jQuery("#lb-content").innerHTML="",jQuery("#lb-content").html(""),jQuery.featherlight(e,{variant:"store"}),jQuery(".go_str_item").one("click",function(e){go_lb_opener(this.id)}),window.go_purchase_limit=jQuery("#golb-fr-purchase-limit").attr("val"),window.go_store_debt_enabled="true"===jQuery(".golb-fr-boxes-debt").val();var t=go_purchase_limit;jQuery("#go_qty").spinner({max:t,min:1,stop:function(){jQuery(this).change()}})}})}}function goBuytheItem(e,t){var a=GO_BUY_ITEM_DATA.nonces.go_buy_item,s=GO_BUY_ITEM_DATA.userID;console.log(s),jQuery(document).ready(function(t){var o={_ajax_nonce:a,action:"go_buy_item",the_id:e,qty:t("#go_qty").val(),user_id:s};t.ajax({url:MyAjax.ajaxurl,type:"POST",data:o,beforeSend:function(){t("#golb-fr-buy").innerHTML="",t("#golb-fr-buy").html(""),t("#golb-fr-buy").append('<div id="go-buy-loading" class="buy_gold"></div>')},success:function(e){var a={};try{var a=JSON.parse(e)}catch(e){a={json_status:"101",html:"101 Error: Please try again."}}-1!==e.indexOf("Error")?t("#light").html(e):t("#light").html(a.html)}})})}function go_count_item(e){var t=GO_BUY_ITEM_DATA.nonces.go_get_purchase_count;jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:{_ajax_nonce:t,action:"go_get_purchase_count",item_id:e},success:function(e){if(-1!==e){var t=e.toString();jQuery("#golb-purchased").html("Quantity purchased: "+t)}}})}function Vids_Fit_and_Box(){runmefirst(function(){Max_width_and_LightboxNow()})}function runmefirst(e){fitVidsNow(),e()}function fitVidsNow(){jQuery("body").fitVids()}function go_video_resize(){var e=jQuery(".featherlight-content .fluid-width-video-wrapper").css("padding-top"),t=jQuery(".featherlight-content .fluid-width-video-wrapper").css("width");e=parseFloat(e),t=parseFloat(t);var a=e/t;console.log("Vratio:"+a);var s=jQuery(window).width();console.log("vW:"+s);var o=s,r=jQuery(window).height();console.log("vH:"+r);var i=s*a;console.log("cH1:"+i),i>r&&(i=r-50,console.log("cH2:"+i),o=i/a,console.log("cW:"+o)),jQuery(".featherlight-content").css("width",o),jQuery(".featherlight-content").css("height",i)}function Max_width_and_LightboxNow(){var e=jQuery("#go_wrapper").data("maxwidth");if(jQuery(".fluid-width-video-wrapper:not(.fit)").each(function(){jQuery(this).wrap('<div class="max-width-video-wrapper" style="position:relative;"><div>'),jQuery(this).addClass("fit"),jQuery(".max-width-video-wrapper").css("max-width",e)}),jQuery(".wp-video:not(.fit)").each(function(){jQuery(this).wrap('<div class="max-width-video-wrapper" style="position:relative;"><div>'),jQuery(this).addClass("fit"),jQuery(".max-width-video-wrapper").css("max-width",e)}),1===jQuery("#go_wrapper").data("lightbox")){jQuery(".max-width-video-wrapper:not(.wrapped):has(iframe)").each(function(){jQuery(this).prepend('<a style="display:block;" class="featherlight_wrapper_iframe" href="#" ><span style="position:absolute; width:100%; height:100%; top:0; left: 0; z-index: 1;"></span></a>'),jQuery(this).addClass("wrapped")}),jQuery('[class^="featherlight_wrapper_iframe"]').each(function(){var e=jQuery(this).parent().find(".fluid-width-video-wrapper").parent().html();jQuery(this).attr("href",'<div id="go_video_container" style=" overflow: hidden;">'+e+"</div>"),jQuery(".featherlight_wrapper_iframe").featherlight({targetAttr:"href",closeOnEsc:!0,variant:"fit_and_box",afterOpen:function(e){jQuery(".featherlight-content").css({width:"100%",overflow:"hidden"}),jQuery(".featherlight-content iframe")[0].src+="&autoplay=1",go_video_resize(),jQuery(window).resize(function(){go_video_resize()})}})});var t=setInterval(function(){jQuery(".max-width-video-wrapper:not(.wrapped):has(video)").length&&(console.log("Exists!"),clearInterval(t),jQuery(".max-width-video-wrapper:not(.wrapped):has(video)").each(function(){var e=jQuery(this).find("video").attr("src");console.log("src:"+e),jQuery(this).prepend('<a href=\'#\' class=\'featherlight_wrapper_vid_shortcode\' data-featherlight=\'<div id="go_video_container" style="height: 90vh; overflow: hidden; text-align: center;"> <video controls autoplay style="height: 100%; max-width: 100%;"><source src="'+e+"\" type=\"video/mp4\">Your browser does not support the video tag.</video></div>'  data-featherlight-close-on-esc='true' data-featherlight-variant='fit_and_box native2' ><span style=\"position:absolute; width:100%; height:100%; top:0; left: 0; z-index: 4;\"></span></a> "),jQuery(this).addClass("wrapped")}))},100)}}function go_blog_opener(e){jQuery("#go_hidden_mce").remove(),jQuery(".go_blog_opener").prop("onclick",null).off("click");var t=jQuery(e).attr("blog_post_id"),a=GO_EVERY_PAGE_DATA.nonces.go_blog_opener,s={action:"go_blog_opener",_ajax_nonce:a,blog_post_id:t};jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:s,cache:!1,success:function(e){jQuery.featherlight(e),tinymce.execCommand("mceRemoveEditor",!0,"go_blog_post"),tinymce.execCommand("mceAddEditor",!1,"go_blog_post"),jQuery(".featherlight").css("background","rgba(0,0,0,.8)"),jQuery(".featherlight .featherlight-content").css("width","80%"),jQuery(".go_blog_opener").one("click",function(e){go_blog_opener(this)})}})}function go_blog_submit(e){var t=GO_EVERY_PAGE_DATA.nonces.go_blog_submit,a=tinyMCE.activeEditor.getContent(),s=jQuery("#go_result_title").attr("value"),o=jQuery(e).attr("blog_post_id"),r={action:"go_blog_submit",_ajax_nonce:t,result:a,result_title:s,blog_post_id:o};jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:r,cache:!1,success:function(){console.log("success"),location.reload()}})}function go_messages_opener(e,t,a){if(t=void 0!==t?t:null,a=void 0!==a?a:null,jQuery(".go_messages_icon").prop("onclick",null).off("click"),jQuery(".go_stats_messages_icon").prop("onclick",null).off("click"),jQuery(".go_reset_task").prop("onclick",null).off("click"),jQuery(".go_tasks_reset").prop("onclick",null).off("click"),jQuery(".go_tasks_reset_multiple").prop("onclick",null).off("click"),e)var s=[e];else for(var o=jQuery(".go_checkbox:visible"),s=[],r=0;r<o.length;r++)!0===o[r].checked&&s.push(jQuery(o[r]).val());if(null==t&&"reset_multiple"==a)for(var o=jQuery(".go_checkbox:visible"),i=[],r=0;r<o.length;r++)!0===o[r].checked&&i.push(jQuery(o[r]).val());else var i=[t];var n=GO_EVERY_PAGE_DATA.nonces.go_create_admin_message,_={action:"go_create_admin_message",_ajax_nonce:n,post_id:i,user_ids:s,message_type:a};jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:_,success:function(t){jQuery.featherlight(t,{variant:"message"}),jQuery(".go_tax_select").select2(),jQuery("#go_message_submit").one("click",function(e){go_send_message(s,i,a)}),jQuery(".go_messages_icon").one("click",function(e){go_messages_opener()}),jQuery(".go_stats_messages_icon").one("click",function(e){go_messages_opener(jQuery(this).attr("name"))});var o=jQuery("#go_stats_messages_icon_stats").attr("name");jQuery(".go_reset_task").one("click",function(e){go_messages_opener(o,this.id,"reset")}),jQuery(".go_tasks_reset_multiple").one("click",function(){go_messages_opener(e,null,"reset_multiple")})},error:function(e,t,a){jQuery(".go_messages_icon").one("click",function(e){go_messages_opener()});var s=jQuery("#go_stats_messages_icon_stats").attr("name");jQuery("#go_stats_messages_icon").one("click",function(e){go_messages_opener(s)}),jQuery(".go_reset_task").one("click",function(e){go_messages_opener(s,this.id,"reset")})}})}function go_send_message(e,t,a){var s=jQuery("[name=title]").val(),o=jQuery("[name=message]").val(),r=jQuery("[name=xp_toggle]").siblings().hasClass("-on")?1:-1,i=jQuery("[name=xp]").val()*r,n=jQuery("[name=gold_toggle]").siblings().hasClass("-on")?1:-1,_=jQuery("[name=gold]").val()*n,l=jQuery("[name=health_toggle]").siblings().hasClass("-on")?1:-1,c=jQuery("[name=health]").val()*l,u=jQuery("[name=c4_toggle]").siblings().hasClass("-on")?1:-1,d=jQuery("[name=c4]").val()*u,g=jQuery("#go_messages_go_badges_select").val(),p=jQuery("[name=badges_toggle]").siblings().hasClass("-on"),y=jQuery("#go_messages_user_go_groups_select").val(),h=jQuery("[name=groups_toggle]").siblings().hasClass("-on"),j=GO_EVERY_PAGE_DATA.nonces.go_send_message,b={action:"go_send_message",_ajax_nonce:j,post_id:t,user_ids:e,message_type:a,title:s,message:o,xp:i,gold:_,health:c,c4:d,badges_toggle:p,badges:g,groups_toggle:h,groups:y};jQuery.ajax({url:MyAjax.ajaxurl,type:"POST",data:b,success:function(e){jQuery("#go_messages_container").html("Message sent successfully."),jQuery("#go_tasks_datatable").remove(),go_stats_task_list(),go_toggle_off()},error:function(e,t,a){jQuery("#go_messages_container").html("Error.")}})}function go_toggle(e){checkboxes=jQuery(".go_checkbox");for(var t=0,a=checkboxes.length;t<a;t++)checkboxes[t].checked=e.checked}function go_toggle_off(){checkboxes=jQuery(".go_checkbox");for(var e=0,t=checkboxes.length;e<t;e++)checkboxes[e].checked=!1}function go_clipboard_class_a_choice(){if(go_filter_datatables(),jQuery("#go_clipboard_stats_datatable").length){var e=jQuery("#go_clipboard_stats_datatable").DataTable({bPaginate:!1,order:[[5,"asc"]],responsive:!0,autoWidth:!1,stateSave:!0,dom:"Bfrtip",drawCallback:function(e){jQuery(".go_messages_icon").prop("onclick",null).off("click"),jQuery(".go_messages_icon").one("click",function(e){go_messages_opener()}),go_stats_links()},columnDefs:[{type:"natural",targets:"_all"},{targets:[0],className:"noVis",width:"1px",sortable:!1},{targets:[1],className:"noVis",width:"20px",sortable:!1},{targets:[2],visible:!1,className:"noVis"},{targets:[3],visible:!1,className:"noVis"},{targets:[4],visible:!1,className:"noVis"},{targets:[7],className:"noVis"},{targets:[8],className:"noVis"},{targets:[10],className:"noVis",sortable:!1}],buttons:[{text:'<span class="go_messages_icon">Message <i class="fa fa-bullhorn" aria-hidden="true"></i><span></span>',action:function(e,t,a,s){}},{extend:"collection",text:"Export ...",buttons:[{extend:"pdf",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"},orientation:"landscape"},{extend:"excel",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"}},{extend:"csv",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"}}]},{extend:"colvis",columns:":not(.noVis)",postfixButtons:["colvisRestore"],text:"Column Visibility"}]});jQuery("#go_clipboard_user_go_sections_select, #go_clipboard_user_go_groups_select, #go_clipboard_go_badges_select").change(function(){e.draw();var t=GO_CLIPBOARD_DATA.nonces.go_clipboard_save_filters,a=jQuery("#go_clipboard_user_go_sections_select").val(),s=jQuery("#go_clipboard_user_go_groups_select").val(),o=jQuery("#go_clipboard_go_badges_select").val();jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:t,action:"go_clipboard_save_filters",section:a,badge:o,group:s},success:function(e){}})}),jQuery("#records_tabs").css("margin-left","")}jQuery("#go_clipboard_stats_datatable").DataTable().columns.adjust().responsive.recalc()}function go_clipboard_class_a_choice_activity(e){if(0==jQuery("#go_clipboard_activity_datatable").length||1==e){var t=GO_CLIPBOARD_DATA.nonces.go_clipboard_intable_activity,a=jQuery(".datepicker").val();jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:t,action:"go_clipboard_intable_activity",go_clipboard_class_a_choice_activity:jQuery("#go_clipboard_class_a_choice_activity").val(),date:jQuery(".datepicker").val()},success:function(e){if(-1!==e){jQuery("#clipboard_activity_datatable_container").html(e);var t=jQuery("#go_clipboard_activity_datatable").DataTable({bPaginate:!1,order:[[4,"asc"]],responsive:!0,autoWidth:!1,stateSave:!0,dom:"Bfrtip",drawCallback:function(e){jQuery(".go_messages_icon").prop("onclick",null).off("click"),jQuery(".go_messages_icon").one("click",function(e){go_messages_opener()}),go_stats_links()},columnDefs:[{type:"natural",targets:"_all"},{targets:[0],className:"noVis",width:"5px",sortable:!1},{targets:[1],className:"noVis",width:"20px",sortable:!1},{targets:[2],visible:!1,className:"noVis"},{targets:[3],visible:!1,className:"noVis"},{targets:[4],visible:!1,className:"noVis"},{targets:[7],className:"noVis"},{targets:[8],className:"noVis"},{targets:[10],className:"noVis",sortable:!1}],buttons:[{text:'<span class="go_messages_icon">Message <i class="fa fa-bullhorn" aria-hidden="true"></i><span></span>',action:function(e,t,a,s){}},{extend:"collection",text:"Export ...",buttons:[{extend:"pdf",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"},orientation:"landscape"},{extend:"excel",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"}},{extend:"csv",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"}}]},{extend:"colvis",columns:":not(.noVis)",postfixButtons:["colvisRestore"],text:"Column Visibility"}]});jQuery("#go_timestamp_filters").show(),jQuery("#go_clipboard_user_go_sections_select, #go_clipboard_user_go_groups_select, #go_clipboard_go_badges_select").change(function(){t.draw()}),jQuery("#go_clipboard_activity_datatable .show_more").click(function(){0==jQuery(this).hasClass("shown")?(jQuery(this).addClass("shown"),jQuery(this).siblings(".hidden_action").show(),jQuery(this).find(".hide_more_actions").show(),jQuery(this).find(".show_more_actions").hide()):(jQuery(this).removeClass("shown"),jQuery(this).siblings(".hidden_action").hide(),jQuery(this).find(".hide_more_actions").hide(),jQuery(this).find(".show_more_actions").show())})}}})}}function go_hide_child_tax_acfs(){-1==jQuery(".taxonomy-task_chains #parent, .taxonomy-go_badges #parent").val()?(jQuery(".go_child_term").hide(),jQuery("#go_map_shortcode_id").show()):(jQuery(".go_child_term").show(),jQuery("#go_map_shortcode_id").hide());var e=jQuery('[name="tag_ID"]').val();null==e&&jQuery("#go_map_shortcode_id").hide();var t=jQuery("#post_ID").val();jQuery("#go_store_item_id .acf-input").html('[go_store id="'+t+'"]');var a=jQuery("#name").val();jQuery("#go_map_shortcode_id .acf-input").html('Place this code in a content area to link directly to this map.<br><br>[go_single_map_link map_id="'+e+'"]'+a+"[/go_single_map_link]"),null==e&&jQuery("#go_map_shortcode_id").hide()}String.prototype.getMid=function(e,t){if("string"==typeof e&&"string"==typeof t){var a=e.length,s=this.length-(e.length+t.length);return this.substr(a,s)}},Math.round10||(Math.round10=function(e,t){return decimalAdjust("round",e,t)}),Math.floor10||(Math.floor10=function(e,t){return decimalAdjust("floor",e,t)}),Math.ceil10||(Math.ceil10=function(e,t){return decimalAdjust("ceil",e,t)}),jQuery.prototype.go_prev_n=function(e,t){if(void 0===e)return null;"int"!=typeof e&&(e=Number.parseInt(e));for(var a=null,s=0;s<e;s++)if(0===s)a=void 0!==t?jQuery(this).prev(t):jQuery(this).prev();else{if(null===a)break;a=void 0!==t?jQuery(a).prev(t):jQuery(a).prev()}return a},jQuery(document).ready(function(){jQuery(".go_str_item").one("click",function(e){go_lb_opener(this.id)})}),jQuery(window).ready(function(){Vids_Fit_and_Box()}),function($){"use strict";$.fn.fitVids=function(e){var t={customSelector:null,ignore:null};if(!document.getElementById("fit-vids-style")){var a=document.head||document.getElementsByTagName("head")[0],s=document.createElement("div");s.innerHTML='<p>x</p><style id="fit-vids-style">'+".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}"+"</style>",a.appendChild(s.childNodes[1])}return e&&$.extend(t,e),this.each(function(){var e=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object","embed"];t.customSelector&&e.push(t.customSelector);var a=".fitvidsignore";t.ignore&&(a=a+", "+t.ignore);var s=$(this).find(e.join(","));s=s.not("object object"),s=s.not(a),s.each(function(){var e=$(this);if(!(e.parents(a).length>0||"embed"===this.tagName.toLowerCase()&&e.parent("object").length||e.parent(".fluid-width-video-wrapper").length)){e.css("height")||e.css("width")||!isNaN(e.attr("height"))&&!isNaN(e.attr("width"))||(e.attr("height",9),e.attr("width",16));var t="object"===this.tagName.toLowerCase()||e.attr("height")&&!isNaN(parseInt(e.attr("height"),10))?parseInt(e.attr("height"),10):e.height(),s=isNaN(parseInt(e.attr("width"),10))?e.width():parseInt(e.attr("width"),10),o=t/s;if(!e.attr("name")){var r="fitvid"+$.fn.fitVids._count;e.attr("name",r),$.fn.fitVids._count++}e.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*o+"%"),e.removeAttr("height").removeAttr("width")}})})},$.fn.fitVids._count=0}(window.jQuery||window.Zepto),jQuery(document).ready(function(){jQuery("#records_tabs").length&&(jQuery("#records_tabs").tabs(),jQuery(".clipboard_tabs").click(function(){switch(tab=jQuery(this).attr("tab"),tab){case"activity":go_clipboard_class_a_choice_activity(),jQuery("#go_clipboard_activity_datatable").DataTable().columns.adjust().responsive.recalc();break;case"clipboard":jQuery("#go_clipboard_stats_datatable").DataTable().columns.adjust().responsive.recalc();break}})),jQuery("#go_clipboard_stats_datatable").length&&(go_clipboard_class_a_choice(),jQuery(".datepicker").datepicker({firstDay:0}),jQuery(".datepicker").datepicker("setDate",new Date),jQuery(".datepicker").change(function(){jQuery("#go_clipboard_activity_datatable").html("<div id='loader' style='font-size: 1.5em; text-align: center; height: 200px'>loading . . .</div>"),go_clipboard_class_a_choice_activity(!0)}),jQuery(".go_datepicker_refresh").click(function(){jQuery("#go_clipboard_activity_datatable").html("<div id='loader' style='font-size: 1.5em; text-align: center; height: 200px'>loading . . .</div>"),go_clipboard_class_a_choice_activity(!0)}))}),jQuery("input,select").bind("keydown",function(e){13===(e.keyCode||e.which)&&(e.preventDefault(),jQuery("input, select, textarea")[jQuery("input,select,textarea").index(this)+1].focus())}),jQuery(document).ready(function(){go_hide_child_tax_acfs(),jQuery(".taxonomy-task_chains #parent, .taxonomy-go_badges #parent").change(function(){go_hide_child_tax_acfs()})});