Pasos para levantar servidor node
1. Ejecutar npm install
2. Ejecutar node index.js

Complementos ubuntu necesarios

npm install sequelize mysql2

Crear base de datos
sudo mysql < schema.sql

Cosas que me pidió instalar para ejecutar el script python de reconocimiento de emociones
pip install opencv-python
pip install deepface
pip install tf-keras


Levantar con postgre
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql


sudo -u postgres psql -f ./schemaPostgre.sql
npm install pg pg-hstore
DB_PORT=5432