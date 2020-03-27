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
					('44', 'Austin', 'Collins', 'up904254@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('2', 'Zahid', 'Awan', '', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('3', 'Alistair', 'Julnes', 'up897828@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('4', 'Jack', 'Sines', 'up901354@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('5', 'Lucinda', 'Cole', 'up883852@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('6', 'Lybin', 'Babu', 'up898707@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),

					('7', 'Alden', 'Cantrell', '2@myport.ac.uk', '0', 'Away'),
					('8', 'Kierra', 'Gentry', '3@myport.ac.uk', '0', 'Busy'),
					('9', 'Pierre', 'Cox', '4@myport.ac.uk', '0', 'Away'),
					('10', 'Thomas', 'Crane', '5@myport.ac.uk', '0', 'Online'),
					('11', 'Miranda', 'Shaffer', '6@myport.ac.uk', '0', 'Online'),
					('12', 'Bradyn', 'Kramer', '7@myport.ac.uk', '0', 'Away'),
					('13', 'Aiden', 'Cummings', '8@myport.ac.uk', '0', 'Busy'),
					('14', 'Cassie', 'Dean', '9@myport.ac.uk', '0', 'Away'),
					('15', 'Cailyn', 'Chapman', '10@myport.ac.uk', '0', 'Online'),
					('16', 'Katrina', 'Roy', '11@myport.ac.uk', '0', 'Away');
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
('17', 'Dustin', 'Mcgrath', 'dmcgrath@port.ac.uk', '0', 'Lecturer', 'Away'),
('18', 'Sid', 'Schaefer', 'sschaefer@port.ac.uk', '0', 'Lecturer', 'Online'),
('19', 'Khadeejah', 'Holden', 'kholden@port.ac.uk', '0', 'Lecturer', 'Busy');

