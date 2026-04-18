# 开发规范

## AI 操作规范

### 禁止事项

- **不要** 运行 `npm run dev`、`npm run build` 或任何构建命令
- **不要** 创建过多的终端进程
- 构建和运行应由用户在本地终端自行执行

### 原因

- 避免消耗过多系统资源
- 避免创建过多终端进程
- 用户在自己的环境中测试更准确

## 功能清单

### 已实现功能

- [✔️] 托盘应用基础功能
- [✔️] 股票数据定时查询
- [✔️] 系统休眠/锁屏时自动停止查询
- [✔️] 系统唤醒/解屏时自动恢复查询
- [✔️] 手动停止/重启功能
- [✔️] 多股票轮换显示
- [✔️] 浮窗配置面板

## 快捷操作

### 本地运行

```bash
cd /Users/dike/coderdi/StockWidget/stock-watcher
npm run dev
```

### 本地构建

```bash
cd /Users/dike/coderdi/StockWidget/stock-watcher
npm run build
```

### 查看日志

```bash
log show --predicate 'process == "Electron"' --last 10m
```
