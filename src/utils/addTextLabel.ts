import { Scene, Sprite, SpriteMaterial, TextureLoader } from "three";

function addTextLabel(
  scene: Scene,
  wid: number,
  hgt: number,
  textWord: string,
  ww: number,
  wh: number,
  cvsPosition: number[]
) {
  //用canvas生成图片
  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) return;
  let ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = wid; //100
  canvas.height = hgt; //50
  //制作矩形
  ctx.fillStyle = "rgba(140, 141, 142,0.8)";
  ctx.fillRect(0, 0, 100, 50);
  //设置文字
  ctx.fillStyle = "#fff";
  ctx.font = 'normal 10pt "楷体"';
  //文字换行
  ctx.fillText(textWord, ww, wh);
  //生成图片
  let url = canvas.toDataURL("image/png");
  var spriteMaterial = new SpriteMaterial({
    map: new TextureLoader().load(url), //设置精灵纹理贴图
    transparent: true, //开启透明(纹理图片png有透明信息)
  });
  // 创建精灵模型对象，不需要几何体geometry参数
  var sprite = new Sprite(spriteMaterial);
  sprite.scale.set(0.2, 0.1, 0); //精灵图大小
  // sprite.translateY(50);
  const [x, y, z] = cvsPosition;
  sprite.position.set(x, y, z);
  scene.add(sprite);
}

export default addTextLabel;
