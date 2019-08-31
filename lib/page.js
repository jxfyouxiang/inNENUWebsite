/*
 * @Author: Mr.Hope
 * @Date: 2019-08-30 23:40:54
 * @LastEditors: Mr.Hope
 * @LastEditTime: 2019-08-31 01:07:34
 * @Description: page处理
 */

const fs = require('fs');
const { exec } = require('child_process');

// 获得关键词
const keywords = JSON.parse(fs.readFileSync('./lib/keywords.json', 'utf-8'));
// 获得文件夹列表
const forderList = fs.readdirSync('./page');

// 写入关键词内容
forderList.forEach(forder => {
  if (forder !== 'keywords.json' && forder !== 'log') {
    const jsonList = fs.readdirSync(`./page/${forder}`);

    jsonList.forEach(json => {
      const jsonName = json.slice(0, -5);
      const content = JSON.parse(fs.readFileSync(`./page/${forder}/${json}`, 'utf-8'));

      if (!keywords[jsonName]) keywords[jsonName] = {};
      keywords[jsonName].title = content[0].title;
      keywords[jsonName].desc = [];

      content.forEach(element => {
        if (element.tag === 'title') keywords[jsonName].desc.push(element.text);
      });
    });
  }
});

// 写入关键词列表
fs.writeFileSync('./page/keywords.json', JSON.stringify(keywords));

// 读取旧版本号
const pageVersion = fs.readFileSync('./pageVersion.json', 'utf-8');

// 更新page版本号
fs.writeFileSync('./pageVersion.json', Number(pageVersion) + 1);

// 压缩文件
exec('"lib/7z" a -r page.zip @lib/page.txt');
