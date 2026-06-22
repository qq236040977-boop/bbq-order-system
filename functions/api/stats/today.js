import { kvGet, kvPut, initDefaults, json } from '../_lib.js';

export async function onRequestGet(context) {
  const { env } = context;
  await initDefaults(env);
  const orders = await kvGet(env, 'orders') || [];
  let revenue = 0, count = 0;
  orders.forEach(o => {
    if (o.status !== 'paid') return;
    revenue += parseFloat(o.total) || 0;
    count++;
  });
  return json({ revenue, count });
}
