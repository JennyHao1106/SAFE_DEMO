const express = require('express')

const app = express()

const port = 3000
const schedule = require('node-schedule')
//定时JOB
const getDataJob = require('./readFile')
const baseFun = require('./baseFunction')
const carme3 = "E:/HJY/WORKSPACE/safe-demo-server/carme3";
const carme1 = "E:/HJY/WORKSPACE/safe-demo-server/carme1";
const dbPath = "E:/HJY/WORKSPACE/safe-demo-server/db";

// const http = require('http')
// const fs = require('fs')
// const httpPort = 80

app.all('*',function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
app.use(express.static('public'))
app.get('/public/*', function (req, res) {
    res.sendFile( __dirname + "/" + req.url );
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


// http.createServer((req, res) => {
//   fs.readFile(__dirname+'/public/dist/index.html', 'utf-8', (err, content) => {
//     if (err) {
//         console.log(err)
//       console.log('We cannot open "index.html" file.')
//     }

//     res.writeHead(200, {
//       'Content-Type': 'text/html; charset=utf-8'
//     })

//     res.end(content)
//   })
// }).listen(httpPort, () => {
//   console.log('Server listening on: http://localhost:%s', httpPort)
// })

//历史数据查询
app.get('/history/list',  async (req, res) => {
    let carme = req.query.carme;
    let readPath='';
    if(carme ==1){
        readPath = dbPath+'/db1.json'
    }
    else if(carme ==3){
        readPath = dbPath+'/db3.json'
    }
    await baseFun.queryDb(readPath).then(reslut=>{
        res.status(200).send(reslut);
    }).catch(err=>{
        res.status(500).send(err);
    })
})


//定时器 每一分中读取一次数据 node-schedule
const scheduleCron = ()=>{
    schedule.scheduleJob('30 * * * * *',()=>{
        getDataJob.main(carme3,3);
        getDataJob.main(carme1,1);
    });  
}
scheduleCron();








