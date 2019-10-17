/*
 * @Author: Mr.Hope
 * @Date: 2019-10-18 01:21:40
 * @LastEditors: Mr.Hope
 * @LastEditTime: 2019-10-18 01:23:33
 * @Description: 关键词处理
 */


const fs = require('fs');

/** 生成关键词 */
const generateKeywords = () => {
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

  Object.keys(keywords).forEach(x => {
    if (!keywords[x].title) {
      delete keywords[x];
      console.error(`Missing ${x}`);
    }
  });

  // 写入关键词列表
  fs.writeFileSync('./page/keywords.json', JSON.stringify(keywords));
};

module.exports = generateKeywords;
