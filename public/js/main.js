
$("#new-message").submit(function(e) {
    e.preventDefault();
    let message = $("#chat-send-message").val();
    appendMessageToChat(true, "You", message, "Now");
});
function appendMessageToChat(outbound, sender, message, time) {
    var chatMessage = Handlebars.compile(document.getElementById("template-chat-message").innerHTML);
    const chatBox = document.getElementById("messages");
    chatBox.innerHTML += chatMessage({
        outbound: outbound,
        sender: sender,
        message: message,
        time: time
    });
    scrollBottomOfChat();
}
function receiveMessage(message) {
    appendMessageToChat(false, "Jane Doe", message, "Now")
}
function scrollBottomOfChat() {
    var chat = $('#messages');
    var height = chat[0].scrollHeight;
    chat.scrollTop(height);
}


var chatMessage = Handlebars.compile(document.getElementById("template-chat-message").innerHTML);
const chatBox = document.getElementById("messages");
chatBox.innerHTML += chatMessage({
    outbound: false,
    sender: "Jane Doe",
    message: "This is a test message, it means nothing.",
    time: "5h"
});
chatBox.innerHTML += chatMessage({
    outbound: true,
    sender: "You",
    message: "This is another test message, it also means nothing.",
    time: "5h"
});
chatBox.innerHTML += chatMessage({
    outbound: false,
    sender: "Jane Doe",
    message: "Remember to bring your coursework tomorrow, so I can read through it",
    time: "3h"
});