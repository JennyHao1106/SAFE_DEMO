const express = require('express')

const app = express()

const port = 3000
const schedule = require('node-schedule')
//定时JOB
const getDataJob = require('./readFile')
const baseFun = require('./baseFunction')

app.all('*',function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
//历史数据查询
app.get('/history/list', (req, res) => {
    let place = req.query.place;
    let alarmType = req.query.alarmType;
    let resObj=baseFun.queryDb(place,alarmType);
    if(resObj.code==200){
        res.status(200).send(resObj);
    }else{
        res.status(500).send(resObj);
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
//定时器 每一分中读取一次数据 node-schedule
const scheduleCron = ()=>{
    schedule.scheduleJob('* 1 * * * *',()=>{
        getDataJob.main();
    });  
}
scheduleCron();








