$(document).ready(function() {
    $(document).on('submit', '#username-form', function set_username(){
        const val = document.querySelector("input#username").value;

        if (val.length > 0) {
        	document.querySelector('div.enter-username-wrapper').classList.add('hide-username-form')
            eel.set_username(val);
        }
        return false;
    });
    $(document).on('submit', '#send-message', function send_msg(){
        var msg = document.querySelector("input#message").value;

        if (msg.length > 0) {
            eel.write_msg(msg);
            document.querySelector("input#message").value = '';
        }
        return false;
    });
});

const ul_chat_box = document.getElementById("chatbox");

let scroll_to_bottom = document.getElementById('chatbox');
function scrollBottom(element) {
	element.scroll({ top: element.scrollHeight, behavior: "smooth"})
}

eel.expose(display_msg);
function display_msg(msg) {
    if (msg.includes("*USER&MSG_DIVIDER*")) {
        var splitted = msg.split("*USER&MSG_DIVIDER*");
        var username = splitted[0];
        var message = splitted[1].split("*MSG&DATE_DIVIDER*")[0]
        var msg_date = msg.split("*MSG&DATE_DIVIDER*")[1]
        var li = document.createElement("li");
        li.innerHTML = "<div><div><p class='msg-bubble-username'>" + username + ":</p><p class='msg-bubble-date'>" + msg_date + "</p></div><p class='msg-bubble-text'>" + message + "</p></div>";
        ul_chat_box.appendChild(li);
    }
    else {
        var splitted = msg.split("*MSG&DATE_DIVIDER*");
        var message = splitted[0]
        var msg_date = splitted[1]
        var li = document.createElement("li");
        li.innerHTML = "<div><p style='display: inline-block;'>" + message + "</p><p class='msg-bubble-date'>" + msg_date + "</p></div>";
        ul_chat_box.appendChild(li);
    }
    scrollBottom(scroll_to_bottom);
}

jQuery(window).bind("beforeunload", function() {
         eel.client_left_the_chat();
    }
)


// Kind of setting a minimum windows size...
function ensureMinimumWindowSize(width, height) {
    var tooThin = (width > window.innerWidth);
    var tooShort = (height > window.innerHeight);

    if (tooThin || tooShort) {
        var deltaWidth = window.outerWidth - window.innerWidth;
        var deltaHeight = window.outerHeight - window.innerHeight;

        width = tooThin ? width + deltaWidth : window.outerWidth;
        height = tooShort ? height + deltaHeight : window.outerHeight;

        // Edge not reporting window outer size correctly
        if (/Edge/i.test(navigator.userAgent)) {
            width -= 16;
            height -= 8;
        }

        window.resizeTo(width, height);
    }
}

var resizeTimer;
window.addEventListener('resize', function(event) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        ensureMinimumWindowSize(1000,700);
    }, 250);
}, false);

document.onclick = hideMenu;
document.oncontextmenu = rightClick;

function hideMenu() {
	document.getElementById(
		"contextMenu").style.display = "none"
}

function rightClick(e) {
	e.preventDefault();

	if (document.getElementById("contextMenu").style.display == "block")
		hideMenu();
	else {
		var menu = document.getElementById("contextMenu")

		menu.style.display = 'block';
		menu.style.left = e.pageX + "px";
		menu.style.top = e.pageY + "px";
	}
}

function copySelection() {
	var selObj = window.getSelection();
	var selectedText = selObj.toString();
	navigator.clipboard.writeText(selectedText);
}

function pasteFromClipboard() {
	display_msg("SYSTEM: Use Ctrl + V to paste your copied text.*MSG&DATE_DIVIDER*ErrorType: ClipboardPermissionDenied")
}

document.onkeydown = function(e) {
	if(event.keyCode == 123) {
		display_msg("SYSTEM: F12 has been disabled. *MSG&DATE_DIVIDER*Action: F12");
		return false;
	}
	if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)){
		display_msg("SYSTEM: Ctrl + Shift + I has been disabled. *MSG&DATE_DIVIDER*Action: Ctrl + Shift + I");
		return false;
	}
	if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)){
		display_msg("SYSTEM: Ctrl + Shift + J has been disabled. *MSG&DATE_DIVIDER*Action: Ctrl + Shift + J");
		return false;
	}
	if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)){
		display_msg("SYSTEM: Ctrl + U has been disabled. *MSG&DATE_DIVIDER*Action: Ctrl + U");
		return false;
	}
	if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)){
		display_msg("SYSTEM: Ctrl + Shirt + C has been disabled. *MSG&DATE_DIVIDER*Action: Ctrl + Shirt + C");
		return false;
	}
}
