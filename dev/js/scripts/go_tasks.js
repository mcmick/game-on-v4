//this needs to be run on both task and blog pages
//it has the code to verify the blog content
//and assign the click to the opener
jQuery( document ).ready( function() {

    if (typeof (go_task_data) !== 'undefined') {
        console.log("go_tasks_submit READY");
        //add onclick to blog edit buttons
        //console.log("opener3");
        //jQuery(".go_blog_opener").one("click", function(e){
        //    go_blog_opener( this );
        //});


        jQuery(".go_quiz_checked").prop("checked", true);

        jQuery.ajaxSetup({
            url: go_task_data.url += '/wp-admin/admin-ajax.php'
        });


        go_make_clickable();
        jQuery(".go_stage_message").show();

        var go_select_admin_view = jQuery('#go_select_admin_view').val();

        //add onclick to bonus loot buttons
        jQuery("#go_bonus_button").off().one("click", function (e) {
            go_update_bonus_loot(this);
        });

        //add active class to checks and buttons
        jQuery(".progress").closest(".go_checks_and_buttons").addClass('active');

        jQuery('#go_admin_override').appendTo(".go_locks");

        jQuery('#go_admin_override').click(function () {
            jQuery('.go_password').show();
            jQuery('.go_password #go_result').focus();
        });

        /*if(go_select_admin_view != "guest") {
            jQuery('.summernote').summernote({
                toolbar: [
                    // [groupName, [list of button]]
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    //['font', ['strikethrough', 'superscript', 'subscript']],
                    ['fontsize', ['fontsize']],
                    // ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    //['height', ['height']]
                    ['insert', ['link']],
                ]
            });
        }*/

        go_actions_tooltip();

    }
});

function go_update_bonus_loot(){
    var loader_html = go_loader_html('big');
    jQuery('#go_bonus_loot_mysterybox').html(loader_html);
    var nonce = GO_EVERY_PAGE_DATA.nonces.go_update_bonus_loot;
    var post_id = go_task_data.ID;
    //alert (post_id);
    jQuery.ajax({
        type: "post",
        url: MyAjax.ajaxurl,
        data: {
            _ajax_nonce: nonce,
            action: 'go_update_bonus_loot',
            is_frontend: is_frontend,
            post_id: post_id
        },
        /**
         * A function to be called if the request fails.
         * Assumes they are not logged in and shows the login message in lightbox
         */
        error: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400){
                jQuery(document).trigger('heartbeat-tick.wp-auth-check', [ {'wp-auth-check': false} ]);
            }
        },
        success: function( res ) {
            console.log("Bonus Loot");
            //console.log(res);
            jQuery("#go_bonus_loot").html(res);
            //jQuery("#go_wrapper").append(res);

        }
    });
}

//For the Timer (v4)
function getTimeRemaining(endtime) {
    var t = endtime - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

//Initializes the new timer (v4)
function initializeClock(id, endtime) {
    console.log("initializeClock");
    endtime = endtime + Date.parse(new Date());
    var clock = document.getElementById(id);
    var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    function updateClock() {

        var t = getTimeRemaining(endtime);
        t.days = Math.max(0, t.days);
        daysSpan.innerHTML = t.days;
        t.hours = Math.max(0, t.hours);
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        t.minutes = Math.max(0, t.minutes);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        t.seconds = Math.max(0, t.seconds);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total = 0) {
            clearInterval(timeinterval);
            var audio = new Audio( PluginDir.url + 'media/sounds/airhorn.mp3' );
            audio.play();

        }
    }

    updateClock();
    var t = getTimeRemaining(endtime);
    var time_ms = t.total;
    console.log ("total" + t.total);
    if (time_ms > 0 ){
        var timeinterval = setInterval(updateClock, 1000);
    }else {
    }
}

function go_timer_abandon() {
    var redirectURL = go_task_data.redirectURL;
    window.location = redirectURL;
}

function flash_error_msg( elem ) {
    var bg_color = jQuery( elem ).css( 'background-color' );
    if ( typeof bg_color === undefined ) {
        bg_color = "white";
    }
    jQuery( elem ).animate({
        color: bg_color
    }, 200, function() {
        jQuery( elem ).animate({
            color: "red"
        }, 200 );
    });
}

