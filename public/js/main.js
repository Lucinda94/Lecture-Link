
/**
 *
 * @module /frontend/main
 */

//
$(function() {
    // Load the column two default.
    col2LoadConversations();
});

/**
 * Loads a html file into column two (#main-col2) from the 'static/html/col2' directory.
 * @param {string} dir - The html file to be loaded.
 * @param {callback} callback - Callback when the html has finished loading.
 */
function col2Load(dir, callback) {
    $('#main-col2').load(`static/html/col2/${dir}`, callback);
}

/**
 * Loads conversations into column two
 * @function
 */
function col2LoadConversations() {
    // load discover into col2
    col2Load(`conversations/main.html`, function() {
        // perform any functions to load dynamic content
    });

}
$("#n2-button-conversations").click(col2LoadConversations);

/**
 * Loads the discover column into column 2
 * @function
 */
function col2LoadDiscover() {
    // load discover into col2
    col2Load(`discover/main.html`, function() {
        // perform any functions to load dynamic content
    });
}
$("#n2-button-discover").click(col2LoadDiscover);

/**
 * Updates the search results in the discver column when 'Update Results' button is clicked.
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
                const lecturerClass = (user.user_role === "Lecturer") ? " lecturer" : "";
                const html = `<div class="user${lecturerClass}" data-id="${id}">
                                 <p class="name">${name}</a><span class="add-user"><i class="fas fa-user-plus"></i></p>
                                 <p>${email}</p>
                              </div>`;
                              console.log(html);
                resultsContainer.append(html);
            }
         }
    });
    return false;
 })

/****
 * Relationships
 */
function col2LoadRelationships(event) {

    // display the relationships column
    col2Load(`relationships.html`, function() {
        var result = null;
        const titleElem = $("#relationships-header");
        const resultsContainer = $("#relationships-results");
        var apiUrl = null;

        // Get the api url to call and update the title.
        if (event.data.type_of_relationship === "Lecturers") {
            titleElem.text("Saved Lecturers");
            apiUrl = "/api/user/relationships/lecturers";
        } else if (event.data.type_of_relationship === "Saved") {
            titleElem.text("Saved Students");
            apiUrl = "/api/user/relationships/saved";
        } else if (event.data.type_of_relationship === "Blocked") {
            titleElem.text("Blocked Users");
            apiUrl = "/api/user/relationships/blocked";
        }

        // get users from the api
        $.get(apiUrl, function( users ) {
            if (users) {
                // display each user
                for (user of users) {
                    // extract values form jquery
                    const id = user.user_id
                    const name = user.user_first_name + " " + user.user_last_name;
                    const email = user.user_email;
                    const lecturerClass = (user.user_role === "Lecturer") ? " lecturer" : "";
                    const html = `<div class="user${lecturerClass}" data-id="${id}">
                                    <p class="name">${name}</a><span class="add-user"><i class="fas fa-user-minus"></i></p>
                                    <p>${email}</p>
                                </div>`;
                    resultsContainer.append(html);
                }
            } else {
                alert("error: there was a problem loading your relationships");
            }
        });
    });

}
/**
 * Click event listeners
 * @param {object} parameters - Options passed to the event handler.
 * @param {callback} callback - The event handler
 * @listens ClickEvent
 */
$("#n2-button-saved-students").click({type_of_relationship: "Saved"}, col2LoadRelationships);
$("#n2-button-saved-lecturers").click({type_of_relationship: "Lecturers"}, col2LoadRelationships);
$("#n2-button-blocked").click({type_of_relationship: "Blocked"}, col2LoadRelationships);


/*
  * Sending verification emails
  */

function sendVerificationEmail (user_email){
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
    	service: 'gmail',
    	auth: {
        userEmail: 'ouremail@gmail.com',
        password: 'ourpassword'
      }
    });

    var options = {
    	sender: 'ouremail@gmail.com',
      receiver: user_email,
      subject: 'Verification Email for Lecture Link',
      content: '4 digit code here'
    };

    transporter.sendMail(options, function(error, info){
    	if (error) {
    	   console.log(error)
    	}
    	else {
    		console.log('Email sent' + info);
    		}
    });
  }
