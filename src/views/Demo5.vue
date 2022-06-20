<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { onMounted, ref } from "vue";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  CanvasTexture,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";
import useResetWindow from "../hooks/useResetWindow";
import useStats from "../hooks/useStats";

const canvasDom = ref<HTMLCanvasElement>();
const { stats } = useStats(); //帧率

// 初始化渲染器
function initRenderer() {
  const renderer = new WebGLRenderer({
    canvas: canvasDom.value,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x77dddd, 0.7); //渲染背景颜色
  return renderer;
}

// 初始化相机
function initCamera() {
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1500
  );
  camera.position.set(180, 0, 0);
  return camera;
}

// 初始化场景
function initScene() {
  const scene = new THREE.Scene();
  // 添加坐标轴 xyz
  scene.add(new AxesHelper(100));
  return scene;
}

// 初始化灯光
function initLight(scene: Scene) {
  const light = new PointLight();
  light.position.set(0.8, 1.4, 1.0);
  scene.add(light);

  const light1 = new PointLight();
  light.position.set(0.8, 1.4, -1.0);
  scene.add(light1);

  const ambientLight = new AmbientLight(); // 环境光
  scene.add(ambientLight);
}

// 初始化控制器
function initControls(camera: PerspectiveCamera, renderer: WebGLRenderer) {
  // controls（轨道控制器）可以使得相机围绕目标进行轨道运动。
  // 用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 使动画循环使用时阻尼或自转 意思是否有惯性
  controls.enableZoom = true; //是否可以缩放
  controls.autoRotate = false; //是否自动旋转
  // controls.minDistance = 2.1; //设置相机距离原点的最远距离
  // controls.maxDistance = 10; //设置相机距离原点的最远距离
  controls.enablePan = true; //是否开启右键拖拽
  controls.target.set(0, 0, 75); // 设置角度
  return controls;
}

function getTextCanvas1() {
  let texts = [
    {
      name: "北京",
      value: 323,
    },
    {
      name: "杭州",
      value: 121,
    },
    {
      name: "南京",
      value: 56,
    },
  ];
  var width = 512,
    height = 256;
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#C3C3C3";
  ctx.fillRect(0, 0, width, height);
  ctx.font = 32 + 'px " bold';
  ctx.fillStyle = "#2891FF";
  texts.forEach((text, index) => {
    ctx?.fillText(`${text.name}:${text.value}`, 10, 32 * index + 30);
  });
  return canvas;
}

function getTextCanvas2(scene: Scene) {
  const text =
    "three.js是用javascript写的基于webGL的第三方3D库,通过它可以在网页中进行3D建模,结合上TweenMax.js动画库,";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 300;
  canvas.height = 300;
  if (!ctx) return;
  // 制作矩形
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, 300, 300);
  // 设置文字
  ctx.fillStyle = "white";
  ctx.font = "normal 20px 楷体";
  // ctx.fillText(text, 2, 20);

  // 文字换行
  const rowCharLength = 15;
  const row = Number(text.length / rowCharLength);
  for (let i = 0; i < row; i++) {
    let word = text.substring(i * rowCharLength, (i + 1) * rowCharLength);
    ctx.fillText(word, 15, 25 * (i + 1));
  }

  // 生成图片
  const url = canvas.toDataURL("image/png");
  const geometry = new PlaneGeometry(30, 30);
  const material = new MeshBasicMaterial({
    map: new TextureLoader().load(url),
    side: DoubleSide,
    opacity: 1,
    transparent: true, // 设为透明
  });

  const rect = new Mesh(geometry, material);
  rect.position.set(0, 0, 15.1);
  scene.add(rect);
}

function initMesh(scene: Scene) {
  const geometry = new BoxGeometry(30, 30, 30);
  const canvasEl = getTextCanvas1() || document.createElement("canvas");
  const materials = [
    new MeshBasicMaterial({ map: new CanvasTexture(canvasEl) }), // top
    new MeshBasicMaterial({ color: "blue" }),
    new MeshBasicMaterial({ color: "red" }),
    new MeshBasicMaterial({ color: "yellow" }),
    new MeshBasicMaterial({ color: "white" }),
    new MeshBasicMaterial({ color: "black" }),
  ];
  const cube = new Mesh(geometry, materials);
  scene.add(cube);
  cube.position.set(0, 0, 0);
}

async function init() {
  const camera = initCamera();
  const renderer = initRenderer();
  const scene = initScene();
  const controls = initControls(camera, renderer);
  const { handleResize } = useResetWindow(renderer, camera);
  initLight(scene);

  initMesh(scene);
  getTextCanvas2(scene);

  function animate() {
    requestAnimationFrame(animate);

    controls.update();
    stats.update();
    render();
  }
  function render() {
    renderer.render(scene, camera);
  }

  animate();
  handleResize();
}

onMounted(() => {
  init();
});
</script>

<template>
  <div>
    <canvas id="canvas" style="display: none"></canvas>
    <canvas id="canvasDom" ref="canvasDom"></canvas>
  </div>
</template>

<style lang="scss" scoped>
#canvasDom {
  display: block;
  width: inherit;
  height: inherit;
}
</style>