function task_stage_change( target, required_elements = null ) {

    console.log( "task_stage_change");
    clearInterval(go_autosave_timer);
    //throw new Error("2-Something went badly wrong!");
    //v4 Set variables
    var button_type = "";
    if ( 'undefined' !== typeof jQuery( target ).attr( 'button_type' ) ) {
        button_type = jQuery( target ).attr( 'button_type' )
    }
    console.log("Button:" + button_type);

    var task_status = "";
    if ( 'undefined' !== typeof jQuery( target ).attr( 'status' ) ) {
        task_status = jQuery( target ).attr( 'status' )
    }

    var next_bonus = "";
    if ( 'undefined' !== typeof jQuery( target ).attr( 'next_bonus' ) ) {
        next_bonus = jQuery( target ).attr( 'next_bonus' )
    }

    let check_type = "";
    if ( 'undefined' !== typeof jQuery( target ).attr( 'check_type' ) ) {
        check_type = jQuery( target ).attr( 'check_type' )
    }

    let blog_post_id = "";
    if ( 'undefined' !== typeof jQuery( target ).attr( 'blog_post_id' ) ) {
        blog_post_id = jQuery( target ).attr( 'blog_post_id' )
    }

    let result = jQuery( '#go_result' ).attr( 'value' );
    let result_title = null;

    if( check_type == 'blog' && button_type != 'undo_last_bonus'){
        //result = tinyMCE.getContent('go_blog_post');

        result = go_get_tinymce_content_blog('post');
        //result = go_get_tinymce_content_blog('task_stage_change');
        result_title = jQuery( '#go_blog_title' ).html();
        //blog_post_id = jQuery( '#go_blog_title' ).data( 'blog_post_id' );
    }else{
        let result_title = null;
    }

    //const required_elements = go_get_blog_required_elements();
    console.log("required_elements");
    console.log(required_elements);
    //const json = JSON.stringify(required_elements );
    //console.log(json);

    jQuery.ajax({
        type: "POST",
        data: {
            _ajax_nonce: go_task_data.go_task_change_stage,
            action: 'go_task_change_stage',
            is_frontend: is_frontend,
            post_id: go_task_data.ID,
            user_id: go_task_data.userID,
            status: task_status,
            next_bonus: next_bonus,
            button_type: button_type,
            check_type: check_type,
            result: result,
            result_title: result_title,
            blog_post_id: blog_post_id,
           // blog_url: blog_url,
            //blog_media: blog_media,
           // blog_video: blog_video,
            required_elements: required_elements

        },
        /**
         * A function to be called if the request fails.
         * Assumes they are not logged in and shows the login message in lightbox
         */
        error: function(jqXHR, textStatus, errorThrown) {
            go_after_ajax();
            go_disable_loading();
            go_enable_task_buttons();
            if (jqXHR.status === 400){
                jQuery(document).trigger('heartbeat-tick.wp-auth-check', [ {'wp-auth-check': false} ]);
            }
            go_start_autosave_timer();
        },
        success: function( raw ) {

            //console.log(raw);
            var error = go_ajax_error_checker(raw);
            if (error == 'true') return;

            // parse the raw response to get the desired JSON
            var res = {};
            try {
                var res = JSON.parse( raw );
            } catch (e) {
                res = {
                    json_status: '101',
                    timer_start: '',//doesn;t do anything
                    button_type: '',
                    time_left: '',
                    html: '',
                    redirect: '',
                    rewards: { //this doesn't do anything? check this function
                        gold: 0,
                    },
                };
            }
            //console.log("HTML: " + res.html);
            if ( '101' === Number.parseInt( res.json_status ) ) {
                console.log (101);
                jQuery( '#go_stage_error_msg' ).show();
                var error = "Server Error.";
                if ( jQuery( '#go_stage_error_msg' ).text() != error ) {
                    jQuery( '#go_stage_error_msg' ).text( error );
                } else {
                    flash_error_msg( '#go_stage_error_msg' );
                }
            } else if ( 302 === Number.parseInt( res.json_status ) ) {
                console.log (302);
                window.location = res.location;
            }
            else if ( 'refresh' ==  res.json_status  ) {
                location.reload();
            }else if ( 'bad_password' ==  res.json_status ) {
                jQuery( '#go_stage_error_msg' ).show();
                var error = "Invalid password.";
                if ( jQuery( '#go_stage_error_msg' ).text() != error ) {
                    jQuery( '#go_stage_error_msg' ).text( error );
                } else {
                    flash_error_msg( '#go_stage_error_msg' );
                }
                go_blog_new_posts();
            }else {
                    console.log(1);
                if ( res.button_type == 'undo' ){
                    jQuery( '#go_wrapper div' ).last().hide();
                    jQuery( '#go_wrapper > div' ).slice(-3).hide( 'slow', function() { jQuery(this).remove();} );
                }
                else if ( res.button_type == 'undo_last' ){

                    jQuery( '#go_wrapper div' ).last().hide();
                    jQuery( '#go_wrapper > div' ).slice(-2).hide( 'slow', function() { jQuery(this).remove();} );
                    go_new_pagination();
                }
                else if ( res.button_type == 'continue' || res.button_type == 'complete' ){
                    jQuery( '#go_wrapper > div' ).slice(-1).hide( 'slow', function() { jQuery(this).remove();} );
                    go_new_pagination();
                }
                else if ( res.button_type == 'show_bonus' ){
                    jQuery('#go_buttons').remove();
                    //remove active class to checks and buttons
                    jQuery(".go_checks_and_buttons").removeClass('active');
                }
                else if ( res.button_type == 'continue_bonus' || res.button_type == 'complete_bonus' ){
                    jQuery( '#go_wrapper > div' ).slice(-1).hide( 'slow', function() { jQuery(this).remove();} );
                }
                else if ( res.button_type == 'undo_bonus' ){
                    jQuery( '#go_wrapper > div' ).slice(-2).hide( 'slow', function() { jQuery(this).remove();} );
                }
                else if ( res.button_type == 'undo_last_bonus' ){
                    jQuery( '#go_wrapper > div' ).slice(-1).hide( 'slow', function() { jQuery(this).remove();} );
                }
                else if ( res.button_type == 'abandon_bonus' ){
                    jQuery( '#go_wrapper > div' ).slice(-3).remove();
                }
                else if ( res.button_type == 'abandon' ){
                    window.location = res.redirect;
                }
                else if ( res.button_type == 'timer' ){
                    jQuery( '#go_wrapper > div' ).slice(-3).hide( 'slow', function() { jQuery(this).remove();} );
                    var audio = new Audio( PluginDir.url + 'media/sounds/airhorn.mp3' );
                    audio.play();
                }
                go_append(res);
            }
            go_start_autosave_timer();
        }
    });
}

