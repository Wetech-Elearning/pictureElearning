# 安装依赖
npm install
# 如果安装依赖异常Failed at the chromedriver@2.27.2 install script，执行下面命令
npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
或
npm install chromedriver@91.0.1 --ignore-scripts
# 如果安装依赖异常node-sass,执行下面命令
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
# 运行项目
npm run dev
# 打包项目
npm run build
