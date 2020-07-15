# test
npm install express sequelize sqlite3 body-parser --save
npm install sequelize-cli -g

sequelize init
sequelize model:create --name Users --attributes name:string,email:string,password:string
sequelize db:migrate

