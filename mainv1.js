

$(document).ready(() => {

    (function ($) {
        $.fn.wysiwyg = function (options) {
            let default_params = $.extend({
                //DEFAULT OPTIONS
                option1: "value",
                option2: "value"
            }, options);


            //DO SOMETHING

            $(document).on("click", "button, input", (e) => {
                // e.preventDefault();
                console.log(e.target.id);
                update_text(e.target.id)
                switch (e.target.id) {
                    case "bold":
                        update_text("bold");
                        break;
                    case "italic":
                        italic();
                        break;
                    case "strike":
                        strike();
                        break;
                    case "picker":
                        color();
                        break;
                    case "min-font-size":
                        change_font_size(false);
                        break;
                    case "max-font-size":
                        change_font_size(true);
                        break;
                    case "link":
                        link(url);
                        break;
                    case "increase-line":
                        break;
                    case "decrease-line":
                        break;
                    case "left-align":
                        break;
                    case "right-align":
                        break;
                    case "center-align":
                        break;
                    case "justify-align":
                        break;
                    case "switch":
                        break;
                }
            });
           
            return this; //To allow chaining;

        };

    }(jQuery));

    function update_text(command, value=null){
        document.execCommand(command, false, value);
    }
    function bold(){
        console.log("in");
        
        document.execCommand("forecolor", false, "rgb(250,220,200)");

    }


    $("#editor").wysiwyg();

});









function wrap_txt() {
    let txt = getSelection().getRangeAt(0);
    console.log(txt);

    if (txt.startContainer === txt.endContainer && txt.startContainer.id != "editor" && txt.startContainer.parentElement.id != "editor") {
        if (txt.startContainer.tagName === "SPAN") {
            console.log("txt in span")
            return txt.startContainer;
        }
        else if (txt.startContainer.parentElement.tagName === "SPAN") {
            console.log("txt in textnode and parent is span")
            return txt.startContainer.parentElement;
        }
    }
    else {
        console.log("create new span"); 
        let span = document.createElement("span");
        txt.surroundContents(span);

        return span;
    }
}

function bold() {
    let span = wrap_txt();
    span.style.fontWeight = "bold";

}

function italic() {
    let span = wrap_txt();
    span.style.fontStyle = "italic";
}

function strike() {
    let span = wrap_txt();
    span.style.textDecoration = "line-through";
}

function change_font_size(incr) {
    let span = wrap_txt();
    let font_size = window.getComputedStyle(span).getPropertyValue("font-size").slice(0, -2);
    console.log(font_size);
    if (incr) {
        font_size++;
    }
    else {
        font_size--;
    }
    console.log(font_size);


    span.style.fontSize = font_size + "px";
}

function color() {
    $("#picker").on("change", () => {
        let span = wrap_txt();
        span.style.color = $("#picker").val();
    });
}

// function link(url) {
//     let txt = window.getSelection();
//     txt.wrap("<a href=" + url + "></a>");
// }



