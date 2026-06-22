import { kvGet, kvPut, initDefaults, json, parseBody } from '../_lib.js';

export async function onRequestGet(context) {
  const { env, params } = context;
  await initDefaults(env);
  const devices = await kvGet(env, 'devices') || [];

  // GET /api/devices/verify/:deviceId
  if (params.deviceId) {
    const device = devices.find(d => d.device_id === params.deviceId);
    if (!device) return json({ ok: false, bound: false });
    device.last_active = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    await kvPut(env, 'devices', devices);
    return json({ ok: true, bound: true, device });
  }

  return json(devices);
}

export async function onRequestPost(context) {
  const { env, request, params } = context;
  await initDefaults(env);
  const devices = await kvGet(env, 'devices') || [];
  const body = await parseBody(request);
  const { device_id, device_name } = body;

  if (!device_id) return json({ ok: false, error: '缺少设备ID' }, 400);

  const existing = devices.find(d => d.device_id === device_id);
  if (existing) {
    existing.last_active = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    await kvPut(env, 'devices', devices);
    return json({ ok: true, device: existing, message: '设备已重新连接' });
  }

  if (devices.length >= 5) {
    return json({ ok: false, error: '设备数量已达上限（最多5台）' }, 403);
  }

  const isPrimary = devices.length === 0;
  const device = {
    id: (devices.length ? Math.max(...devices.map(d => d.id)) : 0) + 1,
    device_id, device_name: device_name || '未命名设备', is_primary: isPrimary,
    bound_at: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    last_active: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
  };
  devices.push(device);
  await kvPut(env, 'devices', devices);
  return json({ ok: true, device, message: isPrimary ? '绑定成功，此设备已设为主手机' : '绑定成功' });
}

export async function onRequestDelete(context) {
  const { env, params } = context;
  await initDefaults(env);
  const devices = await kvGet(env, 'devices') || [];
  const idx = devices.findIndex(d => d.device_id === params.deviceId);
  if (idx === -1) return json({ ok: false, error: '设备未找到' }, 404);
  if (devices[idx].is_primary && devices.length > 1) {
    const nextDevice = devices.find((d, i) => i !== idx);
    if (nextDevice) nextDevice.is_primary = true;
  }
  devices.splice(idx, 1);
  await kvPut(env, 'devices', devices);
  return json({ ok: true, message: '设备已解绑' });
}
