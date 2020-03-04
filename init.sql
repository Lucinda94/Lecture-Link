CREATE TYPE status as enum('Online', 'Away', 'Busy');
CREATE TYPE role as enum('Student', 'Lecturer', 'Moderator', 'Admin');
CREATE TABLE user_account(
					user_id SERIAL PRIMARY KEY,
					user_first_name varchar(35) NOT NULL,
					user_last_name varchar(35) NOT NULL,
					user_email varchar(255) NOT NULL,
					user_password varchar NOT NULL,
					user_role role NOT NULL DEFAULT 'Student',
					user_status status NOT NULL);

CREATE TYPE relationship as enum('Saved', 'Blocked');
CREATE TABLE user_relationship (
								user_id int REFERENCES user_account(user_id),
								ref_user_id int REFERENCES user_account(user_id),
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
								flagged_message_id int REFERENCES chat_message(message_id));

CREATE TYPE session_status as enum('Open', 'Closed');
CREATE TABLE live_session (
							live_session_id int PRIMARY KEY,
							live_sesion_name varchar(50) NOT NULL,
							live_session_owner_id int REFERENCES user_account(user_id) NOT NULL,
							live_session_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
							live_session_status session_status NOT NULL);

CREATE TABLE live_message (
							live_message_id int PRIMARY KEY,
							live_session_id int REFERENCES live_session(live_session_id) NOT NULL,
							user_id int REFERENCES user_account(user_id) NOT NULL,
							live_message_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
							live_message_content varchar(255) NOT NULL);

/* Default Admin Credentials */
INSERT INTO user_account (	user_id,
							user_first_name,
							user_last_name,
							user_email,
							user_password,
							user_role,
							user_status)
					VALUES (
						'0',
						'Admin',
						'Account',
						'admin@example.com',
						'$2b$10$Qthz5oJCb2F45CtEXisoUO1s3AEDrfXBDSrmNnlSo/9qH6GXHhNOW',
						'Admin',
						'Away'
					);

/* Dummy Data */

-- Students
INSERT INTO user_account (	
							user_id,
							user_first_name,
							user_last_name,
							user_email,
							user_password,
							user_status)
					VALUES 
					('1', 'Austin', 'Collins', 'up904254@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('2', 'Alden', 'Cantrell', '2@myport.ac.uk', '0', 'Away'),
					('3', 'Kierra', 'Gentry', '3@myport.ac.uk', '0', 'Busy'),
					('4', 'Pierre', 'Cox', '4@myport.ac.uk', '0', 'Away'),
					('5', 'Thomas', 'Crane', '5@myport.ac.uk', '0', 'Online'),
					('6', 'Miranda', 'Shaffer', '6@myport.ac.uk', '0', 'Online'),
					('7', 'Bradyn', 'Kramer', '7@myport.ac.uk', '0', 'Away'),
					('8', 'Aiden', 'Cummings', '8@myport.ac.uk', '0', 'Busy'),
					('9', 'Cassie', 'Dean', '9@myport.ac.uk', '0', 'Away'),
					('10', 'Cailyn', 'Chapman', '10@myport.ac.uk', '0', 'Online'),
					('11', 'Katrina', 'Roy', '11@myport.ac.uk', '0', 'Away');
-- Lecturers
INSERT INTO user_account (	
		user_id,
		user_first_name,
		user_last_name,
		user_email,
		user_password,
		user_role,
		user_status)
VALUES 
('12', 'Dustin', 'Mcgrath', 'dmcgrath@port.ac.uk', '0', 'Lecturer', 'Away'),
('13', 'Sid', 'Schaefer', 'sschaefer@port.ac.uk', '0', 'Lecturer', 'Online'),
('14', 'Khadeejah', 'Holden', 'kholden@port.ac.uk', '0', 'Lecturer', 'Busy');
-- Relationships
INSERT INTO user_relationship (	user_id,
								ref_user_id,
								type_of_relationship)
							VALUES
							(1, 2, 'Saved'),
							(1, 3, 'Blocked'),
							(1, 4, 'Saved'),
							(1, 5, 'Saved'),
							(1, 6, 'Saved'),
							(1, 7, 'Saved'),
							(1, 8, 'Saved'),
							(1, 12, 'Saved'),
							(1, 13, 'Saved'),
							(1, 9, 'Saved');

