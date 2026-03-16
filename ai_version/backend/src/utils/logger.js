const fs = require("fs");

const path = require("path");

const logFile = path.join(__dirname,"../../logs.txt");


/*
Logger simple
*/

exports.log = (level,message)=>{

  const line =
  `[${new Date().toISOString()}] ${level} : ${message}\n`;

  fs.appendFileSync(logFile,line);

};