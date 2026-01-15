# M3 API Center

基于元数据驱动的 API 开发工具，允许您一次定义 API 结构，然后自动生成 TypeScript 类型、服务端存根和客户端 API 函数。

## 截图

**元数据编辑器 - 数据类型**
![数据类型编辑器](https://github.com/user-attachments/assets/87b34c4a-3c20-44de-91b2-774bbf81336d)

**HTTP 接口编辑器**
![HTTP 接口](https://github.com/user-attachments/assets/a3a91759-fbaf-45b0-a872-d6e9763a76f8)

**JSON 视图**
![JSON 视图](https://github.com/user-attachments/assets/e17b43bb-dc4e-47aa-bb59-40da30d748c2)

## 功能特性

- **浏览器端元数据编辑器**: 使用 Vite + Preact + TypeScript 构建的可视化编辑器
- **类型定义**: 定义数据类型，包括：
  - 基础类型（string、number、boolean）
  - 枚举（约束值）
  - 类型别名（命名的基础类型）
  - 对象及其字段
  - 数组
- **HTTP 接口定义**: 定义 API，包括：
  - HTTP 方法（GET、POST、PUT、DELETE、PATCH）
  - URL 参数
  - 请求体类型
  - 响应类型
  - 自定义头部
  - 服务器发送事件（SSE）支持
- **代码生成器**: 自动生成：
  - TypeScript 类型声明
  - 服务端 API 存根（基于 Express）
  - 客户端 fetch 函数

## 快速开始

### 安装

```bash
npm install
```

### 运行元数据编辑器

```bash
npm run dev
```

这将启动开发服务器。在浏览器中打开以可视化方式编辑元数据。

### 生成代码

编辑元数据后，可以生成 TypeScript 代码：

```bash
npm run generate
```

这将：
1. 从 `data/metadata.json` 读取元数据
2. 在 `generated/` 目录中生成文件：
   - `types.ts` - TypeScript 类型声明
   - `server.ts` - 服务端 API 存根
   - `client.ts` - 客户端 API 函数

## 项目结构

```
m3-api-center/
├── data/
│   └── metadata.json          # API 元数据（可在浏览器中编辑或手动编辑）
├── src/
│   ├── components/            # Preact 编辑器组件
│   ├── types/                 # 元数据模式类型
│   ├── app.tsx                # 主应用组件
│   ├── main.tsx               # 应用入口
│   └── style.css              # 应用样式
├── generator/
│   └── index.ts               # 代码生成脚本
├── generated/                 # 生成的代码输出（运行 generate 后创建）
│   ├── types.ts
│   ├── server.ts
│   └── client.ts
└── index.html                 # HTML 入口
```

## 使用方法

### 1. 定义 API 元数据

使用浏览器编辑器：
- 创建数据类型（枚举、别名、对象）
- 定义 HTTP 接口（端点、方法、请求/响应类型）

或直接编辑 `data/metadata.json` 文件。

### 2. 生成代码

运行 `npm run generate` 创建 TypeScript 文件。

### 3. 使用生成的代码

**类型** (`generated/types.ts`):
```typescript
import { User, UserRole } from './generated/types';
```

**服务端** (`generated/server.ts`):
```typescript
import express from 'express';
import { setupRoutes } from './generated/server';

const app = express();
setupRoutes(app);
app.listen(3000);
```

**客户端** (`generated/client.ts`):
```typescript
import { getUser, createUser } from './generated/client';

const user = await getUser(123);
const newUser = await createUser({ name: 'John', email: 'john@example.com', role: 'user' });
```

## 示例元数据

查看 `data/metadata.json` 获取示例元数据文件，其中包括：
- 用户角色枚举
- 公司名称类型别名
- 用户对象类型
- CRUD 操作的 HTTP 接口

## 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run generate` - 从元数据生成代码

## 许可证

ISC
