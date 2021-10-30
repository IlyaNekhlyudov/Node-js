#!/usr/local/bin/node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const yargs = require('yargs');
const inquirer = require('inquirer');

const options = yargs
    .usage("Usage: -p <path>")
    .option("p",
        {
            alias: "path",
            describe: "Path",
            type: "string"
        }
    )
    .option("f",
        {
            alias: "find",
            describe: "Find line on the File",
            type: "string"
        }
    ).argv;

dirExplorer(options.path, options.find);

function dirExplorer(currPath = null, find = null) {
    let executionDir = '';
    const isDirectory = (fileName) => fs.lstatSync(fileName).isDirectory();

    if (currPath === null) executionDir = process.cwd();
    else {
        if (!isCorrectDirectory(currPath)) return false;
        executionDir = currPath;
    }


    const list = fs.readdirSync(executionDir).sort((file) => {
        if (isDirectory(path.join(executionDir, file))) return -1;
        else return 1;
    });

    inquirer.prompt([
        {
            name: 'fileName',
            type: 'list',
            message: 'Choose a file to read',
            choices: list,
        }
    ])
        .then(({fileName}) => {
            const fullPath = path.join(executionDir, fileName);

            if (isDirectory(fullPath)) return dirExplorer(fullPath, find);

            if (find === null) {
                fs.readFile(fullPath, 'utf-8', (err, data) => {
                    if (err) console.log(err);
                    else console.log(data);
                });
            } else {
                return findLineOnTheFile(fullPath, find);
            }
        });
}

function isCorrectDirectory(path) {
    let isDirectory = (fileName) => fs.lstatSync(fileName).isDirectory();

    if (!fs.existsSync(path)) {
        console.log('Укажите верный путь к директории.');
        return false;
    } else if (!isDirectory(path)) {
        console.log('Это файл. Укажите директорию.');
        return false;
    }

    return true;
}

function findLineOnTheFile(path, searchQuery) {
    const readStream = fs.createReadStream(path, 'utf-8');
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    let arrResults = [];

    rl.on('line', (line) => {
        if (line.includes(searchQuery) !== false) {
            arrResults.push(line);
        }
    });

    rl.on('close', () => {
       if (arrResults.length === 0) {
           console.log('В файле не удалось найти данный текст.');
       } else {
           console.log('В файле найден текст. Вот массив строк:');
           console.log(arrResults);
       }
    });
}

