# MediaOp 前端项目

## 项目概述

这是MediaOp数据分析系统的前端部分，基于React和Vite构建，提供以下功能：

1. 达人商品分析
2. 商品视频分析
3. 数据矩阵图展示

## 技术栈

- React 18
- Vite
- React Router v6
- CSS Modules

## 启动项目

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

默认访问地址: http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/           # 组件目录
│   ├── CreatorProductAnalysis.jsx    # 达人商品分析组件
│   ├── ProductVideoAnalysis.jsx      # 商品视频分析组件
│   └── ProductMatrix.jsx             # 数据矩阵图组件
├── App.jsx              # 主应用组件
├── main.jsx             # 入口文件
├── App.css              # 主样式文件
└── index.css            # 全局样式文件
```

## 功能说明

### 1. 达人商品分析
- 选择达人查看其最近拍摄的商品
- 按品类维度统计商品的点赞、收藏、转发数据
- 支持按时间范围和排序字段筛选

### 2. 商品视频分析
- 输入商品ID查看相关带货视频数据
- 支持按时间范围和排序字段筛选

### 3. 数据矩阵图
- 按拍摄次数和数据表现两个维度展示商品矩阵图
- 支持选择不同指标字段查看

## 响应式设计

项目支持移动端访问，使用CSS媒体查询实现响应式布局。