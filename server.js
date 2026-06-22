const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// 健康检查路由（必须最前面）
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// 根路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 强制 UTF-8 编码
app.use(express.json({ limit: '10mb', type: 'application/json' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use((req, res, next) => {
  res.charset = 'utf-8';
  next();
});

// ========== JSON 文件存储 ==========
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB = {
  categories: path.join(DATA_DIR, 'categories.json'),
  menu: path.join(DATA_DIR, 'menu.json'),
  orders: path.join(DATA_DIR, 'orders.json'),
  config: path.join(DATA_DIR, 'config.json'),
  qr_tokens: path.join(DATA_DIR, 'qr_tokens.json'),
  devices: path.join(DATA_DIR, 'devices.json'),
};

function readDB(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
  catch { return []; }
}

function writeDB(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function nextId(file) {
  const data = readDB(file);
  if (data.length === 0) return 1;
  return Math.max(...data.map(d => d.id)) + 1;
}

// ========== 初始化默认数据 ==========
if (!fs.existsSync(DB.config)) {
  writeDB(DB.config, {
    delivery_fee: 5,
    min_delivery: 20,
    shop_name: '春萍烧烤',
    shop_phone: '',
    shop_base_url: '',
    open_time: '16:00',
    close_time: '02:00',
    is_open: true,
    map_api_key: '',
    map_provider: 'amap',
  });
}

if (!fs.existsSync(DB.qr_tokens)) {
  writeDB(DB.qr_tokens, []);
}

if (!fs.existsSync(DB.devices)) {
  writeDB(DB.devices, []);
}

if (!fs.existsSync(DB.categories)) {
  writeDB(DB.categories, [
    { id: 1, name: '招牌烧烤', sort: 1 },
    { id: 2, name: '经典小炒', sort: 2 },
    { id: 3, name: '凉菜小食', sort: 3 },
    { id: 4, name: '主食', sort: 4 },
    { id: 5, name: '酒水饮料', sort: 5 },
  ]);
}

if (!fs.existsSync(DB.menu)) {
  const items = [
    // 烧烤
    { id: 1, cat: 1, name: '羊肉串', price: 3, unit: '串', desc: '精选羊腿肉，炭火慢烤', special: true, avail: true, sort: 1, image: '' },
    { id: 2, cat: 1, name: '牛肉串', price: 3, unit: '串', desc: '鲜嫩牛里脊', special: false, avail: true, sort: 2, image: '' },
    { id: 3, cat: 1, name: '烤鸡翅', price: 8, unit: '份(4个)', desc: '秘制酱料腌制', special: true, avail: true, sort: 3, image: '' },
    { id: 4, cat: 1, name: '烤五花肉', price: 5, unit: '串', desc: '肥瘦相间，外焦里嫩', special: false, avail: true, sort: 4, image: '' },
    { id: 5, cat: 1, name: '烤茄子', price: 12, unit: '份', desc: '蒜蓉烤茄子', special: false, avail: true, sort: 5, image: '' },
    { id: 6, cat: 1, name: '烤韭菜', price: 8, unit: '份', desc: '蒜蓉辣酱烤韭菜', special: false, avail: true, sort: 6, image: '' },
    { id: 7, cat: 1, name: '烤鱼', price: 38, unit: '条', desc: '鲜烤罗非鱼，麻辣味', special: true, avail: true, sort: 7, image: '' },
    { id: 8, cat: 1, name: '烤鱿鱼', price: 15, unit: '份', desc: '铁板烤鱿鱼', special: false, avail: true, sort: 8, image: '' },
    { id: 9, cat: 1, name: '骨肉相连', price: 4, unit: '串', desc: '软骨+嫩肉', special: false, avail: true, sort: 9, image: '' },
    { id: 10, cat: 1, name: '烤馒头片', price: 3, unit: '串', desc: '外酥里软', special: false, avail: true, sort: 10, image: '' },
    // 小炒
    { id: 11, cat: 2, name: '回锅肉', price: 28, unit: '份', desc: '蒜苗回锅肉，下饭', special: true, avail: true, sort: 1, image: '' },
    { id: 12, cat: 2, name: '鱼香肉丝', price: 26, unit: '份', desc: '酸甜微辣经典川味', special: false, avail: true, sort: 2, image: '' },
    { id: 13, cat: 2, name: '宫保鸡丁', price: 28, unit: '份', desc: '花生鸡丁香辣可口', special: false, avail: true, sort: 3, image: '' },
    { id: 14, cat: 2, name: '青椒肉丝', price: 22, unit: '份', desc: '家常小炒清爽不腻', special: false, avail: true, sort: 4, image: '' },
    { id: 15, cat: 2, name: '麻婆豆腐', price: 18, unit: '份', desc: '麻辣鲜香嫩', special: false, avail: true, sort: 5, image: '' },
    { id: 16, cat: 2, name: '干煸四季豆', price: 20, unit: '份', desc: '焦香入味', special: false, avail: true, sort: 6, image: '' },
    { id: 17, cat: 2, name: '酸辣土豆丝', price: 15, unit: '份', desc: '脆爽开胃', special: true, avail: true, sort: 7, image: '' },
    { id: 18, cat: 2, name: '糖醋里脊', price: 32, unit: '份', desc: '外酥里嫩酸甜味', special: false, avail: true, sort: 8, image: '' },
    // 凉菜
    { id: 19, cat: 3, name: '拍黄瓜', price: 12, unit: '份', desc: '蒜泥醋汁清爽解腻', special: false, avail: true, sort: 1, image: '' },
    { id: 20, cat: 3, name: '凉拌皮蛋', price: 15, unit: '份', desc: '剁椒皮蛋豆腐', special: false, avail: true, sort: 2, image: '' },
    { id: 21, cat: 3, name: '花生毛豆', price: 10, unit: '份', desc: '水煮五香', special: false, avail: true, sort: 3, image: '' },
    { id: 22, cat: 3, name: '凉拌木耳', price: 14, unit: '份', desc: '酸辣脆爽', special: false, avail: true, sort: 4, image: '' },
    // 主食
    { id: 23, cat: 4, name: '蛋炒饭', price: 12, unit: '份', desc: '粒粒分明蛋香十足', special: false, avail: true, sort: 1, image: '' },
    { id: 24, cat: 4, name: '炒河粉', price: 15, unit: '份', desc: '干炒牛河风味', special: false, avail: true, sort: 2, image: '' },
    { id: 25, cat: 4, name: '白米饭', price: 2, unit: '碗', desc: '', special: false, avail: true, sort: 3, image: '' },
    { id: 26, cat: 4, name: '炒面', price: 15, unit: '份', desc: '三丝炒面', special: false, avail: true, sort: 4, image: '' },
    // 酒水
    { id: 27, cat: 5, name: '啤酒', price: 8, unit: '瓶', desc: '冰镇啤酒', special: false, avail: true, sort: 1, image: '' },
    { id: 28, cat: 5, name: '王老吉', price: 6, unit: '罐', desc: '', special: false, avail: true, sort: 2, image: '' },
    { id: 29, cat: 5, name: '可乐', price: 5, unit: '罐', desc: '', special: false, avail: true, sort: 3, image: '' },
    { id: 30, cat: 5, name: '雪碧', price: 5, unit: '罐', desc: '', special: false, avail: true, sort: 4, image: '' },
    { id: 31, cat: 5, name: '矿泉水', price: 2, unit: '瓶', desc: '', special: false, avail: true, sort: 5, image: '' },
    { id: 32, cat: 5, name: '酸梅汤', price: 8, unit: '杯', desc: '自制冰镇酸梅汤', special: true, avail: true, sort: 6, image: '' },
  ];
  writeDB(DB.menu, items);
}

// ========== 中间件 ==========
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ========== 图片上传配置 ==========
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('只支持图片文件'));
  },
});

