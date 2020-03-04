/****
 * Prepare the document when first loaded
 */
$(function() {
    
    // Load the column two default.
    col2LoadConversations();

});
  


/****
 *  Columns
 *  -- Handles the column format and loading the html ect.
 */

 // loads html into col2 from the public/html/col2
function loadCol2(dir) {
    $('#main-col2').load(`static/html/col2/${dir}`, function() {
        console.log('Column two updated.');
    });
}

// conversations
function col2LoadConversations() {
    // load discover into col2
    loadCol2('conversations/main.html');
    // load all of the users conversations

}
$("#n2-button-conversations").click(col2LoadConversations);

// discover
function col2LoadDiscover() {
    // load discover into col2
    loadCol2('discover/main.html');
    // perform any functions to load dynamic content
}
$("#n2-button-discover").click(col2LoadDiscover);

/****
 * Discover Column
 * - Handles loading searches from the API and displaying them.
 */
$(document).on('submit','#user-search', function(e){
    // stop form from submitting
    e.preventDefault();
    // post ajax request to API with form values
    var form = $(this);
    console.log(form.serialize());
    $.ajax({ 
         url   : '/api/user/search/',
         type  : "POST",
         data  : form.serialize(), // data to be submitted
         success: function(response){
            const resultsContainer = $("#search-results");
            // clear previous results
            resultsContainer.empty();
            // loop through results
            for (user of response) {
                // extract values form jquery
                console.log(user);
                const id = user.user_id
                const name = user.user_first_name + " " + user.user_last_name;
                const email = user.user_email;

                const html = `<div class="user" data-id="${id}">
                                 <p class="name">${name}</a><span class="add-user"><i class="fas fa-user-plus"></i></p>
                                 <p>${email}</p>
                              </div>`;
                              console.log(html);
                resultsContainer.append(html);
                // pray
            }

         }
    });
    return false;
 }) 



/****
 * Appending a message to the chat
 */
// for testing
$("#new-message").submit(function(e) {
    e.preventDefault();
    let message = $("#chat-send-message").val();
    appendMessageToChat(true, "You", message, "Now");
});
// appends a message to the chat window
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
// scrolls the chat window to the bottom
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