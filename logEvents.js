const {format:dateFormat} = require('date-fns');
const {v4: uuid} = require('uuid'); 

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async(message) => {
    const dateTime = `${dateFormat(new Date(), 'yyyy MMMM dd\tH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    try {
        if(!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, "logs"))
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', 'eventLogs.txt'), logItem);
    }catch (err) {
        console.error(err);
    }
}

module.exports = logEvents;