-- ⚠️ Eliminar la base de datos si existe (¡peligroso!)
DROP DATABASE IF EXISTS danimo;

-- Crear la base de datos
CREATE DATABASE danimo;

-- Conectarse a la base de datos (solo funciona en clientes interactivos como psql)
-- \c danimo

-- Crear el rol/usuario solo si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = 'grupo101'
    ) THEN
CREATE ROLE grupo101 LOGIN PASSWORD 'grupo101';
END IF;
END
$$;

-- Dar todos los privilegios sobre la base de datos
GRANT ALL PRIVILEGES ON DATABASE danimo TO grupo101;

-- Conectarse a la base para dar permisos sobre el esquema
\connect danimo

-- Dar permisos sobre el esquema 'public' para que pueda crear tablas
GRANT USAGE ON SCHEMA public TO grupo101;
GRANT CREATE ON SCHEMA public TO grupo101;
