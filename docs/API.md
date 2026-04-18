# 腾讯财经接口 API 文档

示例：<http://qt.gtimg.cn/q=hk09988,hk01024,sh600250,sz002103,usAAPL>
响应：

```json
v_hk09988="100~阿里巴巴-W~09988~136.400~135.800~135.000~83379143.0~0~0~136.400~0~0~0~0~0~0~0~0~0~136.400~0~0~0~0~0~0~0~0~0~83379143.0~2026/04/17 16:08:23~0.600~0.44~137.200~134.600~136.400~83379143.0~11353024551.900~0~18.51~~0~0~1.91~26098.8459~26098.8459~BABA-W~1.43~186.200~101.800~1.03~-10.60~0~0~0~0~0~25.40~2.27~0.44~100~-4.48~8.69~GP~8.73~4.83~14.62~1.34~-17.13~19134051238.00~19134051238.00~22.65~1.957~136.161~12.82~HKD~1~50"; v_hk01024="100~快手-W~01024~46.460~47.060~46.840~27409685.0~0~0~46.460~0~0~0~0~0~0~0~0~0~46.460~0~0~0~0~0~0~0~0~0~27409685.0~2026/04/17 16:08:22~-0.600~-1.27~47.180~46.080~46.460~27409685.0~1273701218.700~0~9.80~~0~0~2.34~1700.9698~2019.6403~KUAISHOU-W~0.98~92.600~44.200~0.74~-33.36~0~0~0~0~0~9.80~2.31~0.75~100~-27.35~2.92~GP~23.40~11.32~2.97~-22.37~-41.60~4347051812.00~3661148939.00~9.80~0.457~46.469~-40.01~HKD~1~50"; v_sh600250="1~南京商旅~600250~11.51~11.61~11.51~249026~107763~141263~11.51~441~11.50~586~11.49~192~11.48~303~11.47~191~11.52~1034~11.53~297~11.54~378~11.55~749~11.56~238~~20260417161402~-0.10~-0.86~11.80~11.35~11.51/249026/287174349~249026~28717~7.96~362.08~~11.80~11.35~3.88~36.00~36.00~5.76~12.77~10.45~0.72~-983~11.53~195.06~407.15~~~0.59~28717.4349~0.0000~0~ ~GP-A~0.00~-7.99~0.00~4.08~3.83~16.08~8.26~-16.23~0.09~-4.08~312791404~312791404~-22.30~-12.07~312791404~~~15.56~-0.09~~CNY~0~___D__F__N~11.42~689~"; v_sz002103="51~广博股份~002103~8.16~8.26~8.21~56947~21985~34962~8.15~1310~8.14~306~8.13~188~8.12~710~8.11~1157~8.16~102~8.17~1123~8.18~483~8.19~233~8.20~526~~20260417161500~-0.10~-1.21~8.27~8.11~8.16/56947/46457393~56947~4646~1.47~26.49~~8.27~8.11~1.94~31.67~43.60~3.52~9.09~7.43~0.75~1204~8.16~26.49~26.49~~~1.15~4645.7393~0.0000~0~ ~GP-A~-10.53~-4.11~0.00~13.29~6.95~12.66~7.89~-2.04~-6.85~-20.93~388135588~534272953~19.62~-22.21~388135588~~~-7.90~0.00~~CNY~0~~8.10~1516~"; v_usAAPL="200~苹果~AAPL.OQ~271.42~263.40~266.96~28298056~0~0~0~0~0~0~0~0~0~0~0~0~0~0~0~0~0~0~0~0~0~0~~2026-04-17 12:36:00~8.02~3.04~272.30~266.72~USD~28298056~7614043089~0.19~34.36~~36.38~~2.12~39822.92935~39847.55019~Apple Inc.~7.90~288.36~189.00~0~45.18~0.38~39847.55019~-0.07~4.20~GP~152.02~32.56~6.06~9.02~9.70~14681140000~14672068878~1.41~23.89~1.04~269.07~~~";
```

## 一、接口基本信息

| 属性 | 说明 |
|------|------|
| 接口地址 | `http://qt.gtimg.cn/q=` |
| 请求方式 | GET |
| 编码格式 | GBK（必须设置 `response.encoding = 'gbk'`） |
| 频率限制 | 存在未公开的频率限制，建议合理控制请求频率 |
| 费用 | 免费 |

## 二、股票代码规则