// ========== SSE 客户端 ==========
const sseClients = [];
function notify(type, data) {
  const msg = `data: ${JSON.stringify({ type, data })}\n\n`;
  sseClients.forEach(r => r.write(msg));
}

// ========== API 路由 ==========

// 获取分类
app.get('/api/categories', (req, res) => {
  res.json(readDB(DB.categories).sort((a, b) => a.sort - b.sort));
});

// 获取菜单（顾客用，只返上架的）
app.get('/api/menu', (req, res) => {
  const categories = readDB(DB.categories);
  const menu = readDB(DB.menu);
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c.name; });
  
  const items = menu
    .filter(m => m.avail)
    .map(m => ({ ...m, catName: catMap[m.cat] || '' }))
    .sort((a, b) => a.cat - b.cat || a.sort - b.sort);
  
  res.json(items);
});

// 获取今日新菜
app.get('/api/menu/specials', (req, res) => {
  const categories = readDB(DB.categories);
  const menu = readDB(DB.menu);
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c.name; });
  
  const items = menu
    .filter(m => m.special && m.avail)
    .map(m => ({ ...m, catName: catMap[m.cat] || '' }))
    .sort((a, b) => a.cat - b.cat);
  
  res.json(items);
});

// 获取全部菜品（管理用，含下架的）
app.get('/api/menu/all', (req, res) => {
  const categories = readDB(DB.categories);
  const menu = readDB(DB.menu);
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c.name; });
  const items = menu.map(m => ({ ...m, catName: catMap[m.cat] || '' }));
  res.json(items);
});

