/*
 * @Author: Mr.Hope
 * @Date: 2019-08-31 13:26:57
 * @LastEditors: Mr.Hope
 * @LastEditTime: 2019-08-31 13:35:23
 * @Description: FTP上传
 */

const fs = require('fs');

const FtpClient = require('ftp');

const card = { idNo: '123' };

const UploadFileToFTP = async () => {
  const fileDirectory = 'D:/photo/test';

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

          const ftp = new FtpClient();

          const filePath = `${card.idNo}`; // 目标文件地址

          const connectionProperties = { // 连接参数

            host: '192.168.183.1',

            port: 21,

            user: 'Tiamo',

            password: '182431'

          };

          ftp.connect(connectionProperties);

          ftp.on('ready', async () => {
            for (let i = 0; i < files.length; i++) {
              const a = new Promise((resolve, reject) => {
                // 判断文件夹是否存在，不存在就创建文件夹
                ftp.get(filePath, err3 => {
                  console.log(`filePath:${filePath}`);

                  if (err3)
                    ftp.mkdir(`${card.idNo}`, false, () => {
                      ftp.put(
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

            ftp.end();
          }).on('error', async e => {
            console.log(e);
          });
        });
      });
    });
   else console.log(`${fileDirectory} Not Found!`);
};


UploadFileToFTP();
