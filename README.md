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


Configuraciones para poder ejecutar tests automatizados

1. Ejecutar npm install --save-dev mocha chai supertest
2. Ejecutar npm install --save-dev sqlite3
3. Ejecutar npm install --save-dev cross-env
4. Poner NODE_ENV='test' en archivo .env

Cosas a poner en package.json para poder ejecutar tests automatizados

1. "test": "cross-env NODE_ENV=test mocha \"test/**/*.test.js\"" --> esto permite ejecutar todos los tests dentro de la ruta de test
2. "test:users": "cross-env NODE_ENV=test mocha test/users.test.js" --> esto permite ejecutar solamente los tests de users (definir uno para cada módulo)

Ejecutar los tests
1. Ejecutar npm test (corre todos los tests)
2. Ejecutar npm run test:modulo para correr test de un solo módulo. Ejemplo: npm run test:professionals 


