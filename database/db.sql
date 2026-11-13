CREATE DATABASE happyshop;
USE happyshop;

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(250) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description VARCHAR(500) NOT NULL,
    category VARCHAR(250) NOT NULL,
    quantity int not null,
    image VARCHAR(350) NOT NULL
);

CREATE TABLE rating (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_product INT NOT NULL,
    rate DECIMAL(3,1) NOT NULL,
    count INT NOT NULL,
    FOREIGN KEY (id_product) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE contact (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullName VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
    phone VARCHAR(250) NOT NULL,
    context TEXT NOT NULL
);