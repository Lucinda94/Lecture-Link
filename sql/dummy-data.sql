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
					('5', 'Austin', 'Collins', 'up904254@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('6', 'Zahid', 'Awan', 'up895058@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('7', 'Alistair', 'Julnes', 'up897828@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('8', 'Jack', 'Sines', 'up901354@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('9', 'Lucinda', 'Cole', 'up883852@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),
					('10', 'Lybin', 'Babu', 'up898707@myport.ac.uk', '$2b$10$8G5w9Csq7yYBEziSit8HNuDomO0fRdF4GPzAYgTPegcsWVpdrB0My', 'Online'),

					('11', 'Alden', 'Cantrell', '2@myport.ac.uk', '0', 'Away'),
					('12', 'Kierra', 'Gentry', '3@myport.ac.uk', '0', 'Busy'),
					('13', 'Pierre', 'Cox', '4@myport.ac.uk', '0', 'Away'),
					('14', 'Thomas', 'Crane', '5@myport.ac.uk', '0', 'Online'),
					('15', 'Miranda', 'Shaffer', '6@myport.ac.uk', '0', 'Online'),
					('16', 'Bradyn', 'Kramer', '7@myport.ac.uk', '0', 'Away'),
					('17', 'Aiden', 'Cummings', '8@myport.ac.uk', '0', 'Busy'),
					('18', 'Cassie', 'Dean', '9@myport.ac.uk', '0', 'Away'),
					('19', 'Cailyn', 'Chapman', '10@myport.ac.uk', '0', 'Online'),
					('20', 'Katrina', 'Roy', '11@myport.ac.uk', '0', 'Away');
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
('21', 'Dustin', 'Mcgrath', 'dmcgrath@port.ac.uk', '0', 'Lecturer', 'Away'),
('22', 'Sid', 'Schaefer', 'sschaefer@port.ac.uk', '0', 'Lecturer', 'Online'),
('23', 'Khadeejah', 'Holden', 'kholden@port.ac.uk', '0', 'Lecturer', 'Busy');

