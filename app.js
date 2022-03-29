const express = require('express')

const app = express()

const port = 3000
const schedule = require('node-schedule')
//定时JOB
const getDataJob = require('./job/jobDetail')
const prodSafe = require('./router/prodSafe')
const faceSafe = require('./router/faceSafe')
const faceInfo = require('./router/faceInfo')
let config;
let dirName;

if (process.env.NODE_ENV == 'production') {
    config = require('./prod.js')
} else {
    config = require('./dev.js')
}

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
app.use(express.static('public'))
app.get('/public/*', function (req, res) {
    res.sendFile(__dirname + "/" + req.url);
})
app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
})

app.use('/prodsafe', prodSafe);
app.use('/facesafe', faceSafe);
app.use('/faceinfo', faceInfo);

//定时器 每天更新目录文件 每天凌晨更新
const scheduleCronTwo = () => {
    schedule.scheduleJob('30 1 1 * * *', () => {
        dirName = config.camerPath + getDataJob.jobTwo()
    });
}

dirName = config.camerPath + getDataJob.jobTwo()
//定时器 每一分中读取一次数据 node-schedule
const scheduleCronOne = () => {
    schedule.scheduleJob('30 * * * * *', () => {
        getDataJob.jobOne(dirName + '/carme3', 3);
       // getDataJob.jobOne(dirName + '/carme1', 1); 以后人员信息从接口中获取，不再读取文件
    });
}

const scheduleCronForHK = () => {
    schedule.scheduleJob('*/5 * * * *', () => {
        getDataJob.jobToGetHK(config.faceUrl)
    });
}



// scheduleCronOne();
// scheduleCronTwo();
scheduleCronForHK();








