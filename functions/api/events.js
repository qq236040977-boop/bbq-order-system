// Cloudflare Pages Functions - SSE 实时通知
// CF Pages 使用 D1/KV + 轮询替代长连接
// 这里提供一个简化的轮询接口

import { kvGet, kvPut, initDefaults, json } from '../_lib.js';

export async function onRequestGet(context) {
  const { env } = context;
  await initDefaults(env);

  // CF Pages 不支持真正的 SSE 长连接
  // 改为返回最近订单列表供前端轮询
  const orders = await kvGet(env, 'orders') || [];
  const recentOrders = orders.slice(0, 20);

  // 返回 JSON 而非 SSE 流
  return new Response(JSON.stringify({
    type: 'poll',
    data: {
      connected: true,
      recent_orders: recentOrders,
      timestamp: new Date().toISOString()
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

// 同时支持 POST 来发送通知（内部调用）
export async function onRequestPost(context) {
  return json({ type: 'ack', message: 'CF Pages 模式下使用轮询获取新订单' });
}
