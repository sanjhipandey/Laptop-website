const fs = require("fs");
var http = require("http");
const url = require("url");

const json = fs.readFileSync(`${__dirname}/data/data.json`,`utf-8`);
const laptop = JSON.parse(json);

// console.log(__dirname);
// console.log(laptop);

const server = http.createServer((req, res)=>{
    const pathname = url.parse(req.url, true).pathname;
    console.log(pathname);
    const id = url.parse(req.url, true).query.id;
    // console.log(url.parse(req.url, true));
    if(pathname==='/products'||pathname==='/'){
        res.writeHead(200,{'Content-type':'text/html'});
        fs.readFile(`${__dirname}/templates/template-overview.html`, `utf-8`, (err,data)=>{
            let overviewOutput = data;
            fs.readFile(`${__dirname}/templates/template-card.html`, `utf-8`, (err,data)=>{
                const cardsOutput = laptop.map(el => replaceTemplate(data, el )).join('');//.join('')converts all the array into strings
                overviewOutput = overviewOutput.replace('{%CARD%}', cardsOutput);
                res.end(overviewOutput);
            });
        });

        
    }
    else if(pathname==='/laptop' && id<laptop.length){
        res.writeHead(200,{'Content-type':'text/html'});
        //res.end(`This is LAPTOP page ${id} !`);
        fs.readFile(`${__dirname}/templates/template-laptop.html`, `utf-8`, (err,data)=>{
            const laptopp=laptop[id];
            const output = replaceTemplate(data, laptopp);
            res.end(output);
        });

    }
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathname)){
        fs.readFile(`${__dirname}/data/img${pathname}`,(err, data)=>{
            res.writeHead(200,{ 'Content-type':'image/jpg'});
            res.end(data);
        });

    }
    else{
        res.writeHead(404,{'Content-type':'text/html'});
        res.end('URL was not found in the server');

    }
    
    // res.writeHead(200, {'Content-type':'text/html'});
    // res.end('This is the response !');
});

server.listen(1337, '127.0.0.1', () => { 
    // listening to requests at port 1337 at the given ip address
    console.log('Listening for requests now');
})

function replaceTemplate(originalHtml, laptopp){
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptopp.productName) 
    output = output.replace(/{%IMAGE%}/g, laptopp.image);
    output = output.replace(/{%PRICE%}/g, laptopp.price);
     output = output.replace(/{%SCREEN%}/g, laptopp.screen);
    output = output.replace(/{%CPU%}/g, laptopp.cpu);
     output = output.replace(/{%STORAGE%}/g, laptopp.storage);
    output = output.replace(/{%RAM%}/g, laptopp.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptopp.description);
    output = output.replace(/{%ID%}/g, laptopp.id);
    return output;
    
}