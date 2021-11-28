let switched = false;
(function ($) {
    $.fn.wysiwyg = function (options) {
        let default_params = $.extend({
            //DEFAULT OPTIONS
            buttons: ["bold", "italic", "strike", "changeFontSize", "changeLine", "justify", "switchToHtml", "save", "color", "link", "video", "image"]
        }, options);


        //DO SOMETHING
        render_tool_bar(default_params.buttons, this);
        load();


        $("#wysiwyg-toolbar").on("click", "button, button > *, input", (e) => {
            console.log(e.target);
            if (e.target.dataset.cmd != undefined) {
                cmd = e.target.dataset.cmd;
                switch (cmd) {
                    case "foreColor":
                        get_color();
                        break;
                    case "createLink":
                        get_link();
                        break;
                    case "switch":
                        get_html();
                        break;
                    case "increase-line":
                        change_line_height(true);
                        break;
                    case "decrease-line":
                        change_line_height(false);
                        break;
                    case "createVideo":
                        display_video_player();
                        break;
                    case "createImg":
                        display_image();
                    default:
                        update_text(e.target.dataset.cmd);
                }
            }

            // if (e.target.id === "color") {
            //     showColor();
            // }
        });

        function update_text(command, value = null) {
            console.log("in", command, value);
            document.execCommand(command, false, value);
        }
        function get_color() {
            $("#picker").on("change", (e) => {
                let clr = $("#picker").val();
                if (clr != undefined) {
                    update_text("foreColor", clr);
                }
            });
        }

        function get_link() {
            let url = prompt("Enter url :");
            update_text("createLink", url);
        }

        function get_html() {
            if (switched) {
                let html = $("#wysiwyg-textarea").text();
                $("code").remove();
                $("#wysiwyg-textarea").html(html);
                switched = false;
            }
            else {
                save();
                source = load();
                $("#wysiwyg-textarea").text(source);
                update_text("selectAll");
                update_text("formatBlock", "<CODE>");
                switched = true;
            }
        }

        function change_line_height(bigger) {
            let height = parseInt(window.getComputedStyle(document.getElementById("wysiwyg-textarea")).getPropertyValue("line-height").slice(0, -2));
            console.log(height);
            if (bigger) {
                height++;
            }
            else {
                height--;
            }
            console.log(height);
            $("#wysiwyg-textarea").css("line-height", height + "px");
        }

        function display_video_player() {
            let url = prompt("Enter url :");
            url = url.replace("watch?v=", "embed/");
            update_text("insertHTML", "<iframe width='100%' height='250px' title='Youtube video player' src='" + url + "'></iframe>");
        }

        function display_image() {
            $("#upload-image-form").on("submit", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                // let file = document.getElementById("upload-image").files[0];
                let form_data = new FormData();
                form_data.append("file", $('#upload-image')[0].files[0]);
                // formData["file"] = file;
                $.ajax({
                    url: "./server.php",
                    type: "POST",
                    data: form_data,
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: (res) => {
                        if (res != "fail") {
                            let url = "upload/" + res;
                            update_text("insertHtml", "<img width='500px' src='" + url + "'></img>")
                            save();
                            load();
                        }
                    }

                });

            });

            // CHEATY WAY OF DOING IT

            // $("#upload-image").on("change", ()=>{
            //     let file = $("#upload-image")[0].files[0];
            //     let url = URL.createObjectURL(file);
            //     update_text("insertHTML", "<img src='" + url + "'></img>");

            // });
        }

        //INTERVAL TIME FOR SAVE EDITOR
        setInterval(function () {
            save();
        }, 30000);

        //SAVE EDITOR
        function save() {
            var editor = $('#wysiwyg-textarea').html();
            localStorage.setItem("wysiwyg", editor);
        }

        //LOAD EDITOR
        function load() {
            var editor = localStorage.getItem("wysiwyg");
            $('#wysiwyg-textarea').html(editor);
            return editor;
        }

        //SAVE BUTTON
        $("#save").on("click", () => {
            save();
        });


        // //ALERT PAGE CLOSE 
        window.onbeforeunload = function () {
            let ls_content = localStorage.getItem("wysiwyg");
            let div_content = $("#wysiwyg-textarea").html();

            if (ls_content !== div_content) {
                return "";
            }
        };

        function render_tool_bar(options, div) {
            div.html("<div id='wysiwyg-area'><div id='wysiwyg-toolbar'></div><div id='wysiwyg-textarea' contenteditable='true'></div></div>");

            options.forEach((e) => {
                switch (e) {
                    case "bold":
                        $("#wysiwyg-toolbar").append("<button id='bold-btn' data-cmd='bold'>B</button>");
                        break;
                    case "italic":
                        $("#wysiwyg-toolbar").append("<button id='italic-btn' data-cmd='italic'>I</button>");
                        break;
                    case "strike":
                        $("#wysiwyg-toolbar").append("<button id='strike-btn' data-cmd='strikeThrough'>S</button>");
                        break;
                    case "changeFontSize":
                        $("#wysiwyg-toolbar").append("<button data-cmd='increaseFontSize'>T+</button>");
                        $("#wysiwyg-toolbar").append("<button data-cmd='decreaseFontSize'>T-</button>");
                        break;
                    case "changeLine":
                        $("#wysiwyg-toolbar").append("<button data-cmd='increase-line'>L+</button>");
                        $("#wysiwyg-toolbar").append("<button data-cmd='decrease-line'>L-</button>");
                        break;
                    case "justify":
                        $("#wysiwyg-toolbar").append("<button data-cmd='justifyLeft'>←</button>");
                        $("#wysiwyg-toolbar").append("<button data-cmd='justifyRight'>→</button>");
                        $("#wysiwyg-toolbar").append("<button data-cmd='justifyCenter'><img data-cmd='justifyCenter' class='image' src='https://img.icons8.com/ios/100/000000/align-cell-content-center.png'/></button>");
                        $("#wysiwyg-toolbar").append("<button data-cmd='justifyFull'><img data-cmd='justifyFull' class='image' src='https://img.icons8.com/ios/100/000000/align-justify.png' /></button>");
                        break;
                    case "switchToHtml":
                        $("#wysiwyg-toolbar").append("<button data-cmd='switch'><img data-cmd='switch' class='image' src='https://img.icons8.com/color/480/000000/html-5--v1.png'/></button>");
                        break;
                    case "save":
                        $("#wysiwyg-toolbar").append("<button id='save' data-cmd='save'><img data-cmd='save' class='image' src=https://img.icons8.com/ios-filled/100/000000/save--v1.png'/></button>");
                        break;
                    case "color":
                        // $("#wysiwyg-toolbar").append("<button id='color'><img class='image' src='https://img.icons8.com/fluent/96/000000/color-mode.png'/></button>");
                        // $("#color").append("<div id='display-color-button'></div>");
                        // $("#display-color-button").append("<input type='color id='picker' data-cmd='foreColor'>");
                        $("#wysiwyg-toolbar").append("<input type='color' id='picker' data-cmd='foreColor'>");
                        break;
                    case "link":
                        $("#wysiwyg-toolbar").append("<button data-cmd='createLink'><img data-cmd='createLink' class='image' src='https://img.icons8.com/ios/100/000000/link--v1.png' /></button>");
                        break;
                    case "video":
                        $("#wysiwyg-toolbar").append("<button data-cmd='createVideo'><img data-cmd='createVideo' class='image' src='https://img.icons8.com/ios/50/000000/video.png'/></button>");
                        break;
                    case "image":
                        $("#wysiwyg-toolbar").append("<form enctype='multipart/form-data' id='upload-image-form'><input name='file' id='upload-image' type='file' data-cmd = 'createImg' value='img'/><input type='submit' value='Upload'/></form>");
                }
            });

            $("#bold-btn").css("font-weight", "bold");
            $("#italic-btn").css("font-style", "italic");
            $("#strike-btn").css("text-decoration", "line-through");
            $('.image').css("width", "10%");
            $('img').css("width", "10px");
            $('#display-color-button').css("display", "none");
            $('#wysiwyg-area').css("display", "grid");
            $('#wysiwyg-area').css("display", 'grid-template-areas: "a" "b"');
            $('#wysiwyg-area').css("justify-content", "center");
            $('#wysiwyg-toolbar').css("display", "flow-root");
            $('#wysiwyg-toolbar').css("width", "500px");
            $('#wysiwyg-toolbar').css("margin-top", "30px");
            $('#wysiwyg-toolbar').css("margin-top", "30px");
            $('#wysiwyg-textarea').css("min-height", "400px");
            $('#wysiwyg-textarea').css("width", "500px");
            $('#wysiwyg-textarea').css("border", "1px solid black");
            $('#wysiwyg-textarea').css("line-height", "1em");
            $('#wysiwyg-textarea').css("background-color", "white");
            $('#wysiwyg-textarea').css("opacity", "70%");
            $('.image').css("width", "10%");
            $('img').css("width", "15px");
            $('#display-color-button').css("display", "none");
            $('button, #picker').css('width', '10%');
        }



        return this; //To allow chaining;

    };

}(jQuery));

