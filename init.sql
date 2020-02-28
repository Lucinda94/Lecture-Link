CREATE TYPE status as enum('Online', 'Away', 'Busy');
CREATE TABLE user_account(
					user_id int PRIMARY KEY,
					user_first_name varchar(35) NOT NULL,
					user_last_name varchar(35) NOT NULL,
					user_email varchar(255) NOT NULL,
					user_password varchar(50) NOT NULL,
					user_status status NOT NULL);

CREATE TYPE relationship as enum('Saved', 'Blocked', 'Lecturer');
CREATE TABLE user_relationship (
								user_id int PRIMARY KEY REFERENCES user_account(user_id),
								type_of_relationship relationship NOT NULL);
					
CREATE TABLE chat_message (
						message_id int PRIMARY KEY,
						sender_id int REFERENCES user_account(user_id) NOT NULL,
						receiver_id int REFERENCES user_account(user_id) NOT NULL,
						message_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
						message_seen boolean NOT NULL,
						message_archive boolean NOT NULL,
						message_content varchar(255) NOT NULL);

CREATE TABLE report (
								report_id int PRIMARY KEY,
								report_status varchar(50),
								report_comments varchar(255),
								flagged_message_id int REFERENCES message(message_id));

CREATE TABLE live_session (
							live_session_id int PRIMARY KEY,
							live_sesion_name varchar(50) NOT NULL,
							live_session_owner_id int REFERENCES user_account(user_id) NOT NULL,
							live_session_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE live_message (
							live_message_id int PRIMARY KEY,
							live_session_id int REFERENCES live_session(live_session_id) NOT NULL,
							user_id int REFERENCES user_account(user_id) NOT NULL,
							live_message_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
							live_message_content varchar(255) NOT NULL);