function go_new_pagination(){
    jQuery("#go_task_pagination").hide('fast');
    console.log("go_new_pagination");
    var nonce = GO_FRONTEND_DATA.nonces.go_new_pagination_ajax;

    jQuery.ajax({
        type: 'POST',
        data: {
            _ajax_nonce: nonce,
            post_id: go_task_data.ID,
            action: 'go_new_pagination_ajax',
            is_frontend: is_frontend,
        },
        /**
         * A function to be called if the request fails.
         * Assumes they are not logged in and shows the login message in lightbox
         */
        error: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400){
                jQuery(document).trigger('heartbeat-tick.wp-auth-check', [ {'wp-auth-check': false} ]);
            }
        },
        success: function (res) {
            if (-1 !== res) {
               jQuery("#go_task_pagination").replaceWith(res);
                jQuery("go_task_pagination").show('slow');
            }
        }
    });
}

//This isn't currently used, but saving just in case . . .
function go_mce_reset() {
    // remove existing editor instance
    tinymce.execCommand('mceRemoveEditor', true, 'go_blog_post');
    tinymce.execCommand( 'mceAddEditor', true, 'go_blog_post' );
}

function go_append (res){
   console.log("go_append");
    //jQuery( res.html ).addClass('active');
    //var html = res.html;
   // console.log(html);
    //console.log(html);

    jQuery( res.html ).appendTo( '#go_wrapper' ).stop().hide().show( 'slow' ).promise().then(function() {
        // Animation complete
        go_make_clickable();
        go_blog_new_posts();

        //https://stackoverflow.com/questions/25732679/load-wordpress-editor-via-ajax-plugin


    });

}


