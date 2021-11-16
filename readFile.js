const fs = require("fs");
const pathName = "E:/HJY/WORKSPACE/safe-demo-server/data";
//获取该目录下的所有文件
function readFiles() {
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
    if (item.split(":").length > 0) {
      let objName = item.split(":")[0].trim();
      let objVal = item.split(":")[1];
      if (objVal.indexOf(",") != -1) {
        obj[objName] = objVal.split(",")[0];
      } else {
        obj[objName] = objVal;
      }
    }
  });
  return obj;
}
/**
 * 获取当前数据文件中的数据并转换成字符
 * @returns
 */
function getOldDb() {
  try {
    let content = fs.readFileSync("E:/HJY/WORKSPACE/safe-demo-server/db.json");
    if (content.toString().trim().length==0) {
      return "";
    } else {
      return content.toString();
    }
  } catch (error) {
    console.log("oldDb false");
  }
}
function main() {
  if (readFiles().length == 0) {
    console.log("0");
  } else {
    /**
     * 将原本的db.json中的数据读取出来并且转换成为数组
     */
    let dataOfDb = {};
    //初始化判断db.json如果为空则进行结构化
    if (getOldDb()=='') {
        console.log('getOldDb()')
        dataOfDb.list=[];
        dataOfDb.total = 0;
    } else {
      dataOfDb = JSON.parse(getOldDb());
    }
    /**
     *将新的数据放到数组中，然后统一转换为写入json文件中（writeFile覆盖写入）
     */
    let fileNames = readFiles();
    for (let index = 0; index < fileNames.length; index++) {
      let data = fs.readFileSync(pathName + "/" + fileNames[index]).toString();
      let newData = changeToObj(data);
      dataOfDb.list.push(newData);
    }
    dataOfDb.total = dataOfDb.list.length;
    fs.writeFileSync(
      "E:/HJY/WORKSPACE/safe-demo-server/db.json",
      JSON.stringify(dataOfDb),
      (err) => {
        if (err) {
          console.log("重写失败：", err);
          return;
        }
        console.log("----------  新增成功  -----------");
      }
    );
  }
}

exports.main = main;
