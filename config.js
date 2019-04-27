require('dotenv').config();

const config = {
 app: {
   port: process.env.PORT || 8080,
   PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN,
   APP_ACCESS_TOKEN: process.env.APP_ACCESS_TOKEN,
   USER_ID: process.env.USER_ID
 },
 db: {
   host: 'localhost',
   port: 27017,
   name: 'db'
 }
};

module.exports = config;