// Makes it so you can press return and enter content in a field
function go_make_clickable() {
    //Make URL button clickable by clicking enter when field is in focus
    jQuery('.clickable').keyup(function(ev) {
        // 13 is ENTER
        if (ev.which === 13) {
            // do something
            jQuery("#go_button").click();
        }
    });
}

//This updates the admin view option and refreshes the page.
function go_update_admin_view(go_admin_view){
    console.log("go_update_admin_view:" + go_admin_view);
    jQuery.ajax({
        type: "POST",
        url : MyAjax.ajaxurl,
        data: {
            _ajax_nonce: GO_ADMIN_VIEW.go_update_admin_view,
            action:'go_update_admin_view',
            is_frontend: is_frontend,
            //user_id: go_task_data.userID,
            go_admin_view : go_admin_view,
        },
        /**
         * A function to be called if the request fails.
         * Assumes they are not logged in and shows the login message in lightbox
         */
        error: function(jqXHR, textStatus, errorThrown) {
           // console.log("error");
            if (jqXHR.status === 400){
                jQuery(document).trigger('heartbeat-tick.wp-auth-check', [ {'wp-auth-check': false} ]);
            }
        },
        success:function(data) {
            //console.log("success");
           // console.log(data);
            location.reload();
        }
    })
}

function go_quiz_check_answers(status, target) {
    console.log ("go_quiz_check_answers");
    var test_list = jQuery(target).closest(".go_checks_and_buttons").find(" .go_test_list");
    var list_size = test_list.length;//number of questions
    var type_array = [];
    var choice_array = [];

    for ( var x = 0; x < list_size; x++ ) {//for each question on this quiz
        console.log("Question " + x );
        // figure out the type of each test
        var test_type = test_list[ x ].children[1].children[0].type;
        type_array.push( test_type );

        var obj_str = "#" + test_list[ x ].id + " :checked";//list of all checked answers on this question
        var not_checked_str = "#" + test_list[ x ].id + " input:not(:checked)";

        // console.log("obj_str :" + obj_str);
        var checked_ans = jQuery( obj_str );
        var not_checked_ans = jQuery( not_checked_str );
        /*
        console.log("chosen_answers: " + checked_ans);
        console.log(checked_ans);
        console.log("chosen_answers length: " + checked_ans.length);
        console.log("not_chosen_answers: " + not_checked_ans);
        console.log(not_checked_ans);
        console.log("not_chosen_answers length: " + not_checked_ans.length);
        */

        if ( test_type == 'radio' ) {
            console.log("test_type :" + test_type);
            // push indiviudal answers to the choice_array
            if ( checked_ans[0] != undefined ) {
                choice_array.push( checked_ans[0].value );
            }

        } else if ( test_type == 'checkbox' ) {
            //console.log("test_type :" + test_type);
            var t_array = [];
            for ( var i = 0; i < checked_ans.length; i++ ) {
                t_array.push( checked_ans[ i ].value );
            }

            choice_array.push( t_array );
        }

        //add class that will be used when saving
        for ( var i = 0; i < checked_ans.length; i++ ) {
            //console.log('checkme:' + checked_ans[i]);
            //console.log(checked_ans[i]);
            jQuery(checked_ans[i]).addClass('go_quiz_checked');
        }
        //remove checked to html before saving

        for ( var i = 0; i < not_checked_ans.length; i++ ) {
            //console.log('not_checked_ans:' + not_checked_ans[i]);
            //console.log(not_checked_ans[i]);
            jQuery(not_checked_ans[i]).removeClass('go_quiz_checked');

        }
    }

    var choice = choice_array;
    var type = type_array;


    jQuery.ajax({
        type: "POST",
        data:{
            _ajax_nonce: go_task_data.go_check_quiz_answers,
            action: 'go_check_quiz_answers',
            is_frontend: is_frontend,
            //html: html,
            task_id: go_task_data.ID,
            user_id: go_task_data.userID,
            list_size: list_size,
            chosen_answer: choice,
            type: type,
            status: status,
        },
        /**
         * A function to be called if the request fails.
         * Assumes they are not logged in and shows the login message in lightbox
         */
        error: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400){
                jQuery(document).trigger('heartbeat-tick.wp-auth-check', [ {'wp-auth-check': false} ]);
            }
        },
        success: function( response ) {
            //console.log('answers: ' + response);
            if (response === 'login'){
                jQuery(document).trigger('heartbeat-tick.wp-auth-check', [ {'wp-auth-check': false} ]);
            };
            if ( response == 'refresh'){
                location.reload();
            }
            else if (response == true) {//if is all are correct
                var container_id = "#go_test_container_" + (parseFloat(status)+1);
                console.log("All Correct");
                console.log("container_id: " + container_id);
                jQuery('.go_test_container').hide('slow');
                jQuery('#test_failure_msg').hide('slow');
                jQuery('.go_test_submit_div').hide('slow');
                jQuery( container_id + ' .go_wrong_answer_marker').hide();
                jQuery(container_id + ' .go_correct_answer_marker').show();
                jQuery('#go_stage_error_msg').hide();
                go_send_save_quiz_result(target, status, function(){
                    task_stage_change(target);
                } );
                go_disable_loading();
                //return false;
                //return false;//fail is false
            }
            else if (typeof response === 'string') {
                //console.log("response" + response);
                var failed_questions = JSON.parse(response);
                //var failed_count = failed_questions.length;

                //console.log("failed Questions");
                //console.log(failed_questions);
                for (var x = 0; x < test_list.length; x++) {
                    var test_id = test_list[x].id;
                    //console.log('test_id: ' + test_id);
                    //console.log(test_id);


                    if (jQuery.inArray(test_id, failed_questions) === -1) {
                        console.log("correct");
                        jQuery("#" + test_id + " .go_wrong_answer_marker").hide();
                        jQuery("#" + test_id + " .go_correct_answer_marker").show();

                    } else {
                        //console.log("wrong");
                        jQuery("#" + test_id + " .go_correct_answer_marker").hide();
                        jQuery("#" + test_id + " .go_wrong_answer_marker").show();

                    }
                }

                var error_msg_val = jQuery('#go_stage_error_msg').text();
                if (error_msg_val != "Try again!") {
                    jQuery('.go_error_msg').show();
                    jQuery('.go_error_msg').text("Try again!");
                } else {
                    flash_error_msg('#go_stage_error_msg');
                }
                go_send_save_quiz_result(target, status, function(){} );
                go_disable_loading();
                go_after_ajax();
                go_enable_task_buttons( );
                //return true;

            }
        }
    });
}

