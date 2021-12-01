const fs = require("fs");
//获取该目录下的所有文件
function readFiles(pathName) {
  let dirs = [];
  fs.readdirSync(pathName).forEach((file, index) => {
    dirs.push(file);
  });
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
      "E:/HJY/WORKSPACE/safe-demo-server/db/" + dbName
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
function main(pathName, readCarme) {
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
      writePath = "E:/HJY/WORKSPACE/safe-demo-server/db/db1.json";
    } else if (readCarme == 3) {
      writePath = "E:/HJY/WORKSPACE/safe-demo-server/db/db3.json";
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
        console.log("删除文件");
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
exports.main = main;
