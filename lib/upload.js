const { client, put, get, putFolder, getFolder, markOnlineDirExist, list, pwd } = require('./ftp');

/** 连接客户端 */
client.connect(require('./loginDetail'));

client.on('ready', () => {
  getFolder('./page').then(() => {
    console.log('上传成功');
  });
  // putFolder('./page').then(() => {
  //   console.log('上传成功');
  // });
  
  // markOnlineDirExist('./other').then(() => {
  //   console.log('success');
  // });

  // put('./functionVersion.json').then(() => {
  //   console.log('上传成功');
  //   get('./functionVersion.json').then(() => {
  //     console.log('下载成功');
  //     client.end();
  //   });
  // });

  // get('./other/四六级.docx').then(() => {
  //   console.log('下载成功');
  //   client.pwd((err, currentpath) => {
  //     console.log(currentpath);
  //     client.end();
  //   });
  // });

  // list('./test').then(files => {
  //   console.log(files);
  // });

  // getFolder('./test').then(() => {
  //   console.log('下载成功');
  //   client.end();
  // });
});
