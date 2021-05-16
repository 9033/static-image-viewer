require('dotenv').config();
const Sequelize = require('sequelize');
// const env = process.env.NODE_ENV || 'development';
const db = {};

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: process.env.DB_ADDRESS,
  dialect: 'mariadb',
  // ssl:true,
  dialectOptions: {
    ssl: {
      // require: true,
      rejectUnauthorized: false // <<<<<<< YOU NEED THIS: "self signed certificate in certificate chain"
    }
    // ssl:true,
    // ssl: {
    //   key: cKey,
    //   cert: cCert,
    //   ca: cCA
    // },
    // connectTimeout: 1000,
  } // mariadb connector option
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.models = {};

const tables = require('./tables');
for(let table of Object.keys(tables)){
  db.models[table] = tables[table](db.sequelize, db.Sequelize);
}

module.exports = db;
