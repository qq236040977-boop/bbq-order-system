import { kvGet, kvPut, initDefaults, json, parseBody } from '../_lib.js';

export async function onRequestGet(context) {
  const { env } = context;
  await initDefaults(env);
  const config = await kvGet(env, 'config');
  return json(config || {});
}

export async function onRequestPut(context) {
  const { env, request } = context;
  await initDefaults(env);
  const config = await kvGet(env, 'config') || {};
  const body = await parseBody(request);
  const fields = ['delivery_fee', 'min_delivery', 'shop_name', 'shop_phone', 'open_time', 'close_time', 'is_open', 'map_api_key', 'map_provider'];
  fields.forEach(f => { if (body[f] !== undefined) config[f] = body[f]; });
  await kvPut(env, 'config', config);
  return json({ ok: true, config });
}
