import { kvGet, kvPut, initDefaults, json, parseBody } from '../_lib.js';

export async function onRequestGet(context) {
  const { env, url } = context;
  await initDefaults(env);
  const categories = await kvGet(env, 'categories') || [];
  const menu = await kvGet(env, 'menu') || [];

  // /api/menu/specials
  if (url.pathname.includes('/specials')) {
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = c.name; });
    const items = menu.filter(m => m.special && m.avail).map(m => ({ ...m, catName: catMap[m.cat] || '' }));
    return json(items.sort((a, b) => a.cat - b.cat));
  }

  // /api/menu/all
  if (url.pathname.includes('/all')) {
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = c.name; });
    return json(menu.map(m => ({ ...m, catName: catMap[m.cat] || '' })));
  }

  // /api/menu (顾客用，只返上架的)
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c.name; });
  const items = menu.filter(m => m.avail).map(m => ({ ...m, catName: catMap[m.cat] || '' })).sort((a, b) => a.cat - b.cat || a.sort - b.sort);
  return json(items);
}

export async function onRequestPost(context) {
  const { env, request } = context;
  await initDefaults(env);
  const body = await parseBody(request);
  const menu = await kvGet(env, 'menu') || [];
  const { cat, name, price, unit, desc, special, image } = body;
  const item = {
    id: (menu.length ? Math.max(...menu.map(m => m.id)) : 0) + 1,
    cat: parseInt(cat) || 1,
    name, price: parseFloat(price), unit: unit || '份',
    desc: desc || '', special: !!special, avail: true,
    image: image || '',
    sort: menu.filter(m => m.cat === parseInt(cat)).length + 1
  };
  menu.push(item);
  await kvPut(env, 'menu', menu);
  return json({ ok: true, item });
}

export async function onRequestPut(context) {
  const { env, params, request } = context;
  await initDefaults(env);
  const menu = await kvGet(env, 'menu') || [];
  const idx = menu.findIndex(m => m.id === parseInt(params.id));
  if (idx === -1) return json({ error: 'not found' }, 404);

  const url = new URL(request.url);
  const body = await parseBody(request);

  // PUT /api/menu/:id/toggle
  if (url.pathname.includes('/toggle')) {
    menu[idx].avail = !menu[idx].avail;
    await kvPut(env, 'menu', menu);
    return json({ ok: true, avail: menu[idx].avail });
  }

  // PUT /api/menu/:id/special
  if (url.pathname.includes('/special')) {
    menu[idx].special = !menu[idx].special;
    await kvPut(env, 'menu', menu);
    return json({ ok: true, special: menu[idx].special });
  }

  // PUT /api/menu/:id/sort
  if (url.pathname.includes('/sort')) {
    const dir = body.dir;
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
    await kvPut(env, 'menu', menu);
    return json({ ok: true });
  }

  // 普通编辑
  const { cat, name, price, unit, desc, special, avail, image } = body;
  if (cat !== undefined) menu[idx].cat = parseInt(cat);
  if (name !== undefined) menu[idx].name = name;
  if (price !== undefined) menu[idx].price = parseFloat(price);
  if (unit !== undefined) menu[idx].unit = unit;
  if (desc !== undefined) menu[idx].desc = desc;
  if (special !== undefined) menu[idx].special = !!special;
  if (avail !== undefined) menu[idx].avail = !!avail;
  if (image !== undefined) menu[idx].image = image;
  await kvPut(env, 'menu', menu);
  return json({ ok: true, item: menu[idx] });
}

export async function onRequestDelete(context) {
  const { env, params } = context;
  await initDefaults(env);
  let menu = await kvGet(env, 'menu') || [];
  menu = menu.filter(m => m.id !== parseInt(params.id));
  await kvPut(env, 'menu', menu);
  return json({ ok: true });
}
