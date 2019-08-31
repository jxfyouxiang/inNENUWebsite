/*
 * @Author: Mr.Hope
 * @Date: 2019-08-30 23:40:54
 * @LastEditors: Mr.Hope
 * @LastEditTime: 2019-08-31 01:07:56
 * @Description: function处理
 */

const fs = require('fs');
const { exec } = require('child_process');

// 读取当前版本号
const functionVersion = fs.readFileSync('./functionVersion.json', 'utf-8');

// 更新function版本号
fs.writeFileSync('./functionVersion.json', Number(functionVersion) + 1);

// 压缩文件
exec('"lib/7z" a -r function.zip @lib/function.txt');