| 市场 | 前缀 | 示例代码 | 完整URL |
|------|------|----------|---------|
| A股（沪市） | sh | 600519 → sh600519 | `http://qt.gtimg.cn/q=sh600519` |
| A股（深市） | sz | 000001 → sz000001 | `http://qt.gtimg.cn/q=sz000001` |
| 港股 | hk | 09988 → hk09988 | `http://qt.gtimg.cn/q=hk09988` |
| 美股 | us | BABA → usBABA | `http://qt.gtimg.cn/?q=usBABA` |

**批量查询**：用逗号分隔多个股票代码，如 `http://qt.gtimg.cn/q=sz000001,sh600519,r_hk09988`

## 三、返回数据格式

### 1. 基本格式

- 返回一行JS赋值文本，如：`v_sh600519="1~贵州茅台~600519~1265.70~-9.20~-0.72~24661~313441~~15899.70~GP-A";`
- 变量名：`v_` + 股票代码
- 数据内容：波浪线 `~` 分隔的字符串
- 字段数量：约50-60个字段（不同市场略有差异）

### 2. 各市场字段映射

#### 港股（HK）字段映射

| 字段名 | 索引 | 示例值 | 说明 |
|--------|------|--------|------|
| 市场标识 | 0 | 100 | 港股标识 |
| 股票名称 | 1 | 阿里巴巴-W | 证券名称 |
| 股票代码 | 2 | 09988 | 港股代码 |
| 当前金额 | 3 | 136.400 | 最新价格 |
| 昨收价 | 4 | 135.800 | 昨日收盘价 |
| 今开盘 | 5 | 135.000 | 今日开盘价 |
| 成交量 | 6 | 83379143.0 | 成交数量 |
| 时间戳 | 31 | 2026/04/17 16:08:23 | 数据时间 |
| 涨跌金额 | 32 | 0.600 | 涨跌额 |
| 涨跌比例 | 33 | 0.44 | 涨跌幅（%） |
| 当日最高 | 34 | 137.200 | 当日最高价 |
| 当日最低 | 35 | 134.600 | 当日最低价 |
| 成交额 | 38 | 11353024551.900 | 成交金额 |
| 货币单位 | 60 | HKD | 港币 |

#### 上海A股（SH）字段映射

| 字段名 | 索引 | 示例值 | 说明 |
|--------|------|--------|------|
| 市场标识 | 0 | 1 | 上海A股标识 |
| 股票名称 | 1 | 南京商旅 | 证券名称 |
| 股票代码 | 2 | 600250 | 股票代码 |
| 当前金额 | 3 | 11.51 | 最新价格 |
| 昨收价 | 4 | 11.61 | 昨日收盘价 |
| 今开盘 | 5 | 11.51 | 今日开盘价 |
| 成交量 | 6 | 249026 | 成交数量（手） |
| 时间戳 | 30 | 20260417161402 | 数据时间（YYYYMMDDHHMMSS） |
| 涨跌金额 | 31 | -0.10 | 涨跌额 |
| 涨跌比例 | 32 | -0.86 | 涨跌幅（%） |
| 当日最高 | 33 | 11.80 | 当日最高价 |
| 当日最低 | 34 | 11.35 | 当日最低价 |
| 成交额 | 36 | 287174349 | 成交金额（元） |
| 货币单位 | 60 | CNY | 人民币 |

#### 深圳A股（SZ）字段映射

| 字段名 | 索引 | 示例值 | 说明 |
|--------|------|--------|------|
| 市场标识 | 0 | 51 | 深圳A股标识 |
| 股票名称 | 1 | 广博股份 | 证券名称 |
| 股票代码 | 2 | 002103 | 股票代码 |
| 当前金额 | 3 | 8.16 | 最新价格 |
| 昨收价 | 4 | 8.26 | 昨日收盘价 |
| 今开盘 | 5 | 8.21 | 今日开盘价 |
| 成交量 | 6 | 56947 | 成交数量（手） |
| 时间戳 | 30 | 20260417161500 | 数据时间（YYYYMMDDHHMMSS） |
| 涨跌金额 | 31 | -0.10 | 涨跌额 |
| 涨跌比例 | 32 | -1.21 | 涨跌幅（%） |
| 当日最高 | 33 | 8.27 | 当日最高价 |
| 当日最低 | 34 | 8.11 | 当日最低价 |
| 成交额 | 36 | 46457393 | 成交金额（元） |
| 货币单位 | 60 | CNY | 人民币 |

#### 美股（US）字段映射

