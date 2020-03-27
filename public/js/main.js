
/**
 *
 * @module frontend/main
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
 * Updates the search results in the discover column when 'Update Results' button is clicked.
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
                                 <p class="name">${name}<span class="add-user"><i class="fas fa-user-plus"></i></span></p>
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
                                    <p class="name">${name}<span class="remove-user"><i class="fas fa-user-minus"></i></span></p>
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


/**
 * Runs when a the user clicks the add user button
 */
$(document).on('click','.add-user', function(event) {
    const target = $(event.target).parent();
    const userCard = target.closest(".user");
    const id = userCard.data('id');
    console.log(id);
    if (id != undefined) {
        console.log("add user: " + id);
        addUser(id, userCard);
    }
});

/**
 * Submits an api request to add (save) a user
 * @param {integer} id - The id to be added
 * @param {object} userCard - Optional: the user card, used to update the add friend button
 */
function addUser(id, userCard) {
    $.ajax({ 
        url   : '/api/user/relationships/add/' + id,
        type  : "POST",
        success: function(response){
           if (response.success === true) {
               // success
                if (userCard) {
                    // card given so update the button
                    const addButton = userCard.children(".name").children(".add-user");
                    addButton.before('<span class="remove-user"><i class="fas fa-user-minus"></i></span>');
                    addButton.remove();
                }
           } else {
               // server error
           }
        },
        error: function (e) {
            error("Unable to add user, try again.", e);
        }
    });
}

/**
 * Runs when a the user clicks the add user button
 */
$(document).on('click','.remove-user', function(event) {
    const target = $(event.target).parent();
    const userCard = target.closest(".user");
    const id = userCard.data('id');
    console.log(id);
    if (id != undefined) {
        console.log("remove user: " + id);
        removeUser(id, userCard);
    }
});

/**
 * Submits an api request to add (save) a user
 * @param {integer} id - The id to be added
 * @param {object} userCard - Optional: the user card, used to update the add friend button
 */
function removeUser(id, userCard) {
    $.ajax({ 
        url   : '/api/user/relationships/remove/' + id,
        type  : "POST",
        success: function(response){
           if (response.success === true) {
               // success
                if (userCard) {
                    // card given so update the button
                    const addButton = userCard.children(".name").children(".remove-user");
                    addButton.before('<span class="add-user"><i class="fas fa-user-plus"></i></span>');
                    addButton.remove();
                }
           } else {
               // server error
               error("Unable to remove user, try again.", "Server Error");
           }
        },
        error: function (e) {
            error("Unable to remove user, try again.", e);
        }
    });
}

/**
 * Displays an error message to the user | logs error information
 * @param {string} message -- The error message to display
 * @param {error} error -- Optional: Pass error to be logged if catching errors.
 */
function error(message, error) {
    alert(message);
    if (error) {
        console.log(error);
    }
}