function go_tinymce_insert_content_admin(n,t){if(console.log("go_tinymce_insert_content"),-1!==t.search("(\"|' )"))var e=t.search("(\"|' )")+1;else if(-1!==t.search("\\]\\["))var e=t.search("\\]\\[")+1;if(void 0!==e){n.insertContent(t);var o,i=n.selection.getBookmark(1),c=i.rng.startContainer;i.rng.setStart(c,e),i.rng.setEnd(c,e),n.selection.moveToBookmark(i)}else n.insertContent(t)}tinymce.PluginManager.add("go_admin_comment",function(n,t){n.addButton("go_admin_comment",{title:"Insert Admin Comment",onclick:function(t){go_tinymce_insert_content_admin(n,"[comment][/comment]")}})});