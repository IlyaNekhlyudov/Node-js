const fs = require('fs');
const path = require('path');
const http = require('http');

http.createServer(async (req, res) => {
    if (!req.headers.accept.includes('text/html')) {
        res.writeHead(404, 'Not found');
    } // сделал, чтобы фавикон не подгружался

    let result;
    if (req.url === '/') {
        result = await dirExplorer();
    } else {
        result = await dirExplorer(req.url);
    }

    res.write(result);
    res.end();
}).listen(3000, 'localhost');

async function dirExplorer(currPath = null) {
    let executionDir = '';
    const isDirectory = (fileName) => fs.lstatSync(fileName).isDirectory();
    if (currPath === null) executionDir = process.cwd();
    else executionDir = path.join(process.cwd(), currPath);

    let list = [];
    try {
        list = fs.readdirSync(executionDir).sort((file) => {
            if (isDirectory(path.join(executionDir, file))) return -1;
            else return 1;
        });
    } catch (e) {
        if (e.code === 'ENOTDIR') {
            return fs.readFileSync(executionDir, {encoding: 'utf-8'});
        }
    }

    let htmlList = ``;
    list.forEach((el) => {
        if (currPath === null) htmlList += `<a href="${el}">${el}</a><br>`;
        else htmlList += `<a href="${currPath + '/' + el}">${el}</a><br>`;
    });

    return htmlList;
}