// 新增菜品
app.post('/api/menu', (req, res) => {
  const menu = readDB(DB.menu);
  const { cat, name, price, unit, desc, special, image } = req.body;
  const item = {
    id: nextId(DB.menu),
    cat: parseInt(cat) || 1,
    name, price: parseFloat(price), unit: unit || '份',
    desc: desc || '', special: !!special, avail: true,
    image: image || '',
    sort: menu.filter(m => m.cat === parseInt(cat)).length + 1
  };
  menu.push(item);
  writeDB(DB.menu, menu);
  res.json({ ok: true, item });
});

// 编辑菜品
app.put('/api/menu/:id', (req, res) => {
  const menu = readDB(DB.menu);
  const idx = menu.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const { cat, name, price, unit, desc, special, avail, image } = req.body;
  if (cat !== undefined) menu[idx].cat = parseInt(cat);
  if (name !== undefined) menu[idx].name = name;
  if (price !== undefined) menu[idx].price = parseFloat(price);
  if (unit !== undefined) menu[idx].unit = unit;
  if (desc !== undefined) menu[idx].desc = desc;
  if (special !== undefined) menu[idx].special = !!special;
  if (avail !== undefined) menu[idx].avail = !!avail;
  if (image !== undefined) menu[idx].image = image;
  writeDB(DB.menu, menu);
  res.json({ ok: true, item: menu[idx] });
});

// 删除菜品
app.delete('/api/menu/:id', (req, res) => {
  let menu = readDB(DB.menu);
  menu = menu.filter(m => m.id !== parseInt(req.params.id));
  writeDB(DB.menu, menu);
  res.json({ ok: true });
});

// 切换上架/下架
app.put('/api/menu/:id/toggle', (req, res) => {
  const menu = readDB(DB.menu);
  const idx = menu.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  menu[idx].avail = !menu[idx].avail;
  writeDB(DB.menu, menu);
  res.json({ ok: true, avail: menu[idx].avail });
});

// 切换今日新菜
app.put('/api/menu/:id/special', (req, res) => {
  const menu = readDB(DB.menu);
  const idx = menu.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  menu[idx].special = !menu[idx].special;
  writeDB(DB.menu, menu);
  res.json({ ok: true, special: menu[idx].special });
});

// 菜品排序（上移/下移）
app.put('/api/menu/:id/sort', (req, res) => {
  const menu = readDB(DB.menu);
  const idx = menu.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const dir = req.body.dir; // 'up' or 'down'
  const item = menu[idx];
  const sameCat = menu.filter(m => m.cat === item.cat).sort((a, b) => a.sort - b.sort);
  const si = sameCat.findIndex(m => m.id === item.id);
  if (dir === 'up' && si > 0) {
    const swap = menu.find(m => m.id === sameCat[si - 1].id);
    [item.sort, swap.sort] = [swap.sort, item.sort];
  } else if (dir === 'down' && si < sameCat.length - 1) {
    const swap = menu.find(m => m.id === sameCat[si + 1].id);
    [item.sort, swap.sort] = [swap.sort, item.sort];
  }
  writeDB(DB.menu, menu);
  res.json({ ok: true });
});

// 分类管理
app.post('/api/categories', (req, res) => {
  const cats = readDB(DB.categories);
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: '分类名不能为空' });
  const cat = { id: nextId(DB.categories), name: name.trim(), sort: cats.length + 1 };
  cats.push(cat);
  writeDB(DB.categories, cats);
  res.json({ ok: true, cat });
});

app.put('/api/categories/:id', (req, res) => {
  const cats = readDB(DB.categories);
  const idx = cats.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  if (req.body.name !== undefined) cats[idx].name = req.body.name.trim();
  writeDB(DB.categories, cats);
  res.json({ ok: true, cat: cats[idx] });
});

