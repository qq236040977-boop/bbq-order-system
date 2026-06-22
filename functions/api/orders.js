import { kvGet, kvPut, initDefaults, json, parseBody } from '../_lib.js';

export async function onRequestGet(context) {
  const { env, url } = context;
  await initDefaults(env);
  let orders = await kvGet(env, 'orders') || [];
  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');
  if (status) orders = orders.filter(o => o.status === status);
  if (type) orders = orders.filter(o => o.type === type);
  return json(orders);
}

export async function onRequestPost(context) {
  const { env, request } = context;
  await initDefaults(env);
  const body = await parseBody(request);
  const orders = await kvGet(env, 'orders') || [];
  const { table, items, total, note, type, address, phone, delivery_fee, qr_token } = body;

  // 验证点单码
  if (qr_token) {
    const tokens = await kvGet(env, 'qr_tokens') || [];
    const tk = tokens.find(t => t.token === qr_token);
    if (!tk) return json({ ok: false, error: '无效的点单码' }, 400);
    if (tk.used) return json({ ok: false, error: '该点单码已使用，请找老板重新获取' }, 400);
  }

  const order = {
    id: (orders.length ? Math.max(...orders.map(o => o.id)) : 0) + 1,
    type: type || 'dinein', table: table || '', address: address || '', phone: phone || '',
    delivery_fee: delivery_fee || 0, items, total: parseFloat(total),
    note: note || '', status: 'unpaid', qr_token: qr_token || null,
    time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  };
  orders.unshift(order);
  await kvPut(env, 'orders', orders);

  // 消耗点单码
  if (qr_token) {
    const tokens = await kvGet(env, 'qr_tokens') || [];
    const tk = tokens.find(t => t.token === qr_token);
    if (tk) {
      tk.used = true;
      tk.used_at = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      tk.order_id = order.id;
      await kvPut(env, 'qr_tokens', tokens);
    }
  }

  return json({ ok: true, orderId: order.id, message: '下单成功！已通知老板' });
}

export async function onRequestPut(context) {
  const { env, params, request } = context;
  await initDefaults(env);
  const orders = await kvGet(env, 'orders') || [];
  const idx = orders.findIndex(o => o.id === parseInt(params.id));
  if (idx === -1) return json({ error: 'not found' }, 404);
  const body = await parseBody(request);
  orders[idx].status = body.status;
  await kvPut(env, 'orders', orders);
  return json({ ok: true });
}
