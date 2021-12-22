# webpack-template

> webpack5 的模板，内置了 vue3 的支持

## 开发/构建

- node `14.15.4`
- npm `6.14.10`

## 开发

复制 `.env` 文件为 `.env.local` 文件，配置相关参数

`PROXY_BASE_URL` 为 `项目接口前缀`

`API_PROXY` 为 `接口代理地址`

`DEV_PORT` 为 `所起服务端口`

```bash
npm ci

npm run dev
```

## 构建

```bash
npm ci

npm run build
```

构建结果在 dist 目录下

## eslint 修复

```bash
npm run lint -- --fix
````
