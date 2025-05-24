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


Para poder ejecutar tests automatizados

1. Ejecutar npm install --save-dev mocha chai supertest
2. Ejecutar npm install --save-dev sqlite3
3. Ejecutar npm install --save-dev cross-env
4. Poner NODE_ENV='test' en archivo .env
5. Asegurarse que dentro de package.json en la seccion de scripts este definido "test": "cross-env NODE_ENV=test mocha \"test/**/*.test.js\""
6. Ejecutar npm test

