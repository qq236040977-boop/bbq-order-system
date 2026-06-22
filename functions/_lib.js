// Cloudflare Pages Functions - 共享 KV 数据库操作
// 所有数据存储在 Cloudflare KV 中

const DEFAULT_CONFIG = {
  delivery_fee: 5,
  min_delivery: 20,
  shop_name: '春萍烧烤',
  shop_phone: '',
  open_time: '16:00',
  close_time: '02:00',
  is_open: true,
  map_api_key: '',
  map_provider: 'amap',
};

const DEFAULT_CATEGORIES = [
  { id: 1, name: '招牌烧烤', sort: 1 },
  { id: 2, name: '经典小炒', sort: 2 },
  { id: 3, name: '凉菜小食', sort: 3 },
  { id: 4, name: '主食', sort: 4 },
  { id: 5, name: '酒水饮料', sort: 5 },
];

const DEFAULT_MENU = [
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
  { id: 11, cat: 2, name: '回锅肉', price: 28, unit: '份', desc: '蒜苗回锅肉，下饭', special: true, avail: true, sort: 1, image: '' },
  { id: 12, cat: 2, name: '鱼香肉丝', price: 26, unit: '份', desc: '酸甜微辣经典川味', special: false, avail: true, sort: 2, image: '' },
  { id: 13, cat: 2, name: '宫保鸡丁', price: 28, unit: '份', desc: '花生鸡丁香辣可口', special: false, avail: true, sort: 3, image: '' },
  { id: 14, cat: 2, name: '青椒肉丝', price: 22, unit: '份', desc: '家常小炒清爽不腻', special: false, avail: true, sort: 4, image: '' },
  { id: 15, cat: 2, name: '麻婆豆腐', price: 18, unit: '份', desc: '麻辣鲜香嫩', special: false, avail: true, sort: 5, image: '' },
  { id: 16, cat: 2, name: '干煸四季豆', price: 20, unit: '份', desc: '焦香入味', special: false, avail: true, sort: 6, image: '' },
  { id: 17, cat: 2, name: '酸辣土豆丝', price: 15, unit: '份', desc: '脆爽开胃', special: true, avail: true, sort: 7, image: '' },
  { id: 18, cat: 2, name: '糖醋里脊', price: 32, unit: '份', desc: '外酥里嫩酸甜味', special: false, avail: true, sort: 8, image: '' },
  { id: 19, cat: 3, name: '拍黄瓜', price: 12, unit: '份', desc: '蒜泥醋汁清爽解腻', special: false, avail: true, sort: 1, image: '' },
  { id: 20, cat: 3, name: '凉拌皮蛋', price: 15, unit: '份', desc: '剁椒皮蛋豆腐', special: false, avail: true, sort: 2, image: '' },
  { id: 21, cat: 3, name: '花生毛豆', price: 10, unit: '份', desc: '水煮五香', special: false, avail: true, sort: 3, image: '' },
  { id: 22, cat: 3, name: '凉拌木耳', price: 14, unit: '份', desc: '酸辣脆爽', special: false, avail: true, sort: 4, image: '' },
  { id: 23, cat: 4, name: '蛋炒饭', price: 12, unit: '份', desc: '粒粒分明蛋香十足', special: false, avail: true, sort: 1, image: '' },
  { id: 24, cat: 4, name: '炒河粉', price: 15, unit: '份', desc: '干炒牛河风味', special: false, avail: true, sort: 2, image: '' },
  { id: 25, cat: 4, name: '白米饭', price: 2, unit: '碗', desc: '', special: false, avail: true, sort: 3, image: '' },
  { id: 26, cat: 4, name: '炒面', price: 15, unit: '份', desc: '三丝炒面', special: false, avail: true, sort: 4, image: '' },
  { id: 27, cat: 5, name: '啤酒', price: 8, unit: '瓶', desc: '冰镇啤酒', special: false, avail: true, sort: 1, image: '' },
  { id: 28, cat: 5, name: '王老吉', price: 6, unit: '罐', desc: '', special: false, avail: true, sort: 2, image: '' },
  { id: 29, cat: 5, name: '可乐', price: 5, unit: '罐', desc: '', special: false, avail: true, sort: 3, image: '' },
  { id: 30, cat: 5, name: '雪碧', price: 5, unit: '罐', desc: '', special: false, avail: true, sort: 4, image: '' },
  { id: 31, cat: 5, name: '矿泉水', price: 2, unit: '瓶', desc: '', special: false, avail: true, sort: 5, image: '' },
  { id: 32, cat: 5, name: '酸梅汤', price: 8, unit: '杯', desc: '自制冰镇酸梅汤', special: true, avail: true, sort: 6, image: '' },
];

// 从 KV 读取数据
export async function kvGet(env, key) {
  const val = await env.BBQ_KV.get(key, { type: 'json' });
  return val;
}

// 写入 KV
export async function kvPut(env, key, data) {
  await env.BBQ_KV.put(key, JSON.stringify(data));
}

// 初始化默认数据（如果不存在）
export async function initDefaults(env) {
  const config = await kvGet(env, 'config');
  if (!config) {
    await kvPut(env, 'config', DEFAULT_CONFIG);
  }
  const categories = await kvGet(env, 'categories');
  if (!categories) {
    await kvPut(env, 'categories', DEFAULT_CATEGORIES);
  }
  const menu = await kvGet(env, 'menu');
  if (!menu) {
    await kvPut(env, 'menu', DEFAULT_MENU);
  }
  const orders = await kvGet(env, 'orders');
  if (!orders) {
    await kvPut(env, 'orders', []);
  }
  const tokens = await kvGet(env, 'qr_tokens');
  if (!tokens) {
    await kvPut(env, 'qr_tokens', []);
  }
  const devices = await kvGet(env, 'devices');
  if (!devices) {
    await kvPut(env, 'devices', []);
  }
}

// 获取下一个 ID
export async function nextId(env, key) {
  const data = await kvGet(env, key);
  if (!data || data.length === 0) return 1;
  return Math.max(...data.map(d => d.id)) + 1;
}

// JSON 响应
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

// 解析请求体
export async function parseBody(req) {
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return req.json();
  } else if (ct.includes('application/x-www-form-urlencoded')) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const obj = {};
    for (const [k, v] of params) obj[k] = v;
    return obj;
  }
  return {};
}
