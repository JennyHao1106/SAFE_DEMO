const fs = require("fs");
const dbPath = "./db/"
//获取该目录下的所有文件
function readFiles(pathName) {
  let dirs = [];
  try {
    fs.readdirSync(pathName).forEach((file, index) => {
      dirs.push(file);
    });
  } catch (error) {
    
  }
  return dirs;
}
/**
 * 将文件的内容转为对象
 * @param {传入的文件数据} data
 */
function changeToObj(data) {
  let arr = data.split("\n");
  let obj = {};
  arr.forEach((item) => {
    console.log(item)
    if (item.split(":").length > 1) {
      let objName = item.split(":")[0].trim();
      let objVal = item.split(":")[1];
      if (objVal.indexOf(",") != -1) {
        obj[objName] = objVal.split(",")[0].trim();
      } else {
        obj[objName] = objVal.trim();
      }
    }
  });
  return obj;
}
/**
 * 获取当前数据文件中的数据并转换成字符
 * @returns
 */
function getOldDb(carme) {
  try {
    let dbName = "";
    if (carme == 1) {
      dbName = "db1.json";
    } else if (carme == 3) {
      dbName = "db3.json";
    }
    let content = fs.readFileSync(
      dbPath + dbName
    );
    if (content.toString().trim().length == 0) {
      return "";
    } else {
      return content.toString();
    }
  } catch (error) {
    console.log("oldDb false");
  }
}
/**
 * 读取文件
 * @param {*} pathName 
 * @param {*} readCarme 
 */
function jobOne(pathName, readCarme) {
  if (readFiles(pathName).length == 0) {
    console.log("文件夹为空");
  } else {
    /**
     * 将原本的db.json中的数据读取出来并且转换成为数组
     */
    let dataOfDb = {};
    //初始化判断db.json如果为空则进行结构化
    if (getOldDb(readCarme) == "") {
      console.log("getOldDb()");
      dataOfDb.list = [];
      dataOfDb.total = 0;
    } else {
      dataOfDb = JSON.parse(getOldDb(readCarme));
    }
    let writePath = "";
    if (readCarme == 1) {
      writePath = dbPath + "db1.json";
    } else if (readCarme == 3) {
      writePath = dbPath + "db3.json";
    }
    /**
     *将新的数据放到数组中，然后统一转换为写入json文件中（writeFile覆盖写入）
     */
    let fileNames = readFiles(pathName);
    for (let index = 0; index < fileNames.length; index++) {
      let data = fs.readFileSync(pathName + "/" + fileNames[index]).toString();
      let newData = changeToObj(data);
      dataOfDb.list.push(newData);
    }
    dataOfDb.total = dataOfDb.list.length;
    fs.writeFile(writePath, JSON.stringify(dataOfDb), (err) => {
      if (err) {
        console.log("重写失败：", err);
        return;
      } else {
        for (let index = 0; index < fileNames.length; index++) {
          fs.unlink(pathName + "/" + fileNames[index], function (error) {
            if (error) {
              console.log(error);
              return false;
            }
            console.log("删除文件" + fileNames[index]);
          });
        }
      }
    });
  }
}

/**
 * 获取今天需读取的文件目录
 */
function jobTwo() {
  let dirName = "";
  let nowTime = new Date();
  let year = nowTime.getFullYear().toString().slice(2);
  let month = (nowTime.getMonth()+1).toString().length<2?'0'+(nowTime.getMonth()+1).toString():(nowTime.getMonth()+1).toString();
  let day = nowTime.getDate().toString().length<2?'0'+nowTime.getDate().toString():nowTime.getDate().toString();
  dirName = year+'-'+month+'-'+day
  return dirName
}



exports.jobOne = jobOne;
exports.jobTwo = jobTwo;