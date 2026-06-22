const http = require('http');

const orderData = {
  items: [
    {id: 1, name: "羊肉串", price: 3, qty: 2},
    {id: 11, name: "回锅肉", price: 28, qty: 1}
  ],
  total: 34,
  type: "dine_in",
  customer_name: "测试顾客",
  phone: "13800138000",
  table: "3"
};

const postData = JSON.stringify(orderData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('响应:', data);
    
    // 验证数据是否正确保存
    const fs = require('fs');
    const orders = JSON.parse(fs.readFileSync('data/orders.json', 'utf8'));
    console.log('订单中的菜品名称:', orders[orders.length-1].items[0].name);
  });
});

req.on('error', (e) => { console.error(`问题: ${e.message}`); });
req.write(postData);
req.end();
