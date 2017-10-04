'use strict';

const watch = require('node-watch');
const logger = require('winston');
const fs = require('fs');
const path = require('path');

if(process.argv.length < 4){
    logger.warn("Usage > npm start [ /path/from/file.txt ] [ /path/to/file.txt ] or npm start [ /path/from ] [ /path/to ]");
    return;
}

const filesFromRoot = process.argv[2];
const filesToRoot = process.argv[3];

logger.info('Watching %s ...', path.basename(filesFromRoot));
logger.info('Changing in %s ...', path.basename(filesToRoot));

let changeFile = (file, data) => {
    fs.writeFile(file, data, 'utf8', (err) => {
        if (err) return logger.error(err);
        logger.info('%s was changed succefuly.', path.basename(file));
    });
};

watch(filesFromRoot, { recursive: true }, (evt, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        
        if (err) return logger.error(err);
        
        if(fs.statSync(filesToRoot).isDirectory()){
            changeFile(filesToRoot + "/" + file.replace(filesFromRoot,""), data);
        } else {
            changeFile(filesToRoot, data);
        }

    });
});