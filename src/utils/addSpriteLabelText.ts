import { Scene, Sprite, SpriteMaterial, Texture, Vector2 } from "three";

// 绘制矩形
export function createRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  bgColor: string
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.shadowColor = "";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
}

// 绘制文字
export function measureText(
  text: string,
  ctx: CanvasRenderingContext2D,
  font: string
) {
  if (font) ctx.font = font;
  return ctx.measureText(text).width;
}

// 创建字体精灵
export function makeTextSprite(
  scene: Scene,
  text: string,
  cWidth = 100,
  cHeight = 50
) {
  let canvas = document.createElement("canvas");
  canvas.width = cWidth;
  canvas.height = cHeight;
  const context = canvas.getContext("2d");
  const backgroundColor = "rgba(55,127,200,0.5)";
  const color = "rgba(255,255,255,1)"; // 字体颜色
  if (!context) return;
  const fontsize = 12;
  /* 字体加粗 */
  context.font = "Bold " + fontsize + "px " + "Microsoft YaHei";

  context.fillStyle = backgroundColor;
  createRoundRect(context, 0, 0, cWidth, cHeight, 10, backgroundColor);

  context.fillStyle = color;
  context.fillText(text, 10, 12);

  // /* 边框厚度 */
  let borderWith = 4;
  // /* 边框颜色 */
  let borderColor = "rgba(255,255,255,1)";
  // /* 边框的颜色 */
  context.strokeStyle = borderColor;
  context.lineWidth = borderWith;

  /* 画布内容用于纹理贴图 */
  const texture = new Texture(canvas);
  texture.needsUpdate = true;
  const spriteMaterial = new SpriteMaterial({ map: texture });
  const sprite = new Sprite(spriteMaterial);
  /* 缩放比例 */
  sprite.scale.set(0.1, 0.1, 0.1);
  sprite.center = new Vector2(0, 0);
  scene.add(sprite);
  return sprite;
}
