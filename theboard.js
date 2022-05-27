var krpano = null;

embedpano({
    swf: "tour.swf",
    xml: "tour.xml",
    target: "pano",
    html5: "auto",
    consolelog: true,
    mobilescale: 1.0,
    passQueryParameters: true,
    onready: krpano_onready_callback
});

function krpano_onready_callback(krpano_interface) {
    krpano = krpano_interface;
    // console.log(krpano)
}

var delete_hs_mode = false;
var edit_hs_mode = false;
var selectedhs = null;

function add_hotspot() {
    var mx, my;
    document.getElementById("pano").addEventListener('click', pointselection)
    document.getElementById("add_hs").innerHTML = "Choose A Point"


    function pointselection(){
        mx = krpano.get("mouse.x");
        my = krpano.get("mouse.y");
        var hs_poistion = krpano.screentosphere(mx + 20, my - 20);

        var hs_name = "hs" + ((Date.now() + Math.random()) | 0);	// create unique/randome name
        krpano.call("addhotspot(" + hs_name + ")");
        krpano.set("hotspot[" + hs_name + "].url", "./comment.png");
        krpano.set("hotspot[" + hs_name + "].ath", hs_poistion.x);
        krpano.set("hotspot[" + hs_name + "].atv", hs_poistion.y);
        krpano.set("hotspot[" + hs_name + "].distorted", true);


        krpano.set("hotspot[" + hs_name + "].comment", "This is a Default Message");
        var comment = krpano.get("hotspot[" + hs_name + "].comment")

        if (krpano.get("device.html5")) {
            // for HTML5 it's possible to assign JS functions directly to krpano events
            krpano.set("hotspot[" + hs_name + "].onclick", function (hs, cmt) {
                if(delete_hs_mode){
                    krpano.call("removehotspot(" + hs_name + ");");
                    document.getElementById("rmv_hs").innerHTML = "Remove Comment"
                    delete_hs_mode = false;
                }
                else if(edit_hs_mode){
                    document.getElementById("edit_hs").outerHTML = 
                        "<input id='edit_input'/>"+
                        "<div id='edit_sub_btn' class='button'>Submit</div>";
                    
                    function edit_submit(){
                        if(krpano){
                            var comment = document.getElementById("edit_input").value
                            krpano.set("hotspot[" + hs + "].comment", comment);
                            alert("您已将留言："+ hs + "的内容修改为：\n\n"+comment)
                            edit_hs_mode = false;
                            document.getElementById("edit_input").outerHTML = "<div id='edit_hs' class='button' onclick='edit_hotspot()'>Edit Comment</div>"
                            document.getElementById("edit_sub_btn").outerHTML = ""
                        }
                    }
                    document.getElementById("edit_sub_btn").addEventListener('click', edit_submit);
                }
                else{
                    var comment = krpano.get("hotspot[" + hs + "].comment")
                    alert('留言 "' + hs + '" 说：\n\n'+ comment);
                }
    
            }.bind(null, hs_name, comment));
        }
        else {
            // for Flash the js() action need to be used to call from Flash to JS (this code would work for Flash and HTML5)
            krpano.set("hotspot[" + hs_name + "].onclick", "js( alert(calc('hotspot \"' + name + '\" clicked')) );");
        }

        document.getElementById("add_hs").innerHTML = "Add Comment"
        document.getElementById("pano").removeEventListener('click', pointselection)
    }
}

function edit_hotspot(){
    if (krpano) {
        edit_hs_mode = true;
        document.getElementById("edit_hs").innerHTML = 'Select a Comment'
    }
}

function remove_one_hotspot() {
    if (krpano) {
        document.getElementById("rmv_hs").innerHTML = 'Select a Comment'
        delete_hs_mode = true;
    }
}

function remove_all_hotspots() {
    if (krpano) {
        krpano.call("loop(hotspot.count GT 0, removehotspot(0) );");
        selectedhs = null;
    }
}

var track_mouse_enabled = false;
var track_mouse_interval_id = null;

function track_mouse_interval_callback() {
    var mx = krpano.get("mouse.x");
    var my = krpano.get("mouse.y");
    var pnt = krpano.screentosphere(mx, my);
    var h = pnt.x;
    var v = pnt.y;
    document.getElementById("mousepos").innerHTML = 'x="' + mx + '" y="' + my + '" ath="' + h.toFixed(2) + '" atv="' + v.toFixed(2) + '"';
}

function track_mouse() {
    if (krpano) {
        if (track_mouse_enabled == false) {
            document.getElementById("show_coords")
            // enable - call 60 times per second
            track_mouse_interval_id = setInterval(track_mouse_interval_callback, 1000.0 / 60.0);

            track_mouse_enabled = true;
        }
        else {
            // disable
            clearInterval(track_mouse_interval_id);
            document.getElementById("mousepos").innerHTML = "";

            track_mouse_enabled = false;
        }
    }
}
