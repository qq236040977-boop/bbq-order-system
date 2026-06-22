// Cloudflare Pages Functions - 图片上传（base64方式）
// CF Pages 不支持文件系统，改用 base64 存储

export async function onRequestPost(context) {
  const { request } = context;
  const ct = request.headers.get('content-type') || '';

  // 支持 base64 上传
  if (ct.includes('application/json')) {
    const body = await request.json();
    if (body.base64) {
      const ext = body.ext || 'png';
      const filename = `img_${Date.now()}.${ext}`;
      // 存入 KV（图片数据）
      // 返回 data URL 格式
      const url = `data:image/${ext};base64,${body.base64}`;
      return Response.json({ ok: true, url });
    }
  }

  return Response.json({ error: '请使用 base64 方式上传' }, { status: 400 });
}
