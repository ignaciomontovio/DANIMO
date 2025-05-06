-- Eliminar la base de datos si existe (opcional y peligroso en producción)
DROP DATABASE IF EXISTS DANIMO;

-- Crear base de datos DANIMO si no existe
CREATE DATABASE IF NOT EXISTS DANIMO;
USE DANIMO;

-- Crear usuario con contraseña (solo si no existe)
CREATE USER IF NOT EXISTS 'grupo101'@'localhost' IDENTIFIED BY 'grupo101';

-- Darle todos los privilegios sobre la base de datos DANIMO
GRANT ALL PRIVILEGES ON DANIMO.* TO 'grupo101'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Crear tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario (
                                       id VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni INT NOT NULL
    );

-- Insertar un usuario de prueba (descomenta si quieres probar)
-- INSERT INTO Usuario (id, nombre, apellido, dni) VALUES ('1', 'Ana', 'Saavedra', 38345234);
