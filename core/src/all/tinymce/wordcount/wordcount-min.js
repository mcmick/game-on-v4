tinymce.PluginManager.add("wordcount",function(o){function n(){o.theme.panel.find("#wordcount").text(["Words: {0}",u.getCount()])}var a,r,u=this;a=o.getParam("wordcount_countregex",/[\w\u2019\x27\-\u00C0-\u1FFF]+/g),r=o.getParam("wordcount_cleanregex",/[0-9.(),;:!?%#$?\x27\x22_+=\\\/\-]*/g),o.on("init",function(){var e=o.theme.panel&&o.theme.panel.find("#statusbar")[0],t=e.previousSibling;e&&tinymce.util.Delay.setEditorTimeout(o,function(){e.insert({type:"label",name:"wordcount",text:["Words: {0}",u.getCount()],classes:"wordcount",disabled:o.settings.readonly},0),o.on("setcontent beforeaddundo",n),o.on("keyup",function(e){32==e.keyCode&&n(),46==e.keyCode&&n(),8==e.keyCode&&n()})},0)}),u.getCount=function(){var e=o.getContent({format:"raw"}),t=0;if(e){var n=(e=(e=(e=(e=e.replace(/\.\.\./g," ")).replace(/<.[^<>]*?>/g," ").replace(/&nbsp;|&#160;/gi," ")).replace(/(\w+)(&#?[a-z0-9]+;)+(\w+)/i,"$1$3").replace(/&.+?;/g," ")).replace(r,"")).match(a);n&&(t=n.length)}return t}});