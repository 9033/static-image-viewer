var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/*
readDir: readdir의 리턴값.
nowPath: 현재 위치의 path
*/
const readDirFiles = async (readDir = [], nowPath, sortFolderByTime = false) =>{
  // const folderNames = []
  const folders = []
  const imgNames = []
  if(Array.isArray(readDir)){
    for(let dirent of readDir){
      if(dirent.isDirectory()){
        folders.push({
          name:dirent.name,
          stat:(sortFolderByTime)?(await fs.promises.stat(path.join(nowPath, dirent.name))):{},
        })
      } else if(dirent.isFile() && dirent.name.match(/.+[.](.+)$/) && ['jpg','jpeg', 'png','gif', 'webp'].includes(dirent.name.match(/.+[.](.+)$/)[1]) ){
        imgNames.push(dirent.name)
      }
    }
  }

  if(sortFolderByTime){ // 변경된 시간 - 내림차순.
    /*
    aTimeMs - 읽은 시간
    mTimeMs - 내용 혹은 속성(권한 등)이 변경된 시간
    cTimeMs - 속성(권한 등)이 변경된 시간
    */
    folders.sort(
      (a,b)=>{
        // console.log(a.stat.mtimeMs, b.stat.mtimeMs);
        return b.stat.mtimeMs - a.stat.mtimeMs;
      }
    )
  }

  return {
    folderNames:folders.map(f=>f.name),
    imgNames,
  }
}

/* GET home page. */
router.get(['/*'], async function(req, res, next) {
  const dataPath = req.app.get('dataPath')
  const dirName = req.params['0']
  const newPath = (dirName)?path.join(dataPath, dirName):dataPath
  try{
    const readDir = await fs.promises.readdir(newPath, {withFileTypes: true}) // withFileTypes was added after fs.promises
    res.render('index', {
      title: 'Express',
      ...(await readDirFiles(readDir, newPath, !dirName)),
      dirName,
    });
  } catch(e){ // not found
    console.error(e);
    next();
  }
});

module.exports = router;
