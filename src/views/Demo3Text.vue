<script setup lang="ts">
import {
  BufferGeometry,
  Color,
  DirectionalLight,
  LineSegments,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { onMounted, onUnmounted, ref } from "vue";
import useResetWindow from "../hooks/useResetWindow";
import { createMaterial, createText } from "../utils";
import myBox from "../utils/myBox";
import myCircle from "../utils/myCircle";
import myWireframe from "../utils/myWrieframe";

const canvasDomRef = ref<HTMLCanvasElement>();
const rendererRef = ref<WebGLRenderer>();
const cameraRef = ref<PerspectiveCamera>();

const meshArr: (Mesh | LineSegments | Object3D)[] = [];

//定义物体在画面中显示的网格布局
const eachRow = 5; //每一行显示 5 个
const spread = 15; //行高 和 列宽

function getPositionByIndex(index: number) {
  const row = Math.floor(index / eachRow); //计算出所在行
  const column = index % eachRow; //计算出所在列
  const x = (column - 2) * spread;
  const y = (2 - row) * spread;

  return { x, y };
}

// 根据窗口大小变化，重新修改渲染器的视椎
// const { handleResize } = useResetWindow(rendererRef, cameraRef);

onMounted(() => {
  init();
  // handleResize();
});

async function init() {
  if (canvasDomRef.value === null) return;

  meshArr.length = 0; //先清空原有数组

  // 初始化场景
  const scene = new Scene();
  scene.background = new Color(0xaaaaaa);

  // 初始化镜头
  const camera = new PerspectiveCamera(40, 2, 0.1, 1000);
  camera.position.z = 120;
  cameraRef.value = camera;

  // 初始化渲染器
  const renderer = new WebGLRenderer({ canvas: canvasDomRef.value });
  rendererRef.value = renderer;

  // 添加2个灯光
  const light0 = new DirectionalLight(0xfffffff, 1);
  light0.position.set(-1, 2, 4);
  scene.add(light0);

  const light1 = new DirectionalLight(0xffffff, 1);
  light1.position.set(1, -2, -4);
  scene.add(light1);

  // 获得各个 solid 类型的图元实例
  const solidPrimitiveArr: BufferGeometry[] = [];
  solidPrimitiveArr.push(myBox, myCircle, myWireframe);

  //将各个 solid 类型的图元实例转化为网格，并添加到 primitivesArr 中
  solidPrimitiveArr.forEach((item) => {
    const material = createMaterial();
    const mesh = new Mesh(item, material);
    meshArr.push(mesh);
  });

  //创建 3D 文字，并添加到 mesArr 中，请注意此函数为异步函数
  meshArr.push(await createText("xxxxx"));
  meshArr.push(await createText("ABC"));
  meshArr.push(await createText("xxxxx"));

  //配置每一个图元实例，转化为网格，并位置和材质后，将其添加到场景中
  meshArr.forEach((mesh, index) => {
    const { x, y } = getPositionByIndex(index);

    mesh.position.x = x;
    mesh.position.y = y;

    scene.add(mesh); //将网格添加到场景中
  });

  const render = (time: number) => {
    time = time * 0.01;
    meshArr.forEach((item) => {
      item.rotation.x = time;
      item.rotation.y = time;
    });

    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  };
  window.requestAnimationFrame(render);
}
</script>

<template>
  <span>bbb</span>
  <canvas ref="canvasDomRef"></canvas>
</template>

<style lang="scss" scoped>
canvas {
  display: block;
  width: inherit;
  height: inherit;
}
</style>