| 字段名 | 索引 | 示例值 | 说明 |
|--------|------|--------|------|
| 市场标识 | 0 | 200 | 美股标识 |
| 股票名称 | 1 | 苹果 | 证券名称（中文） |
| 股票代码 | 2 | AAPL.OQ | 美股代码 |
| 当前金额 | 3 | 271.42 | 最新价格 |
| 昨收价 | 4 | 263.40 | 昨日收盘价 |
| 今开盘 | 5 | 266.96 | 今日开盘价 |
| 成交量 | 6 | 28298056 | 成交数量 |
| 时间戳 | 30 | 2026-04-17 12:36:00 | 数据时间 |
| 涨跌金额 | 31 | 8.02 | 涨跌额 |
| 涨跌比例 | 32 | 3.04 | 涨跌幅（%） |
| 当日最高 | 33 | 272.30 | 当日最高价 |
| 当日最低 | 34 | 266.72 | 当日最低价 |
| 货币单位 | 35 | USD | 美元 |
| 成交额 | 37 | 7614043089 | 成交金额 |
| 英文名称 | 45 | Apple Inc. | 公司英文名称 |

## 四、字段差异对比

| 字段类别 | 港股 | 上海A股 | 深圳A股 | 美股 |
|----------|------|---------|---------|------|
| 市场标识 | 100 | 1 | 51 | 200 |
| 时间戳格式 | YYYY/MM/DD HH:MM:SS | YYYYMMDDHHMMSS | YYYYMMDDHHMMSS | YYYY-MM-DD HH:MM:SS |
| 涨跌金额索引 | 32 | 31 | 31 | 31 |
| 涨跌比例索引 | 33 | 32 | 32 | 32 |
| 成交额索引 | 38 | 36 | 36 | 37 |
| 货币单位位置 | 第60字段 | 第60字段 | 第60字段 | 第35字段 |

## 五、解析代码示例

### Python 解析示例

```python
import requests

def parse_stock_data(stock_code, data_str):
    """解析不同市场的股票数据"""
    # 提取数据部分
    data_part = data_str.split('"')[1]
    fields = data_part.split('~')
    
    # 根据市场类型确定字段映射
    if stock_code.startswith('hk'):
        # 港股解析
        return {
            "市场": "港股",
            "股票名称": fields[1],
            "股票代码": fields[2],
            "当前金额": float(fields[3]) if fields[3] else None,
            "涨跌金额": float(fields[32]) if fields[32] else None,
            "涨跌比例": float(fields[33]) if fields[33] else None,
            "时间戳": fields[31] if fields[31] else None,
            "当日最高": float(fields[34]) if fields[34] else None,
            "当日最低": float(fields[35]) if fields[35] else None,
            "成交量": float(fields[6]) if fields[6] else None,
            "成交额": float(fields[38]) if fields[38] else None,
            "货币单位": fields[60] if len(fields) > 60 else None
        }
    elif stock_code.startswith('sh'):
        # 上海A股解析
        return {
            "市场": "上海A股",
            "股票名称": fields[1],
            "股票代码": fields[2],
            "当前金额": float(fields[3]) if fields[3] else None,
            "涨跌金额": float(fields[31]) if fields[31] else None,
            "涨跌比例": float(fields[32]) if fields[32] else None,
            "时间戳": fields[30] if fields[30] else None,
            "当日最高": float(fields[33]) if fields[33] else None,
            "当日最低": float(fields[34]) if fields[34] else None,
            "成交量": int(fields[6]) if fields[6] else None,
            "成交额": float(fields[36].split('/')[2]) if len(fields) > 36 and '/' in fields[36] else None,
            "货币单位": fields[60] if len(fields) > 60 else None
        }
    elif stock_code.startswith('sz'):
        # 深圳A股解析
        return {
            "市场": "深圳A股",
            "股票名称": fields[1],
            "股票代码": fields[2],
            "当前金额": float(fields[3]) if fields[3] else None,
            "涨跌金额": float(fields[31]) if fields[31] else None,
            "涨跌比例": float(fields[32]) if fields[32] else None,
            "时间戳": fields[30] if fields[30] else None,
            "当日最高": float(fields[33]) if fields[33] else None,
            "当日最低": float(fields[34]) if fields[34] else None,
            "成交量": int(fields[6]) if fields[6] else None,
            "成交额": float(fields[36].split('/')[2]) if len(fields) > 36 and '/' in fields[36] else None,
            "货币单位": fields[60] if len(fields) > 60 else None
        }
    elif stock_code.startswith('us'):
        # 美股解析
        return {
            "市场": "美股",
            "股票名称": fields[1],
            "股票代码": fields[2],
            "当前金额": float(fields[3]) if fields[3] else None,
            "涨跌金额": float(fields[31]) if fields[31] else None,
            "涨跌比例": float(fields[32]) if fields[32] else None,
            "时间戳": fields[30] if fields[30] else None,
            "当日最高": float(fields[33]) if fields[33] else None,
            "当日最低": float(fields[34]) if fields[34] else None,
            "成交量": int(fields[6]) if fields[6] else None,
            "成交额": float(fields[37]) if fields[37] else None,
            "货币单位": fields[35] if fields[35] else None,
            "英文名称": fields[45] if len(fields) > 45 else None
        }
    else:
        return None

def get_stock_data(stock_codes):
    """获取多个股票的数据"""
    url = f"http://qt.gtimg.cn/q={','.join(stock_codes)}"
    response = requests.get(url)
    response.encoding = 'gbk'  # 防止股票名称乱码
    content = response.text
    
    stocks = {}
    lines = content.strip().split(';')
    
    for line in lines:
        if not line:
            continue
        
        parts = line.split('=')
        if len(parts) != 2:
            continue
        
        stock_code = parts[0].replace('v_', '')
        stock_data = parse_stock_data(stock_code, line)
        if stock_data:
            stocks[stock_code] = stock_data
    
    return stocks

# 使用示例
if __name__ == "__main__":
    stock_codes = ["hk09988", "sh600250", "sz002103", "usAAPL"]
    data = get_stock_data(stock_codes)
    
    for code, info in data.items():
        print(f"\n{code} ({info['市场']}):")
        print(f"  股票名称: {info['股票名称']}")
        print(f"  当前金额: {info['当前金额']} {info.get('货币单位', '')}")
        print(f"  涨跌金额: {info['涨跌金额']}")
        print(f"  涨跌比例: {info['涨跌比例']}%")
        print(f"  时间戳: {info['时间戳']}")
```