function go_send_save_quiz_result(target, status, callback ){
    var test_list = jQuery(target).closest(".go_checks_and_buttons").find(" .go_test_container");
    var clone = jQuery(test_list).clone();
    //set the html for saving
    jQuery(clone).find('input').prop('disabled', true);
    jQuery(clone).find('.go_quiz_checked').attr('checked', 'checked');

    var whitelist = ["type","checked","disabled"];

    /*
    jQuery(clone).find('input').each(
        function() {
            var attributes = this.attributes;
            var i = attributes.length;
            while( i-- ) {
                var attr = attributes[i];
                if( jQuery.inArray(attr.name,whitelist) == -1 ) {
                    this.removeAttributeNode(attr);
                }
            }
        }
    )​;
    */

    jQuery(clone).find("input").each(
        function(){
            for(var attributes=this.attributes,t=attributes.length;t--;)
            {var attribute=attributes[t];
            -1==jQuery.inArray(attribute.name,whitelist)&&this.removeAttributeNode(attribute)}
        });


    var html = jQuery(clone).html();
    //var html="";
    //jQuery(target).closest('.go_checks_and_buttons').find('input').removeAttr('checked');
    //jQuery(target).closest('.go_checks_and_buttons').find('input').prop('disabled', false);

    //jQuery('.go_test_container').unwrap();
    //console.log("Quiz HTML: " + html);

    jQuery.ajax({
        type: "POST",
        data: {
            _ajax_nonce: go_task_data.go_save_quiz_result,
            action: 'go_save_quiz_result',
            is_frontend: is_frontend,
            html: html,
            task_id: go_task_data.ID,
            user_id: go_task_data.userID,
            status: status
        },

         // A function to be called if the request fails.
         // Assumes they are not logged in and shows the login message in lightbox

        error: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400){
                jQuery(document).trigger('heartbeat-tick.wp-auth-check', [ {'wp-auth-check': false} ]);
            }
        },
        success: function(  ) {
            callback();
            go_after_ajax();
        }
    });


}