app.delete('/api/categories/:id', (req, res) => {
  const cats = readDB(DB.categories);
  const catId = parseInt(req.params.id);
  const idx = cats.findIndex(c => c.id === catId);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  // 检查该分类下是否有菜品
  const menu = readDB(DB.menu);
  const hasDishes = menu.some(m => m.cat === catId);
  if (hasDishes) return res.status(400).json({ error: '该分类下还有菜品，请先删除或移走菜品' });
  cats.splice(idx, 1);
  writeDB(DB.categories, cats);
  res.json({ ok: true });
});

// ========== 订单 API ==========

// 提交订单
app.post('/api/orders', (req, res) => {
  const orders = readDB(DB.orders);
  const { table, items, total, note, type, address, phone, delivery_fee, qr_token } = req.body;

  // 验证点单码（如果提供了）
  if (qr_token) {
    const tokens = readDB(DB.qr_tokens);
    const tk = tokens.find(t => t.token === qr_token);
    if (!tk) return res.status(400).json({ ok: false, error: '无效的点单码' });
    if (tk.used) return res.status(400).json({ ok: false, error: '该点单码已使用，请找老板重新获取' });
  }

  const order = {
    id: nextId(DB.orders),
    type: type || 'dinein',
    table: table || '',
    address: address || '',
    phone: phone || '',
    delivery_fee: delivery_fee || 0,
    items,
    total: parseFloat(total),
    note: note || '',
    status: 'unpaid',
    qr_token: qr_token || null,
    time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  };
  orders.unshift(order);
  writeDB(DB.orders, orders);

  // 消耗点单码
  if (qr_token) {
    const tokens = readDB(DB.qr_tokens);
    const tk = tokens.find(t => t.token === qr_token);
    if (tk) {
      tk.used = true;
      tk.used_at = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      tk.order_id = order.id;
      writeDB(DB.qr_tokens, tokens);
    }
  }

  notify('new_order', order);
  res.json({ ok: true, orderId: order.id, message: '下单成功！已通知老板' });
});

// 获取订单（按状态/类型筛选）
app.get('/api/orders', (req, res) => {
  let orders = readDB(DB.orders);
  if (req.query.status) {
    orders = orders.filter(o => o.status === req.query.status);
  }
  if (req.query.type) {
    orders = orders.filter(o => o.type === req.query.type);
  }
  res.json(orders);
});

// 更新订单状态
app.put('/api/orders/:id', (req, res) => {
  const orders = readDB(DB.orders);
  const idx = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  orders[idx].status = req.body.status;
  writeDB(DB.orders, orders);
  res.json({ ok: true });
});

// ========== 点单码 Token API ==========

// 生成新点单码
app.post('/api/qr-tokens', (req, res) => {
  const tokens = readDB(DB.qr_tokens);
  const token = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const record = {
    token,
    created_at: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    used: false,
    used_at: null,
    order_id: null,
  };
  tokens.unshift(record);
  writeDB(DB.qr_tokens, tokens);
  res.json({ ok: true, token, record });
});

// 获取点单码列表
app.get('/api/qr-tokens', (req, res) => {
  const tokens = readDB(DB.qr_tokens);
  res.json(tokens);
});

// 作废点单码
app.delete('/api/qr-tokens/:token', (req, res) => {
  const tokens = readDB(DB.qr_tokens);
  const idx = tokens.findIndex(t => t.token === req.params.token);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  tokens[idx].used = true;
  tokens[idx].used_at = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  writeDB(DB.qr_tokens, tokens);
  res.json({ ok: true });
});

// 验证点单码（顾客端调用）
app.get('/api/qr-tokens/:token', (req, res) => {
  const tokens = readDB(DB.qr_tokens);
  const t = tokens.find(tk => tk.token === req.params.token);
  if (!t) return res.status(404).json({ ok: false, error: '无效的点单码' });
  if (t.used) return res.status(410).json({ ok: false, error: '该点单码已使用，请找老板重新获取' });
  res.json({ ok: true, token: t.token });
});

// ========== 设备管理 API ==========

// 获取设备列表
app.get('/api/devices', (req, res) => {
  const devices = readDB(DB.devices);
  res.json(devices);
});

