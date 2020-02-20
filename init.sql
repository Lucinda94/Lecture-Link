CREATE TYPE status as enum('Online', 'Away', 'Busy');
CREATE TABLE user_account(
					user_id int PRIMARY KEY,
					user_first_name varchar(35) NOT NULL,
					user_last_name varchar(35) NOT NULL,
					user_email varchar(255) NOT NULL,
					user_password varchar(50) NOT NULL,
					user_status status NOT NULL);

CREATE TYPE relationship as enum('Saved', 'Blocked');
CREATE TABLE user_relationship (
								user_id int PRIMARY KEY REFERENCES user_account(user_id),
								type_of_relationship relationship NOT NULL);

CREATE TABLE chat (
					chat_id int PRIMARY KEY,
					user_id_1 int REFERENCES user_account(user_id) NOT NULL,
					user_id_2 int REFERENCES user_account(user_id) NOT NULL);
					
CREATE TABLE message (
						message_id int PRIMARY KEY,
						chat_id int REFERENCES chat(chat_id) NOT NULL,
						message_time timestamp NOT NULL,
						message_content varchar(255) NOT NULL,
						message_sender_id int REFERENCES chat(user_id_1) NOT NULL);

CREATE TABLE report (
								report_id int PRIMARY KEY,
								report_status varchar(50),
								report_comments varchar(255),
								flagged_message_id int REFERENCES message(message_id));

CREATE TABLE live_session (
							live_session_id int PRIMARY KEY,
							live_sesion_name varchar(50) NOT NULL,
							live_session_owner_id int REFERENCES user_account(user_id) NOT NULL,
							live_session_date timestamp NOT NULL);

CREATE TABLE live_message (
							live_message_id int PRIMARY KEY,
							live_session_id int REFERENCES live_session(live_session_id) NOT NULL,
							user_id int REFERENCES user_account(user_id) NOT NULL,
							live_message_time timestamp NOT NULL,
							live_message_content varchar(255) NOT NULL);
