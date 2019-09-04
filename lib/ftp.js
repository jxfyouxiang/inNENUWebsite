// @ts-nocheck
/*
 * @Author: Mr.Hope
 * @Date: 2019-08-31 13:26:57
 * @LastEditors: Mr.Hope
 * @LastEditTime: 2019-09-03 21:36:10
 * @Description: FTP上传
 */

const fs = require('fs');
const path = require('path');
const FtpClient = require('ftp');

const client = new FtpClient();

client.on('ready', () => {
  console.log('ftp client is ready');
});
client.on('close', () => {
  console.log('ftp client has close');
});
client.on('end', () => {
  console.log('ftp client has end');
});
client.on('error', err => {
  console.log('ftp client has an error :', err);
});

client.connect(require('./loginDetail.json'));


/**
 * 切换目录
 *
 * @param {stirng} dirpath 文件夹目录
 */
const cwd = dirpath => new Promise(resolve => {
  client.cwd(dirpath, (err, dir) => {
    resolve({ err, dir });
  });
});

/**
 * 列出目标目录
 *
 * @param {string} dirpath 文件夹目录
 */
const list = async dirpath => {
  const { err: ea, dir } = await cwd(dirpath);

  return new Promise(resolve => {
    client.list((err, files) => {
      resolve({ err, files });
    });
  });
};

// 下载文件
const get = async filePath => {
  const dirpath = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const { err: ea, dir } = await cwd(dirpath);

  return new Promise((resolve, reject) => {
    client.get(fileName, (err, rs) => {
      const ws = fs.createWriteStream(fileName);

      rs.pipe(ws);
      resolve({ err });
    });
  });
};

// 将文件上传到ftp目标地址
const put = async (currentFile, targetFilePath) => {
  const dirpath = path.dirname(targetFilePath);
  const fileName = path.basename(targetFilePath);
  const rs = fs.createReadStream(currentFile);
  const { err: ea, dir } = await cwd(dirpath);// 此处应对err做处理

  if (ea)
    return Promise.resolve({ err: ea });


  return new Promise(resolve => {
    client.put(rs, fileName, err => {
      resolve({ err });
    });
  });
};

const card = { idNo: '123' };

const upload = async fileDirectory => {
  if (fs.existsSync(fileDirectory))
    fs.readdir(fileDirectory, (err, files) => {
      if (err) {
        console.log(err);

        return;
      }
      const results = {};

      files.forEach(filename => {
        fs.readFile(filename, data => {
          results[filename] = data;

          console.log(`success:${filename}`);

          // 对所有文件进行处理
          const filePath = `${card.idNo}`; // 目标文件地址

          client.on('ready', async () => {
            for (let i = 0; i < files.length; i++) {
              const a = new Promise((resolve, reject) => {
                // 判断文件夹是否存在，不存在就创建文件夹
                client.get(filePath, err3 => {
                  console.log(`filePath:${filePath}`);

                  if (err3)
                    client.mkdir(`${card.idNo}`, false, () => {
                      client.put(
                        `${fileDirectory}/${filename}`,
                        `${card.idNo}/${filename}`,
                        err2 => {
                          if (err2) {
                            console.log('上传文件到服务器失败...');
                            reject(err2);
                          }

                          console.log('上传文件到服务器成功...');
                          resolve(true);
                        },
                      );
                    });

                });
              });

              console.log(`${i}-文件处理中...`);

              const b = await a;

              console.log(b);
            }

            client.end();
          }).on('error', async e => {
            console.log(e);
          });
        });
      });
    });
  else console.log(`${fileDirectory} Not Found!`);
};

upload('./');
