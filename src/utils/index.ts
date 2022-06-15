import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { DoubleSide, Mesh, MeshPhongMaterial, Object3D } from "three";

export function createMaterial() {
  const material = new MeshPhongMaterial({ side: DoubleSide });
  const hue = Math.floor(Math.random() * 100); // 1-100随机色相
  const saturation = 1; // 饱和度
  const luminance = 0.5; //亮度

  material.color.setHSL(hue, saturation, luminance);
  return material;
}

export function loadFont(url: string): Promise<Font> {
  const loader = new FontLoader();
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

export async function createText(text: string) {
  // 在使用 TextBufferGeometry 创建 文字几何对象之前，需要先加载 3D 字体数据
  const url =
    "https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json";

  const font = await loadFont(url);

  //第一个参数 'puxiao' 可以替换成任何其他的英文字母
  //特别注意：由于目前我们加载的 字体数据 只是针对英文字母的字体轮廓描述，并没有包含中文字体轮廓
  //所以如果设置成 汉字，则场景无法正常渲染出文字
  //对于无法渲染的字符，会被渲染成 问号(?) 作为替代
  //第二个参数对应的是文字外观配置
  const geometry = new TextGeometry(text, {
    font: font,
    size: 3.0,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.3,
    bevelSegments: 5,
  });

  const mesh = new Mesh(geometry, createMaterial());

  geometry.computeBoundingBox();
  geometry.boundingBox?.getCenter(mesh.position).multiplyScalar(-1);

  const t = new Object3D();
  t.add(mesh);

  return t;
}
