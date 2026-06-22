import { kvGet, kvPut, initDefaults, json, parseBody } from '../_lib.js';

export async function onRequestGet(context) {
  const { env } = context;
  await initDefaults(env);
  const cats = await kvGet(env, 'categories');
  return json((cats || []).sort((a, b) => a.sort - b.sort));
}

export async function onRequestPost(context) {
  const { env, request } = context;
  await initDefaults(env);
  const body = await parseBody(request);
  const cats = await kvGet(env, 'categories') || [];
  const { name } = body;
  if (!name || !name.trim()) return json({ error: '分类名不能为空' }, 400);
  const cat = { id: (cats.length ? Math.max(...cats.map(c => c.id)) : 0) + 1, name: name.trim(), sort: cats.length + 1 };
  cats.push(cat);
  await kvPut(env, 'categories', cats);
  return json({ ok: true, cat });
}

export async function onRequestPut(context) {
  const { env, params } = context;
  await initDefaults(env);
  const cats = await kvGet(env, 'categories') || [];
  const idx = cats.findIndex(c => c.id === parseInt(params.id));
  if (idx === -1) return json({ error: 'not found' }, 404);
  const body = await parseBody(context.request);
  if (body.name !== undefined) cats[idx].name = body.name.trim();
  await kvPut(env, 'categories', cats);
  return json({ ok: true, cat: cats[idx] });
}

export async function onRequestDelete(context) {
  const { env, params } = context;
  await initDefaults(env);
  const cats = await kvGet(env, 'categories') || [];
  const idx = cats.findIndex(c => c.id === parseInt(params.id));
  if (idx === -1) return json({ error: 'not found' }, 404);
  const menu = await kvGet(env, 'menu') || [];
  if (menu.some(m => m.cat === parseInt(params.id))) {
    return json({ error: '该分类下还有菜品，请先删除或移走菜品' }, 400);
  }
  cats.splice(idx, 1);
  await kvPut(env, 'categories', cats);
  return json({ ok: true });
}
