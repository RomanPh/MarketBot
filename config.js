require('dotenv').config();

const config = {
 app: {
   port: process.env.PORT || 8080,
   PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN,
   APP_ACCESS_TOKEN: process.env.APP_ACCESS_TOKEN,
   USER_ID: process.env.USER_ID,
   BestBuy_Api_Key: process.env.BestBuy_API_KEY
 },
 db: {
   host: process.env.db_host,
   port: process.env.db_port,
   login: process.env.db_login,
   pass: process.env.db_pass
 }
};

module.exports = config;