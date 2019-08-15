/*
 * @Author: Mr.Hope
 * @Date: 2019-08-07 11:05:26
 * @LastEditors: Mr.Hope
 * @LastEditTime: 2019-08-15 09:03:19
 * @Description: 处理keyword
 */

const fs = require('fs');

/**
 * @description: 处理json文件名称
 * @param {string} jsonName json文件名称 
 * @return: 路径与文件夹名称
 */
const resolveJsonName = jsonName => {
  let { length } = jsonName;

  while (!isNaN(Number(jsonName.charAt(length)))) length -= 1;
  const folder = jsonName.substring(0, length + 1);

  return { folder, path: `${folder}/${jsonName}` };
};

// 获得关键词
const keywords = JSON.parse(fs.readFileSync('./keywords.json', 'utf-8'));
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
})

// 读取旧版本号
fs.writeFileSync('./page/keywords.json', JSON.stringify(keywords));

// 更新page版本号
const pageVersion = fs.readFileSync('./pageVersion.json', 'utf-8');

fs.writeFileSync('./pageVersion.json', Number(pageVersion) + 1);
