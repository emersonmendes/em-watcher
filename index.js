'use strict';

const watch = require('node-watch');
const logger = require('winston');
const fs = require('fs');
const path = require('path');

if(process.argv.length < 4){
    logger.warn("Usage > npm start [ /path/from/file.txt ] [ /path/to/file.txt ] or npm start [ /path/from ] [ /path/to ]");
    return;
}

const filesFrom = process.argv[2];
const filesTo = process.argv[3];

logger.info('Watching %s ...', filesFrom);
logger.info('Changing in  %s ...', filesTo);

let changeFile = (file, data) => {
    fs.writeFile(file, data, 'utf8', (err) => {
        if (err) return logger.error(err);
        logger.info('%s was changed succefuly.', file);
    });
};

watch(filesFrom, { recursive: true }, (evt, file) => {
    
    logger.info('%s changed.', file);

    fs.readFile(file, 'utf8', (err, data) => {
        
        if (err) return logger.error(err);

        if(fs.statSync(filesTo).isDirectory()){
            changeFile(filesTo + "/" + path.basename(file), data);
        } else {
            changeFile(filesTo, data);
        }

    });

});