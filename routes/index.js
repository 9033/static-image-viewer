var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

const readDirFiles = (readDir = []) =>{
  const folderNames = []
  const imgNames = []
  if(Array.isArray(readDir)){
    for(let dirent of readDir){
      if(dirent.isDirectory()){
        folderNames.push(dirent.name)
      } else if(dirent.isFile() && dirent.name.match(/.+[.](.+)$/) && ['jpg','jpeg', 'png','gif', 'webp'].includes(dirent.name.match(/.+[.](.+)$/)[1]) ){
        imgNames.push(dirent.name)
      }
    }
  }
  return {
    folderNames,
    imgNames,
  }
}

/* GET home page. */
router.get(['/*'], function(req, res, next) {
  const dataPath = req.app.get('dataPath')
  const dirName = req.params['0']
  const newPath = (dirName)?path.join(dataPath, dirName):dataPath
  fs.promises.readdir(newPath, {withFileTypes: true}) // withFileTypes was added after fs.promises
  .then(readDir=>{
    res.render('index', {
      title: 'Express',
      ...readDirFiles(readDir),
      dirName:encodeURI(dirName || ''),
    });
  })
  .catch(e=>{ // not found
    next()
  })
});

module.exports = router;
