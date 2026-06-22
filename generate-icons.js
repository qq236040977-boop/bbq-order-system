const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(ctx, size) {
  // 背景渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, '#FF6B35');
  gradient.addColorStop(1, '#E55A2B');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  const r = size * 0.2;
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // 白色主文字 "烧"
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${size * 0.5}px sans-serif`;
  ctx.fillText('烧', size / 2, size / 2 - size * 0.1);

  // 副文字 "烤"
  ctx.font = `bold ${size * 0.3}px sans-serif`;
  ctx.fillText('烤', size / 2, size / 2 + size * 0.25);

  // 装饰火花点
  ctx.fillStyle = '#FFB800';
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
    const x = size / 2 + Math.cos(angle) * size * 0.38;
    const y = size / 2 + Math.sin(angle) * size * 0.38;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 生成 192x192
const canvas192 = createCanvas(192, 192);
const ctx192 = canvas192.getContext('2d');
drawIcon(ctx192, 192);
const buf192 = canvas192.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, 'public', 'icon-192.png'), buf192);
console.log('✅ icon-192.png 已生成');

// 生成 512x512
const canvas512 = createCanvas(512, 512);
const ctx512 = canvas512.getContext('2d');
drawIcon(ctx512, 512);
const buf512 = canvas512.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, 'public', 'icon-512.png'), buf512);
console.log('✅ icon-512.png 已生成');

console.log('\n图标文件已保存到 public/ 目录');
