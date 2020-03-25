/**
 * Client-side controller, manages displaying chat related content in the DOM and communicates with the API.
 * 
 * @module ChatManager
 */

import { getSavedUsers } from "../../postgres-db";

var _open_conversation = null;
let _updateMessagesInterval = null;

/**
 * If a user card is clicked, get the id data attribute and load the chat column for that id.
 */
$(document).on('click','.user', function(event) {
    const target = $(event.target).parent();
    const id = target.data('id');
    if (id) {
        console.log("event: " + id);
        loadChatColumn(id);
    }
});


/**
 * Displays the messages between the logged in and another user.
 * @param {integer} participant_2_id - The second users id (who they are chatting with)
 */
function loadChatColumn(participant_2_id) {

    // load the chat html into column three
    $('#main-col3').load(`static/html/col3/chat.html`, function() {

        // once complete, display messages
        console.log("load id: " + participant_2_id)
        displayMessages(participant_2_id);

    });
    
}

/**
 * Displays the messages of a specific user in the chat container
 * @param {integer} participant_2_id - The id of the other user in the conversation
 */
function displayMessages(participant_2_id) {
    const messages = getMessages(participant_2_id);
    _open_conversation = participant_2_id;
    for (message of messages) {
        appendMessageToChat(message);
    }
    clearInterval(_updateMessagesInterval);
    _updateMessagesInterval = setInterval(updateMessages, 1000);
}

/**
 * Appends a message to the bottom of the chat container
 * @param {object} message - The message data
 */
function appendMessageToChat(message) {

    /* Format expected:
    let message = {
                message_id: 1,
                sender_id: 1,
                message_sender_name: "John Doe",
                message_time: "123:123",
                message_seen: false,
                message_content: "this is my message",
                outbound: false
                };
    */

    const outboundClass = message.outbound ? " outbound" : "";
    const seen = message.message_seen ? " | Seen" : "";
    // format the message in html
    let html = `
    
        <div class="message-wrap">
        <div class="message${outboundClass}" data-message-id="${message.message_id}">
            <p class="mes-party">${message.user_first_name} ${message.user_last_name}${seen}</p>
            <div class="mes-bubble">
                <div class="mes-text">
                <p>${message.message_content}</p>
                </div>
            </div>
            <time class="mes-info">${message.message_time}</time>
            </div>
        </div>
    
    `;
    // append the message to the chat container
    $("#messages").append(html);
    // scroll down to show new message
    scrollBottomOfChat();

}

/**
 * Gets the messages between two from the api
 * @param {integer} participant_2_id - ID of the second participant
 * @returns {array} messages - Returns an array of message objects
 */
function getMessages(participant_2_id) {

    const apiUrl = "/api/chats/get/" + participant_2_id;
    console.log(apiUrl);
    var messages = [];
    jQuery.ajax({
        url: apiUrl,
        success: function (result) {
            messages = result;
        },
        error: function () {
            alert("error: there was a problem loading your messages");
        },
        async: false
    });
    return messages;
}

/**
 * Sends a message to the API and appends it to the chat.
 * @param {integer} participant_2_id 
 * @param {object} message
 * @see appendMessageToChat
 */
function sendMessage(participant_2_id, message_to_send) {
    console.log(message_to_send);
    $.ajax({ 
        url   : '/api/chats/send/' + participant_2_id,
        type  : "POST",
        data  : {message: message_to_send}, // data to be submitted
        success: function(response){
           const chatContainer = $("#search-results");
           if (!response.error) {
            const message = response;
            console.log(message);
            appendMessageToChat(message);
           } else {
            error(response.error);
           }
        },
        error: function (e) {
            error("Unable to send message, please try again.", e);
        }
    });

}

function updateMessages() {
    const container = $("#messages");
    if (container.length) {
        $("#messages").empty()
        displayMessages(_open_conversation);
    } else {
        clearInterval(updateMessagesInterval);
    }
}

let updateMessagesInterval = setInterval(updateMessages, 500);

$(document).on('submit','#new-message', function(e){
    // stop form from submitting
    e.preventDefault();
    // get message
    let message = $('#chat-send-message').val();
    if (message != "") {
        sendMessage(_open_conversation, message);
    }
 }) 

/***
 * Scrolls the chat container down the the bottom
 */
function scrollBottomOfChat() {
    var chat = $('#messages');
    var height = chat[0].scrollHeight;
    chat.scrollTop(height);
}

/**
 * Displays an error message to the user | logs error information
 * @param {string} message -- The error message to display
 * @param {error} error -- Optional: Pass error to be logged if catching errors.
 */
function error(message, error) {
    // TODO: display message somewhere
    if (error) {
        console.log(error);
    }
}







