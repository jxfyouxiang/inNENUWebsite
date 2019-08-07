/*
 * @Author: Mr.Hope
 * @Date: 2019-08-07 11:05:26
 * @LastEditors: Mr.Hope
 * @LastEditTime: 2019-08-07 14:07:06
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
const keywords = JSON.parse(fs.readFileSync('./page/keywords.json', 'utf-8'));

// 写入title
Object.keys(keywords).forEach(x => {
  const { path } = resolveJsonName(x);
  const content = JSON.parse(fs.readFileSync(`./page/${path}.json`, 'utf-8'));

  keywords[x].title = content[0].title;
  keywords[x].desc = [];

  content.forEach(element => {
    if (element.tag === 'title') keywords[x].desc.push(element.text);
  });
});

fs.writeFileSync('./page/keywords.json', JSON.stringify(keywords));
