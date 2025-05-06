-- Crear base de datos DANIMO si no existe
CREATE DATABASE IF NOT EXISTS DANIMO;
USE DANIMO;

-- Crear usuario con contraseña
CREATE USER IF NOT EXISTS 'grupo101'@'localhost' IDENTIFIED BY 'grupo101';

-- Darle todos los privilegios sobre la base de datos
GRANT ALL PRIVILEGES ON *.* TO 'grupo101'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Crear tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario (
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       nombre VARCHAR(100) NOT NULL
    );

-- Insertar un usuario de prueba
INSERT INTO Usuario (nombre) VALUES ('Ana');


-- CORRER ESTE ARCHIVO
-- mysql < schema.sql