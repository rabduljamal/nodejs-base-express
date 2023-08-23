const model = require(appDir+'/app/models/index');
const { Sequelize, Op } = require('sequelize');
var fs = require('fs')
let moment = require('moment');
let numeral = require('numeral');

var CronJob = require('cron').CronJob;
process.env.TZ = 'Asia/Jakarta'

var cron = function(){
  
  var job = new CronJob('5 * * * * *', async() => {
    try {
      
      // await Promise.all(data.map(async (order, i) => {
        
      // }))
        
    } catch (error) {  
      console.error(error);
    } 
  });

  job.start();
}


module.exports = cron;