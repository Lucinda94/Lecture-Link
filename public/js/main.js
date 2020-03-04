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

// conversations
function col2LoadConversations() {
    // load discover into col2
    $('#main-col2').load(`static/html/col2/conversations/main.html`, function() {
        // perform any functions to load dynamic content
    });

}
$("#n2-button-conversations").click(col2LoadConversations);

// discover
function col2LoadDiscover() {
    // load discover into col2
    $('#main-col2').load(`static/html/col2/discover/main.html`, function() {
        // perform any functions to load dynamic content
    });
}
$("#n2-button-discover").click(col2LoadDiscover);

// relationships (same for lecturers/students/blocked, will just load different content)
function col2LoadRelationships(event) {

    // display the relationships column
    $('#main-col2').load(`static/html/col2/relationships.html`, function() {

        var result = null;
        const titleElem = $("#relationships-header");

        if (event.data.type_of_relationship === "Lecturers") {

            titleElem.text("Saved Lecturers");
            /*$.get( "/api/user/relationships/lecturers", function( data ) {
                result = data;
            });*/

        } else if (event.data.type_of_relationship === "Saved") {
        
            titleElem.text("Saved Students");
            /*$.get( "/api/user/relationships/saved", function( data ) {
                result = data;
            });*/

        } else if (event.data.type_of_relationship === "Blocked") {
        
            titleElem.text("Blocked Users");
            /*$.get( "/api/user/relationships/blocked", function( data ) {
                result = data;
            });*/

        }

        if (result) {

            // TODO: add the results to the page

        } else {
            //alert("error: there was a problem loading your relationships");
        }
    });

}
$("#n2-button-saved-students").click({type_of_relationship: "Saved"}, col2LoadRelationships);
$("#n2-button-saved-lecturers").click({type_of_relationship: "Lecturers"}, col2LoadRelationships);
$("#n2-button-blocked").click({type_of_relationship: "Blocked"}, col2LoadRelationships);

/****
 * Discover Column
 * - Handles loading searches from the API and displaying them.
 */
$(document).on('submit','#user-search', function(e){
    // stop form from submitting
    e.preventDefault();
    // post ajax request to API with form values
    var form = $(this);
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