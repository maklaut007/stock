/*Some queries could be changed during development*/
/*work with db*/
CREATE DATABASE testbase;
DROP DATABASE testbase;
USE testbase;

/*Creating tables*/
CREATE TABLE users(
	id INT AUTO_INCREMENT,
   	phone VARCHAR(15),
   	name VARCHAR(50) NOT NULL,
   	email VARCHAR(50) NOT NULL,
   	password VARCHAR(50) NOT NULL,
   	PRIMARY KEY(id)
);

CREATE TABLE items(
	id INT AUTO_INCREMENT,
   	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   	title VARCHAR(50) NOT NULL,
   	price DECIMAL(12, 2) NOT NULL,
   	image VARCHAR(255),
   	user_id INT,
   	PRIMARY KEY(id),
   	FOREIGN KEY(user_id) REFERENCES Users (Id)
);


/*Queries*/
SELECT * FROM users
SELECT * FROM items


/*1 Login*/
SELECT id FROM users WHERE email = ? AND password = ?;


/*2 Register*/
SELECT id FROM users WHERE users.email = ?;

INSERT INTO users(name, email, phone, password) VALUES (?, ?, ?, ?)


/*3 Get curent user*/
SELECT id, phone, name, email  FROM users WHERE id = ?


/*4 Get all items*/
SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id, users.name, users.phone, users.email 
FROM items 
INNER JOIN users ON users.id = items.user_id;


/*5 Get one item*/
SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id, users.name, users.phone, users.email 
FROM items 
INNER JOIN users ON users.id = items.user_id 
WHERE items.id = ?;


/*6 Update item*/         /*Chtoto pridumat dlya multiple row*/
SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id, users.name, users.phone, users.email 
FROM items 
INNER JOIN users ON users.id = items.user_id 
WHERE items.id = ? ;

UPDATE items SET title = ?, price = ?  WHERE items.id = ? AND items.user_id = ?;


/*7 Delete item*/
SELECT user_id FROM items WHERE items.id = ? ;

DELETE FROM items WHERE items.id = ? AND items.user_id= ?;


/*8 Create item*/
INSERT INTO items(title, price, user_id) VALUES (?,?,?);

SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id, users.name, users.phone, users.email 
FROM items 
INNER JOIN users ON users.id = items.user_id 
WHERE items.id = ?


/*8 Upload image item*/
SELECT image FROM items WHERE items.id = ? AND user_id = ?;
SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id, users.name, users.phone, users.email 
FROM items INNER JOIN users ON users.id = items.user_id WHERE items.id = ? 




