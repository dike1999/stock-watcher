import * as http from 'http';
import { URL } from 'url';
import iconv from 'iconv-lite';
import { StockData } from './types';

export async function fetchStockData(stockCode: string): Promise<StockData | null> {
  return new Promise((resolve) => {
    const url = new URL('http://qt.gtimg.cn/q=' + stockCode);

    console.log('请求股票数据接口', stockCode);
    const req = http.get(url.toString(), (res) => {
      const chunks: Buffer[] = [];

      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          const dataStr = iconv.decode(buffer, 'gbk');
          const dataPart = dataStr.split('"')[1];
          const fields = dataPart.split('~');

          const stockData: StockData = {
            name: fields[1] || '',
            code: fields[2] || '',
            price: fields[3] ? parseFloat(fields[3]) : 0,
            change: fields[31] ? parseFloat(fields[31]) : 0,
            changePercent: fields[32] ? parseFloat(fields[32]) : 0,
            currency: fields[35] || 'USD',
          };

          resolve(stockData);
        } catch (error) {
          console.error('解析股票数据失败 ' + stockCode + ':', error);
          resolve(null);
        }
      });
    });

    req.on('error', (err: Error) => {
      console.error('获取股票数据失败 ' + stockCode + ':', err);
      resolve(null);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.error('获取股票数据超时 ' + stockCode);
      resolve(null);
    });
  });
}

export async function verifyStock(
  code: string,
): Promise<{ success: boolean; name?: string; error?: string }> {
  console.log('[verifyStock] 开始验证股票代码: ' + code);
  return new Promise((resolve) => {
    const url = new URL('http://qt.gtimg.cn/q=' + code);
    const req = http.get(url.toString(), (res) => {
      const chunks: Buffer[] = [];

      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          const dataStr = iconv.decode(buffer, 'gbk');
          const dataPart = dataStr.split('"')[1];
          const fields = dataPart.split('~');
          const name = fields[1];

          console.log('[verifyStock] API响应，name: ' + name);
          if (name && name.length > 0) {
            console.log('[verifyStock] 验证成功: ' + name);
            resolve({ success: true, name });
          } else {
            console.log('[verifyStock] 验证失败: 股票名称为空');
            resolve({ success: false, error: '股票不存在' });
          }
        } catch (e) {
          console.log('[verifyStock] 解析异常: ' + e);
          resolve({ success: false, error: '解析失败' });
        }
      });
    });

    req.on('error', (err: Error) => {
      console.log('[verifyStock] 网络错误: ' + err.message);
      resolve({ success: false, error: '网络错误' });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log('[verifyStock] 请求超时');
      resolve({ success: false, error: '请求超时' });
    });
  });
}