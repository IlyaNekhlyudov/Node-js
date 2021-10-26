const readline = require('readline');
const fs = require("fs");

const ACCESS_LOG = ".\\Homework 3\\access.log";
const regexIP = /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/gm;

const readStream = fs.createReadStream(ACCESS_LOG, 'utf-8');
let writeStreams = {}

const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    findIPFromFileLine(
        line,
        ['89.123.1.41', '34.48.240.111'],
        regexIP
    );
});

readStream.on('error', function(err) {
    console.log(err);
});

function findIPFromFileLine(line, arr, regex) {
    let result = line.match(regex);
    if (result !== null) {
        arr.forEach((el) => {
           if (result[0] === el) {
               return writeLineInFile(line, result[0]);
           }
        });
    }
    return false;
}

function writeLineInFile(line, ip) {
    if (!writeStreams.hasOwnProperty(ip)) {
        writeStreams[ip] = fs.createWriteStream(
            '.\\Homework 3\\' + ip + '_requests.log',
            {
                flags: 'a',
                encoding: 'utf8'
            }
        );

        writeStreams[ip].on('error', function(err) {
            console.log(err);
        });
    }

    writeStreams[ip].write(line);
    writeStreams[ip].write('\n');
}