### JavaScript 解析示例

```javascript
const fetch = require('node-fetch');

async function getStockData(stockCodes) {
  const url = `http://qt.gtimg.cn/q=${stockCodes.join(',')}`;
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // 手动处理GBK编码（在浏览器环境中可能需要使用TextDecoder）
    const stocks = {};
    const lines = text.trim().split(';');
    
    lines.forEach(line => {
      if (!line) return;
      
      const parts = line.split('=');
      if (parts.length !== 2) return;
      
      const stockCode = parts[0].replace('v_', '');
      const dataStr = parts[1];
      const stockData = parseStockData(stockCode, dataStr);
      
      if (stockData) {
        stocks[stockCode] = stockData;
      }
    });
    
    return stocks;
  } catch (error) {
    console.error('获取股票数据失败:', error);
    return {};
  }
}

function parseStockData(stockCode, dataStr) {
  const dataPart = dataStr.split('"')[1];
  const fields = dataPart.split('~');
  
  if (stockCode.startsWith('hk')) {
    return {
      market: '港股',
      name: fields[1],
      code: fields[2],
      price: fields[3] ? parseFloat(fields[3]) : null,
      change: fields[32] ? parseFloat(fields[32]) : null,
      changePercent: fields[33] ? parseFloat(fields[33]) : null,
      timestamp: fields[31] || null,
      high: fields[34] ? parseFloat(fields[34]) : null,
      low: fields[35] ? parseFloat(fields[35]) : null,
      volume: fields[6] ? parseFloat(fields[6]) : null,
      amount: fields[38] ? parseFloat(fields[38]) : null,
      currency: fields[60] || null
    };
  } else if (stockCode.startsWith('sh')) {
    return {
      market: '上海A股',
      name: fields[1],
      code: fields[2],
      price: fields[3] ? parseFloat(fields[3]) : null,
      change: fields[31] ? parseFloat(fields[31]) : null,
      changePercent: fields[32] ? parseFloat(fields[32]) : null,
      timestamp: fields[30] || null,
      high: fields[33] ? parseFloat(fields[33]) : null,
      low: fields[34] ? parseFloat(fields[34]) : null,
      volume: fields[6] ? parseInt(fields[6]) : null,
      amount: fields[36] && fields[36].includes('/') ? parseFloat(fields[36].split('/')[2]) : null,
      currency: fields[60] || null
    };
  } else if (stockCode.startsWith('sz')) {
    return {
      market: '深圳A股',
      name: fields[1],
      code: fields[2],
      price: fields[3] ? parseFloat(fields[3]) : null,
      change: fields[31] ? parseFloat(fields[31]) : null,
      changePercent: fields[32] ? parseFloat(fields[32]) : null,
      timestamp: fields[30] || null,
      high: fields[33] ? parseFloat(fields[33]) : null,
      low: fields[34] ? parseFloat(fields[34]) : null,
      volume: fields[6] ? parseInt(fields[6]) : null,
      amount: fields[36] && fields[36].includes('/') ? parseFloat(fields[36].split('/')[2]) : null,
      currency: fields[60] || null
    };
  } else if (stockCode.startsWith('us')) {
    return {
      market: '美股',
      name: fields[1],
      code: fields[2],
      price: fields[3] ? parseFloat(fields[3]) : null,
      change: fields[31] ? parseFloat(fields[31]) : null,
      changePercent: fields[32] ? parseFloat(fields[32]) : null,
      timestamp: fields[30] || null,
      high: fields[33] ? parseFloat(fields[33]) : null,
      low: fields[34] ? parseFloat(fields[34]) : null,
      volume: fields[6] ? parseInt(fields[6]) : null,
      amount: fields[37] ? parseFloat(fields[37]) : null,
      currency: fields[35] || null,
      englishName: fields[45] || null
    };
  }
  
  return null;
}