// 绑定设备
app.post('/api/devices/bind', (req, res) => {
  const devices = readDB(DB.devices);
  const { device_id, device_name } = req.body;

  if (!device_id) return res.status(400).json({ ok: false, error: '缺少设备ID' });

  // 检查设备是否已绑定
  const existing = devices.find(d => d.device_id === device_id);
  if (existing) {
    // 更新最后活跃时间
    existing.last_active = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    writeDB(DB.devices, devices);
    return res.json({ ok: true, device: existing, message: '设备已重新连接' });
  }

  // 检查设备数量是否已达上限
  if (devices.length >= 5) {
    return res.status(403).json({ ok: false, error: '设备数量已达上限（最多5台），请联系管理员解绑其他设备' });
  }

  // 第一个绑定的设备自动设为主设备
  const isPrimary = devices.length === 0;
  
  const device = {
    id: nextId(DB.devices),
    device_id,
    device_name: device_name || '未命名设备',
    is_primary: isPrimary,
    bound_at: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    last_active: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
  };

  devices.push(device);
  writeDB(DB.devices, devices);
  res.json({ ok: true, device, message: isPrimary ? '绑定成功，此设备已设为主手机' : '绑定成功' });
});

// 解绑设备
app.delete('/api/devices/:deviceId', (req, res) => {
  const devices = readDB(DB.devices);
  const idx = devices.findIndex(d => d.device_id === req.params.deviceId);
  
  if (idx === -1) return res.status(404).json({ ok: false, error: '设备未找到' });
  
  // 如果解绑的是主设备，自动将下一个设备设为主设备
  if (devices[idx].is_primary && devices.length > 1) {
    const nextDevice = devices.find((d, i) => i !== idx);
    if (nextDevice) nextDevice.is_primary = true;
  }

  devices.splice(idx, 1);
  writeDB(DB.devices, devices);
  res.json({ ok: true, message: '设备已解绑' });
});

// 设置主设备
app.put('/api/devices/:deviceId/set-primary', (req, res) => {
  const devices = readDB(DB.devices);
  
  // 先取消所有设备的主设备状态
  devices.forEach(d => d.is_primary = false);
  
  // 设置新的主设备
  const device = devices.find(d => d.device_id === req.params.deviceId);
  if (!device) return res.status(404).json({ ok: false, error: '设备未找到' });
  
  device.is_primary = true;
  writeDB(DB.devices, devices);
  res.json({ ok: true, message: '已设为主设备' });
});

// 验证设备是否已绑定
app.get('/api/devices/verify/:deviceId', (req, res) => {
  const devices = readDB(DB.devices);
  const device = devices.find(d => d.device_id === req.params.deviceId);
  
  if (!device) {
    return res.json({ ok: false, bound: false });
  }
  
  // 更新最后活跃时间
  device.last_active = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  writeDB(DB.devices, devices);
  
  res.json({ ok: true, bound: true, device });
});

// SSE 实时通知
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  res.write('data: {"type":"connected"}\n\n');
  sseClients.push(res);
  req.on('close', () => {
    const i = sseClients.indexOf(res);
    if (i > -1) sseClients.splice(i, 1);
  });
});

// ========== 店铺配置 API ==========

// 获取配置
app.get('/api/config', (req, res) => {
  res.json(readDB(DB.config));
});

// 更新配置
app.put('/api/config', (req, res) => {
  const config = readDB(DB.config);
  const fields = ['delivery_fee', 'min_delivery', 'shop_name', 'shop_phone', 'shop_base_url', 'open_time', 'close_time', 'is_open', 'map_api_key', 'map_provider'];
  fields.forEach(f => {
    if (req.body[f] !== undefined) config[f] = req.body[f];
  });
  writeDB(DB.config, config);
  res.json({ ok: true, config });
});

// ========== 图片上传 API ==========

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未选择文件' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ ok: true, url });
});

// ========== 统计 API ==========

app.get('/api/stats/today', (req, res) => {
  const orders = readDB(DB.orders);
  let revenue = 0, count = 0;
  orders.forEach(o => {
    if (o.status !== 'paid') return;
    revenue += parseFloat(o.total) || 0;
    count++;
  });
  res.json({ revenue, count });
});

// ========== QR 二维码 ==========
const QRCode = require('qrcode');

app.get('/api/qrcode', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('缺少 url 参数');
  try {
    const dataUrl = await QRCode.toDataURL(url, { width: 320, margin: 2, color: { dark: '#1a1a1a', light: '#ffffff' } });
    res.json({ dataUrl });
  } catch(e) {
    res.status(500).json({ error: '生成失败' });
  }
});

// ========== 启动 ==========
function getIPs() {
  const nets = require('os').networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) ips.push(net.address);
    }
  }
  return ips;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  🍖 烧烤小炒点单系统 v1.0');
  console.log('  ──────────────────────────');
  console.log(`  端口: ${PORT}`);
  const ips = getIPs();
  ips.forEach(ip => console.log(`  地址: http://${ip}:${PORT}`));
  console.log('');
});
