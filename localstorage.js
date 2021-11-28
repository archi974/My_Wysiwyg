load();

//INTERVAL TIME FOR SAVE EDITOR
setInterval(function () {
    save();
}, 30000);

//SAVE EDITOR
function save() {
    var editor = document.getElementById("editor").innerHTML;
    localStorage.setItem("wysiwyg", editor);
}

//LOAD EDITOR
function load() {
    var editor = localStorage.getItem("wysiwyg");
    document.getElementById("editor").innerHTML = editor;
    return editor; 
}

//SAVE BUTTON
$("#save").click(function() {
    save();
});

localStorage.clear(); 




