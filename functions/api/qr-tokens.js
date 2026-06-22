import { kvGet, kvPut, initDefaults, json, parseBody } from '../_lib.js';

export async function onRequestPost(context) {
  const { env } = context;
  await initDefaults(env);
  const tokens = await kvGet(env, 'qr_tokens') || [];
  const token = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const record = {
    token, created_at: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    used: false, used_at: null, order_id: null,
  };
  tokens.unshift(record);
  await kvPut(env, 'qr_tokens', tokens);
  return json({ ok: true, token, record });
}

export async function onRequestGet(context) {
  const { env } = context;
  await initDefaults(env);
  const tokens = await kvGet(env, 'qr_tokens') || [];
  return json(tokens);
}

export async function onRequestDelete(context) {
  const { env, params } = context;
  await initDefaults(env);
  const tokens = await kvGet(env, 'qr_tokens') || [];
  const idx = tokens.findIndex(t => t.token === params.token);
  if (idx === -1) return json({ error: 'not found' }, 404);
  tokens[idx].used = true;
  tokens[idx].used_at = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  await kvPut(env, 'qr_tokens', tokens);
  return json({ ok: true });
}