// 使用示例
async function main() {
  const stockCodes = ["hk09988", "sh600250", "sz002103", "usAAPL"];
  const data = await getStockData(stockCodes);
  console.log(JSON.stringify(data, null, 2));
}

main();
```

## 六、解析结果示例

### 1. 港股（阿里巴巴-W）

```json
{
  "市场": "港股",
  "股票名称": "阿里巴巴-W",
  "股票代码": "09988",
  "当前金额": 136.4,
  "涨跌金额": 0.6,
  "涨跌比例": 0.44,
  "时间戳": "2026/04/17 16:08:23",
  "当日最高": 137.2,
  "当日最低": 134.6,
  "成交量": 83379143,
  "成交额": 11353024551.9,
  "货币单位": "HKD"
}
```

### 2. 上海A股（南京商旅）

```json
{
  "市场": "上海A股",
  "股票名称": "南京商旅",
  "股票代码": "600250",
  "当前金额": 11.51,
  "涨跌金额": -0.1,
  "涨跌比例": -0.86,
  "时间戳": "20260417161402",
  "当日最高": 11.8,
  "当日最低": 11.35,
  "成交量": 249026,
  "成交额": 287174349,
  "货币单位": "CNY"
}
```

### 3. 深圳A股（广博股份）

```json
{
  "市场": "深圳A股",
  "股票名称": "广博股份",
  "股票代码": "002103",
  "当前金额": 8.16,
  "涨跌金额": -0.1,
  "涨跌比例": -1.21,
  "时间戳": "20260417161500",
  "当日最高": 8.27,
  "当日最低": 8.11,
  "成交量": 56947,
  "成交额": 46457393,
  "货币单位": "CNY"
}
```

### 4. 美股（苹果）

```json
{
  "市场": "美股",
  "股票名称": "苹果",
  "股票代码": "AAPL.OQ",
  "当前金额": 271.42,
  "涨跌金额": 8.02,
  "涨跌比例": 3.04,
  "时间戳": "2026-04-17 12:36:00",
  "当日最高": 272.3,
  "当日最低": 266.72,
  "成交量": 28298056,
  "成交额": 7614043089,
  "货币单位": "USD",
  "英文名称": "Apple Inc."
}
```

## 七、注意事项

1. **编码处理**：必须设置 `response.encoding = 'gbk'`，否则股票名称会出现乱码
2. **字段差异**：不同市场的字段顺序和格式存在差异，解析时需根据市场类型选择对应映射
3. **时间格式**：各市场时间戳格式不同，港股和美股使用标准日期格式，A股使用紧凑数字格式
4. **数据类型**：成交量在A股中为整数（手），在港股和美股中为浮点数
5. **成交额解析**：A股的成交额需要从复合字段中提取，港股和美股直接使用对应索引字段
6. **错误处理**：当股票代码不存在或接口返回异常时，需做相应的错误处理
7. **频率控制**：避免高频请求，防止被封禁
8. **批量查询**：一次最多可查询约100只股票，建议合理分批查询

## 八、常见问题

### 1. 股票名称乱码

**解决方案**：确保设置正确的编码格式 `response.encoding = 'gbk'`

### 2. 字段索引不一致

**解决方案**：根据市场类型使用对应的字段映射表

### 3. 请求被封禁

**解决方案**：降低请求频率，建议每批次请求间隔2-3秒

### 4. 部分字段为空

**解决方案**：在解析时添加空值判断，确保程序不会因空值而崩溃

### 5. 美股数据延迟

**解决方案**：美股数据可能存在一定延迟，建议在交易时间后获取数据

此文档规范涵盖了腾讯财经接口各市场数据的解析方法，确保了股票名称的正确显示（无乱码），并包含了所有关键字段：股票名称、股票代码、当前金额、涨跌金额、涨跌比例。
