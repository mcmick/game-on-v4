tinymce.PluginManager.add("wordcount", function(a) {
    function b() {
        a.theme.panel.find("#wordcount").text(["Words: {0}", e.getCount()])
    }
    var c, d, e = this;
    c = a.getParam("wordcount_countregex", /[\w\u2019\x27\-\u00C0-\u1FFF]+/g),
        d = a.getParam("wordcount_cleanregex", /[0-9.(),;:!?%#$?\x27\x22_+=\\\/\-]*/g),
        a.on("init", function() {
            var c = a.theme.panel && a.theme.panel.find("#statusbar")[0];
            var prevs = c.previousSibling;
            c && tinymce.util.Delay.setEditorTimeout(a, function() {
                c.insert({
                    type: "label",
                    name: "wordcount",
                    text: ["Words: {0}", e.getCount()],
                    classes: "wordcount",
                    disabled: a.settings.readonly
                }, 0),
                    a.on("setcontent beforeaddundo", b),
                    a.on("keyup", function(a) {
                        32 == a.keyCode && b();
                        46 == a.keyCode && b();
                        8 == a.keyCode && b();
                    })
            }, 0)
        }),
        e.getCount = function() {

            var b = a.getContent({
                format: "raw"
            })
                , e = 0;
            if (b) {

                b = b.replace(/\.\.\./g, " "),
                    b = b.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " "),
                    b = b.replace(/(\w+)(&#?[a-z0-9]+;)+(\w+)/i, "$1$3").replace(/&.+?;/g, " "),
                    b = b.replace(d, "");
                var f = b.match(c);
                f && (e = f.length)
            }
            return e
        }
});