function getTimeRemaining(e){var r=Date.parse(e)-Date.parse(new Date),t=Math.floor(r/1e3%60),o=Math.floor(r/1e3/60%60),a=Math.floor(r/36e5%24);return{total:r,days:Math.floor(r/864e5),hours:a,minutes:o,seconds:t}}function initializeClock(e,r){function t(){var e=getTimeRemaining(r);if(e.days=Math.max(0,e.days),a.innerHTML=e.days,e.hours=Math.max(0,e.hours),s.innerHTML=("0"+e.hours).slice(-2),e.minutes=Math.max(0,e.minutes),_.innerHTML=("0"+e.minutes).slice(-2),e.seconds=Math.max(0,e.seconds),n.innerHTML=("0"+e.seconds).slice(-2),e.total=0){clearInterval(u);new Audio(PluginDir.url+"media/airhorn.mp3").play()}}var o=document.getElementById(e),a=o.querySelector(".days"),s=o.querySelector(".hours"),_=o.querySelector(".minutes"),n=o.querySelector(".seconds");t();var g=getTimeRemaining(r),i=g.total;if(console.log(g.total),i>0)var u=setInterval(t,1e3)}function go_task_abandon(){jQuery.ajax({type:"POST",data:{_ajax_nonce:go_task_data.go_taskabandon_nonce,action:"go_task_abandon",user_id:go_task_data.userID,post_id:go_task_data.ID,encounter_points:go_task_data.pointsFloor,encounter_currency:go_task_data.currencyFloor,encounter_bonus:go_task_data.bonusFloor},success:function(e){-1!==e&&(window.location=go_task_data.homeURL)}})}function go_timer_abandon(){$homeURL=go_task_data.homeURL,window.location=$homeURL}function check_locks(){0!=jQuery(".go_test_list").length&&jQuery(".go_test_submit_div").show();var e=jQuery("#go_upload_form").attr("uploaded");if(0!=jQuery(".go_test_list").length&&0!=jQuery("#go_upload_form").length)0==jQuery("#go_pass_lock").length&&"true"!==jQuery("#go_button").attr("admin_lock")&&jQuery("#go_button").attr("disabled","true"),jQuery(".go_test_submit").click(function(){var r=jQuery(".go_test_list"),t=jQuery("#go_test_error_msg").text();if(r.length>1){for(var o=0,a=0;a<r.length;a++){var s="#"+r[a].id+" input:checked";jQuery(s).length>=1?o++:("Please answer all questions!"!=t?jQuery("#go_test_error_msg").text("Please answer all questions!"):flash_error_msg("#go_test_error_msg"),go_disable_loading())}if(o>=r.length&&1==e)task_unlock();else{if(o<r.length&&1!=e)var _="Please answer all questions and upload a file!";else if(o<r.length)var _="Please answer all questions!";else if(1!=e)var _="Please upload a file!";null!=typeof _&&(t!=_?jQuery("#go_test_error_msg").text(_):flash_error_msg("#go_test_error_msg"),go_disable_loading())}}else if(jQuery(".go_test_list input:checked").length>=1&&1==e)task_unlock();else{if(0==jQuery(".go_test_list input:checked").length&&1!=e)var _="Please answer the question and upload a file!";else if(0==jQuery(".go_test_list input:checked").length)var _="Please answer the question!";else if(1!=e)var _="Please upload a file!";null!=typeof _&&(t!=_?jQuery("#go_test_error_msg").text(_):flash_error_msg("#go_test_error_msg"),go_disable_loading())}}),jQuery("#go_upload_submit").click(function(){var r=jQuery(".go_test_list"),t=jQuery("#go_test_error_msg").text();if(r.length>1){for(var o=0,a=0;a<r.length;a++){var s="#"+r[a].id+" input:checked";jQuery(s).length>=1?o++:("Please answer all questions!"!=t?jQuery("#go_test_error_msg").text("Please answer all questions!"):flash_error_msg("#go_test_error_msg"),go_disable_loading())}if(o>=r.length&&1==e)task_unlock();else{if(o<r.length&&1!=e)var _="Please answer all questions and upload a file!";else if(o<r.length)var _="Please answer all questions!";else if(1!=e)var _="Please upload a file!";null!=typeof _&&(t!=_?jQuery("#go_test_error_msg").text(_):flash_error_msg("#go_test_error_msg"),go_disable_loading())}}else if(jQuery(".go_test_list input:checked").length>=1&&1==e)task_unlock();else{if(0==jQuery(".go_test_list input:checked").length&&1!=e)var _="Please answer the question and upload a file!";else if(0==jQuery(".go_test_list input:checked").length)var _="Please answer the question!";else if(1!=e)var _="Please upload a file!";null!=typeof _&&(t!=_?jQuery("#go_test_error_msg").text(_):flash_error_msg("#go_test_error_msg"),go_disable_loading())}});else if(0!=jQuery(".go_test_list").length)0==jQuery("#go_pass_lock").length&&"true"!==jQuery("#go_button").attr("admin_lock")&&jQuery("#go_button").attr("disabled","true"),jQuery(".go_test_submit").click(function(){var e=jQuery(".go_test_list");if(e.length>1){for(var r=0,t=0;t<e.length;t++){var o="#"+e[t].id+" input:checked";jQuery(o).length>=1&&r++}r>=e.length?task_unlock():("Please answer all questions!"!=jQuery("#go_test_error_msg").text()?jQuery("#go_test_error_msg").text("Please answer all questions!"):flash_error_msg("#go_test_error_msg"),go_disable_loading())}else jQuery(".go_test_list input:checked").length>=1?task_unlock():("Please answer the question!"!=jQuery("#go_test_error_msg").text()?jQuery("#go_test_error_msg").text("Please answer the question!"):flash_error_msg("#go_test_error_msg"),go_disable_loading())});else if(0!=jQuery("#go_upload_form").length&&0==e)0==jQuery("#go_pass_lock").length&&"true"!==jQuery("#go_button").attr("admin_lock")&&jQuery("#go_button").attr("disabled","true"),jQuery("#go_upload_submit").click(function(){if(jQuery("#go_pass_lock").length>0&&0==jQuery("#go_pass_lock").attr("value").length){var e="Retrieve the password from "+go_task_data.admin_name+".";jQuery("#go_stage_error_msg").text()!=e?jQuery("#go_stage_error_msg").text(e):flash_error_msg("#go_stage_error_msg"),go_disable_loading()}else task_unlock()});else if((jQuery("#go_pass_lock").length>0&&0==jQuery("#go_pass_lock").attr("value").length&&0!=jQuery("#go_upload_form").length&&0==e||0!=jQuery(".go_test_list").length)&&jQuery("#go_stage_error_msg").is(":visible")){var r="Retrieve the password from "+go_task_data.admin_name+".";jQuery("#go_stage_error_msg").text()!=r?jQuery("#go_stage_error_msg").text(r):flash_error_msg("#go_stage_error_msg"),go_disable_loading()}}function flash_error_msg(e){var r=jQuery(e).css("background-color");void 0===typeof r&&(r="white"),jQuery(e).animate({color:r},200,function(){jQuery(e).animate({color:"red"},200)})}function task_unlock(e,r){var t=jQuery(".go_test_list"),o=t.length;if(jQuery(".go_test_list :checked").length>=o){var a=[];if(jQuery(".go_test_list").length>1){for(var s=[],_=0;_<o;_++){var n=t[_].children[1].children[0].type;a.push(n);var g="#"+t[_].id+" :checked",i=jQuery(g);if("radio"==n)void 0!=i[0]&&s.push(i[0].value);else if("checkbox"==n){for(var u=[],l=0;l<i.length;l++)u.push(i[l].value);var d=u.join("### ");s.push(d)}}var c=s.join("#### "),y=a.join("### ")}else{var h=jQuery(".go_test_list li input:checked"),y=jQuery(".go_test_list li input").first().attr("type");if("radio"==y)var c=h[0].value;else if("checkbox"==y){for(var c=[],l=0;l<h.length;l++)c.push(h[l].value);c=c.join("### ")}}}jQuery.ajax({type:"POST",data:{_ajax_nonce:go_task_data.go_unlock_stage,action:"go_unlock_stage",task_id:go_task_data.ID,user_id:go_task_data.userID,list_size:o,chosen_answer:c,type:y,status:e},success:function(e){if("refresh"==e)location.reload();else{if(1==e)return jQuery(".go_test_container").hide("slow"),jQuery("#test_failure_msg").hide("slow"),jQuery(".go_test_submit_div").hide("slow"),jQuery(".go_wrong_answer_marker").hide(),jQuery("#go_stage_error_msg").hide(),console.log(r),void task_stage_change(r);if(0==e)return jQuery("#go_stage_error_msg").show(),jQuery("#go_stage_error_msg").text("Wrong answer, try again!"),void go_disable_loading();if("string"==typeof e&&o>1){for(var a=e.split(", "),s=0;s<t.length;s++){var _="#"+t[s].id;-1===jQuery.inArray(_,a)?(jQuery(_+" .go_wrong_answer_marker").is(":visible")&&jQuery(_+" .go_wrong_answer_marker").hide(),jQuery(_+" .go_correct_answer_marker").is(":visible")||jQuery(_+" .go_correct_answer_marker").show()):(jQuery(_+" .go_correct_answer_marker").is(":visible")&&jQuery(_+" .go_correct_answer_marker").hide(),jQuery(_+" .go_wrong_answer_marker").is(":visible")||jQuery(_+" .go_wrong_answer_marker").show())}"Wrong answer, try again!"!=jQuery("#go_stage_error_msg").text()?(jQuery("#go_stage_error_msg").show(),jQuery("#go_stage_error_msg").text("Wrong answer, try again!")):flash_error_msg("#go_stage_error_msg"),go_disable_loading()}}}})}function go_test_point_update(){if("on"!==jQuery("#go_button").attr("repeat"))var e=jQuery("#go_button").attr("status")-2;else var e=jQuery("#go_button").attr("status")-1;jQuery.ajax({type:"POST",data:{_ajax_nonce:go_task_data.go_test_point_update,action:"go_test_point_update",points:go_task_data.points_str,currency:go_task_data.currency_str,bonus_currency:go_task_data.bonus_currency_str,status:e,page_id:go_task_data.page_id,user_id:go_task_data.userID,post_id:go_task_data.ID,update_percent:go_task_data.date_update_percent},success:function(e){if(-1!==e){var r=jQuery("#go_admin_bar_progress_bar").css("background-color");jQuery("#go_content").append(e),jQuery("#go_admin_bar_progress_bar").css({"background-color":r})}}})}function go_repeat_replace(){jQuery("#go_repeat_unclicked").remove(),jQuery("#go_repeat_clicked").show("slow")}function go_enable_loading(e){jQuery("#go_button").prop("disabled",!0),jQuery("#go_back_button").attr("onclick",null,null),e.innerHTML='<span class="go_loading"></span>'+e.innerHTML}function go_disable_loading(){jQuery("#go_button .go_loading").remove(),jQuery("#go_button").prop("disabled","")}function task_stage_check_input(e){console.log("button clicked"),go_enable_loading(e);var r="";void 0!==jQuery(e).attr("button_type")&&(r=jQuery(e).attr("button_type"));var t="";void 0!==jQuery(e).attr("status")&&(t=jQuery(e).attr("status"));var o="";if(void 0!==jQuery(e).attr("check_type")&&(o=jQuery(e).attr("check_type")),"continue"==r||"complete"==r||"continue_bonus"==r||"complete_bonus"==r)if("password"==o){var a=jQuery("#go_result").attr("value").length>0;if(!a){jQuery("#go_stage_error_msg").show();var s="Retrieve the password from "+go_task_data.admin_name+".";return jQuery("#go_stage_error_msg").text()!=s?jQuery("#go_stage_error_msg").text(s):flash_error_msg("#go_stage_error_msg"),void go_disable_loading()}}else if("URL"==o){var _=jQuery("#go_result").attr("value").replace(/\s+/,"");if(!(_.length>0)){jQuery("#go_stage_error_msg").show();var s="Enter a valid URL.";return jQuery("#go_stage_error_msg").text()!=s?jQuery("#go_stage_error_msg").text(s):flash_error_msg("#go_stage_error_msg"),void go_disable_loading()}if(!_.match(/^(http:\/\/|https:\/\/).*\..*$/)||_.lastIndexOf("http://")>0||_.lastIndexOf("https://")>0){jQuery("#go_stage_error_msg").show();var s="Enter a valid URL.";return jQuery("#go_stage_error_msg").text()!=s?jQuery("#go_stage_error_msg").text(s):flash_error_msg("#go_stage_error_msg"),void go_disable_loading()}var n=!0}else if("upload"==o){var g=jQuery("#go_result").attr("value");if(void 0==g){jQuery("#go_stage_error_msg").show();var s="Please attach a file.";return jQuery("#go_stage_error_msg").text()!=s?jQuery("#go_stage_error_msg").text(s):flash_error_msg("#go_stage_error_msg"),void go_disable_loading()}}else if("quiz"==o){var i=jQuery(".go_test_list");if(i.length>=1){for(var u=0,l=0;l<i.length;l++){var d="#"+i[l].id+" input:checked",c=jQuery(d);c.length>=1&&u++}return u>=i.length?(task_unlock(t,e),void go_disable_loading()):i.length>1?(jQuery("#go_stage_error_msg").show(),"Please answer all questions!"!=jQuery("#go_stage_error_msg").text()?jQuery("#go_stage_error_msg").text("Please answer all questions!"):flash_error_msg("#go_stage_error_msg"),void go_disable_loading()):(jQuery("#go_stage_error_msg").show(),"Please answer the question!"!=jQuery("#go_stage_error_msg").text()?jQuery("#go_stage_error_msg").text("Please answer the question!"):flash_error_msg("#go_stage_error_msg"),void go_disable_loading())}}task_stage_change(e)}function task_stage_change(e){var r="";void 0!==jQuery(e).attr("button_type")&&(r=jQuery(e).attr("button_type"));var t="";void 0!==jQuery(e).attr("status")&&(t=jQuery(e).attr("status"));var o=jQuery("#go_admin_bar_progress_bar").css("background-color"),a=jQuery("#go_result").attr("value");jQuery.ajax({type:"POST",data:{_ajax_nonce:go_task_data.go_task_change_stage,action:"go_task_change_stage",post_id:go_task_data.ID,user_id:go_task_data.userID,status:t,button_type:r,result:a},success:function(e){var r={};try{var r=JSON.parse(e)}catch(e){r={json_status:"101",notification:"",undo:"",timer_start:"",button_type:"",time_left:"",html:"",rewards:{gold:0}}}if("101"===Number.parseInt(r.json_status)){console.log(101),jQuery("#go_stage_error_msg").show();var t="Server Error.";jQuery("#go_stage_error_msg").text()!=t?jQuery("#go_stage_error_msg").text(t):flash_error_msg("#go_stage_error_msg"),go_disable_loading()}else if(302===Number.parseInt(r.json_status))console.log(302),window.location=r.location;else if("refresh"==r.json_status)location.reload();else if("bad_password"==r.json_status){jQuery("#go_stage_error_msg").show();var t="Invalid password.";jQuery("#go_stage_error_msg").text()!=t?jQuery("#go_stage_error_msg").text(t):flash_error_msg("#go_stage_error_msg"),go_disable_loading()}else{if("undo"==r.button_type)jQuery("#go_wrapper div").last().hide(),jQuery("#go_wrapper > div").slice(-3).hide("slow",function(){jQuery(this).remove()}),go_append(r);else if("undo_last"==r.button_type)jQuery("#go_wrapper div").last().hide(),jQuery("#go_wrapper > div").slice(-2).hide("slow",function(){jQuery(this).remove()}),go_append(r);else if("continue"==r.button_type)jQuery("#go_wrapper > div").slice(-1).hide("slow",function(){jQuery(this).remove()}),go_append(r);else if("complete"==r.button_type)jQuery("#go_wrapper > div").slice(-1).hide("slow",function(){jQuery(this).remove()}),go_append(r);else if("show_bonus"==r.button_type)jQuery("#go_buttons").remove(),go_append(r);else if("continue_bonus"==r.button_type)jQuery("#go_wrapper > div").slice(-1).hide("slow",function(){jQuery(this).remove()}),go_append(r);else if("complete_bonus"==r.button_type)jQuery("#go_wrapper > div").slice(-1).hide("slow",function(){jQuery(this).remove()}),go_append(r);else if("undo_bonus"==r.button_type)jQuery("#go_wrapper > div").slice(-2).hide("slow",function(){jQuery(this).remove()}),go_append(r);else if("abandon_bonus"==r.button_type)jQuery("#go_wrapper > div").slice(-3).hide("slow",function(){jQuery(this).remove()}),go_append(r);else if("timer"==r.button_type){jQuery("#go_wrapper > div").slice(-1).hide("slow",function(){jQuery(this).remove()}),go_append(r),initializeClock("clockdiv",deadline),initializeClock("go_timer",deadline);var a=new Audio(PluginDir.url+"media/airhorn.mp3");a.play()}jQuery("#notification").html(r.notification),jQuery("#go_admin_bar_progress_bar").css({"background-color":o}),jQuery("#go_button").ready(function(){check_locks()}),0!==r.rewards.gold&&go_sounds("store")}}})}function go_append(e){jQuery(e.html).appendTo("#go_wrapper").show("slow"),Vids_Fit_and_Box(),go_make_clickable()}function go_make_clickable(){jQuery(".clickable").keyup(function(e){13===e.which&&jQuery("#go_button").click()})}function go_update_admin_view(e){jQuery.ajax({type:"POST",url:MyAjax.ajaxurl,data:{_ajax_nonce:GO_EVERY_PAGE_DATA.nonces.go_update_admin_view,action:"go_update_admin_view",go_admin_view:e},success:function(e){location.reload()},error:function(e){console.log(e),console.log("fail")}})}jQuery(document).ready(function(){jQuery.ajaxSetup({url:go_task_data.url+="/wp-admin/admin-ajax.php"}),check_locks();var e=go_task_data.status,r=go_task_data.currency;0===e&&r>0&&go_sounds("store"),go_make_clickable(),jQuery(".go_stage_message").show("slow"),jQuery(".go_checks_and_buttons").show("slow")});