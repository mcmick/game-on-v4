function go_tinymce_insert_content(t,n){if(console.log("go_tinymce_insert_content"),-1!==n.search("(\"|' )"))var e=n.search("(\"|' )")+1;else if(-1!==n.search("\\]\\["))var e=n.search("\\]\\[")+1;if(void 0!==e){t.insertContent(n);var o,i=t.selection.getBookmark(1),c=i.rng.startContainer;i.rng.setStart(c,e),i.rng.setEnd(c,e),t.selection.moveToBookmark(i)}else t.insertContent(n)}tinymce.PluginManager.add("go_shortcode_button",function(t,n){t.addButton("go_shortcode_button",{text:"[ ]",type:"splitbutton",title:"Shortcodes",onclick:function(n){go_tinymce_insert_content(t,"[go_get_displayname]")},menu:[{text:"Display Name",onclick:function(){go_tinymce_insert_content(t,"[go_get_displayname]")}},{text:"First Name",onclick:function(){go_tinymce_insert_content(t,"[go_firstname]")}},{text:"Last Name",onclick:function(){go_tinymce_insert_content(t,"[go_lastname]")}},{text:"Login Name",onclick:function(){go_tinymce_insert_content(t,"[go_loginname]")}},{text:"Admin Comments",onclick:function(){go_tinymce_insert_content(t,"[comment][/comment]")}},{text:"–––––––––––––"},{text:"Insert the Map",onclick:function(){go_tinymce_insert_content(t,"[go_make_map]")}},{text:"Insert the Store",onclick:function(){go_tinymce_insert_content(t,"[go_make_store]")}},{text:"Store Item (get the Item ID from the edit page)",onclick:function(){go_tinymce_insert_content(t,'[go_store id=""]')}},{text:"–––––––––––––"},{text:"Video: Text link to Lightbox of Video URL",onclick:function(){go_tinymce_insert_content(t,'[go_video_link video_url="" video_title=""]')}},{text:"Video: Thumbnail to  Lightbox of Video URL",onclick:function(){go_tinymce_insert_content(t,'[go_video video_url="" ]')}},{text:"iFrame Lightbox of any URL",onclick:function(){go_tinymce_insert_content(t,'[go_lightbox_url link_url="" link_text=""]')}}]})});