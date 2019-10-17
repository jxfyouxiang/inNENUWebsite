/*
 * @Author: Mr.Hope
 * @Date: 2019-08-30 23:40:54
 * @LastEditors: Mr.Hope
 * @LastEditTime: 2019-10-18 01:24:03
 * @Description: page处理
 */

const fs = require('fs');
const { exec } = require('child_process');
const generateKeywords = require('./keyword');

generateKeywords();

// 读取旧版本号
const pageVersion = fs.readFileSync('./pageVersion.json', 'utf-8');

// 更新page版本号
fs.writeFileSync('./pageVersion.json', Number(pageVersion) + 1);

// 压缩文件
exec('"lib/7z" a -r page.zip @lib/page.txt');

const { client, put, putFolder } = require('./ftp');

// 连接客户端
client.connect(require('./loginDetail'));

client.on('ready', () => {
  putFolder('./page')
    .then(() => put('./pageVersion.json'))
    .then(() => put('./page.zip'))
    .then(() => {
      console.log('page 上传成功');
    });
});
