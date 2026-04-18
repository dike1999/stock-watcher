import React, { useState, useEffect } from 'react';
import './FloatWindow.css';
import closeIcon from '../assets/close.png';
import deleteIcon from '../assets/delete.png';

interface StockItem {
  code: string;
  name: string;
}

export default function FloatWindow() {
  const [stockList, setStockList] = useState<StockItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [intervalSec, setIntervalSec] = useState(3);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'normal' | 'error' | 'success'>('normal');

  useEffect(() => {
    window.ipcRenderer
      .invoke('get-store-data')
      .then((data: { stockList: StockItem[]; pollIntervalMs: number }) => {
        setStockList(data.stockList || []);
        setIntervalSec(Math.round((data.pollIntervalMs || 3000) / 1000));
      });

    window.ipcRenderer.on(
      'stocks-updated',
      (
        _event: Electron.IpcRendererEvent,
        data: { stocks: StockItem[]; pollIntervalMs: number },
      ) => {
        setStockList(data.stocks || []);
        setIntervalSec(Math.round((data.pollIntervalMs || 3000) / 1000));
      },
    );
  }, []);

  const handleAddStock = async () => {
    const code = inputValue.trim();
    if (!code) {
      setStatus('请输入股票代码');
      setStatusType('error');
      return;
    }

    setStatus('验证中...');
    setStatusType('normal');

    try {
      const result = await window.ipcRenderer.invoke('verify-stock', code);
      if (result.success) {
        const newStock = { code, name: result.name };
        const updatedList = [...stockList, newStock];
        setStockList(updatedList);
        setStatus('添加成功');
        setStatusType('success');
        setInputValue('');
      } else {
        setStatus(result.error || '股票不存在');
        setStatusType('error');
      }
    } catch (e) {
      setStatus('验证失败');
      setStatusType('error');
    }
  };

  const handleDeleteStock = (index: number) => {
    const updatedList = stockList.filter((_, i) => i !== index);
    setStockList(updatedList);
  };

  const handleSave = () => {
    let pollInterval = intervalSec;
    if (pollInterval < 1) pollInterval = 1;
    window.ipcRenderer.send('save-stocks', {
      stocks: stockList,
      pollIntervalMs: pollInterval * 1000,
    });
  };

  const handleExit = () => {
    window.ipcRenderer.send('hide-float-window');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddStock();
    }
  };

  return (
    <div className='float-container'>
      <div className='header'>
        <div className='header-top'>
          <div className='header-title'>股票管理</div>
          <div className='close-btn' onClick={handleExit}>
            <img src={closeIcon} alt='关闭' style={{ width: '16px', height: '16px' }} />
          </div>
        </div>
        <div className='input-row'>
          <input
            type='text'
            placeholder='请输入股票代码'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleAddStock}>添加</button>
        </div>
        <div className='interval-row'>
          <label>轮询间隔(秒):</label>
          <input
            type='number'
            value={intervalSec}
            onChange={(e) => setIntervalSec(parseInt(e.target.value) || 3)}
            min='1'
            step='1'
          />
        </div>
        <div className={`status ${statusType}`}>{status}</div>
      </div>

      <div className='stock-list'>
        {stockList.length === 0 ? (
          <div className='empty'>暂无股票</div>
        ) : (
          stockList.map((stock, index) => (
            <div key={index} className='stock-item'>
              <span className='stock-info'>
                {stock.code} {stock.name}
              </span>
              <button className='delete-btn' onClick={() => handleDeleteStock(index)}>
                <img src={deleteIcon} alt='删除' style={{ width: '12px', height: '12px' }} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className='footer'>
        <button className='save-btn' onClick={handleSave}>
          保存
        </button>
      </div>
    </div>
  );
}
