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

