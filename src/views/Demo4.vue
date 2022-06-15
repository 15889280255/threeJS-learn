<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { onMounted, ref } from "vue";
import { Mesh, Object3D, PerspectiveCamera, WebGLRenderer } from "three";
import useResetWindow from "../hooks/useResetWindow";
import addTextLabel from "../utils/addTextLabel";
import useStats from "../hooks/useStats";
import { makeTextSprite } from "../utils/addSpriteLabelText";
import VDialog from "../components/VDialog.vue";
import VButton from "../components/VButton.vue";

const canvasDom = ref<HTMLCanvasElement>();
const renderRef = ref<WebGLRenderer>();
const cameraRef = ref<PerspectiveCamera>();

const { handleResize } = useResetWindow(renderRef, cameraRef);

onMounted(() => {
  init();
  handleResize();
});

function init() {
  const scene = new THREE.Scene();
  // 添加坐标轴 xyz
  // scene.add(new THREE.AxesHelper(5));

  const light = new THREE.PointLight();
  light.position.set(0.8, 1.4, 1.0);
  scene.add(light);

  const light1 = new THREE.PointLight();
  light.position.set(0.8, 1.4, -1.0);
  scene.add(light1);

  const ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, -0.5, 0.8);
  cameraRef.value = camera;

  let renderer = new THREE.WebGLRenderer({
    canvas: canvasDom.value,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderRef.value = renderer;

  // 加载模型
  const loader = new GLTFLoader();
  loader.load(
    "./model/first.glb",
    (gltf) => {
      const object = gltf.scene;
      console.log("object: ", object);
      object.traverse(function (item) {
        if (item instanceof Mesh) {
          item.material.transparent = true;
          item.material.opacity = 0.9;
        }
      });
      scene.add(object);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );

  const temp = ref(10);
  const temp2 = ref(10);

  addTextLabel(
    scene,
    100,
    50,
    `设备1 ${temp.value}°C`,
    15,
    35,
    [-0.6, 0.2, 0.1]
  );
  addTextLabel(
    scene,
    100,
    50,
    `设备1 ${temp2.value}°C`,
    15,
    35,
    [-0.6, 0.2, 0.1]
  );
  // addTextLabel(scene, 100, 50, "设备4 330°C", 15, 35, [0.4, 0, 0.1]);

  // 清空雪碧图
  function clearSprite(type = "Sprite") {
    const children: Object3D[] = [];
    (scene.children || []).forEach((v, idx) => {
      if (v.type !== type) {
        children.push(v);
      }
    });
    scene.children = children;
  }

  // 添加雪碧图
  function initSprite() {
    temp.value += 1;
    temp2.value += 2;
    clearSprite();
    addTextLabel(
      scene,
      100,
      50,
      `设备1 ${temp.value}°C`,
      15,
      35,
      [-0.6, 0.2, 0.1]
    );
    addTextLabel(
      scene,
      100,
      50,
      `设备2 ${temp2.value}°C`,
      15,
      35,
      [-0.6, -0.4, 0.1]
    );
    makeTextSprite(scene, `设备2 ${temp2.value}°C`);
  }

  setInterval(() => {
    initSprite();
  }, 1000);

  // Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动。
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, -0.1, 0);

  const { stats } = useStats();
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
}

// 详细数据弹框
const showDialog = ref(true);
</script>

<template>
  <canvas id="canvas" style="display: none"></canvas>
  <canvas id="canvasDom" ref="canvasDom"></canvas>
  <div class="actionButton">
    <VButton id="seeInfoBtn" @click="() => (showDialog = !showDialog)">
      查看详细数据
    </VButton>
    <VButton id="controlBtn">控制参数</VButton>
  </div>
  <VDialog
    :show="showDialog"
    :width="'300px'"
    :top="'100px'"
    :background-color="'rgb(21,149,260,0.85)'"
  >
    <div>
      设备1：
      <VButton @click="() => (showDialog = !showDialog)"> 开机 </VButton>
    </div>
    <div>室内温度： 20°C</div>
    <div>室内温度： 20°C</div>
    <div>室内温度： 20°C</div>
    <div>室内温度： 20°C</div>
  </VDialog>
</template>

<style lang="scss" scoped>
#canvasDom {
  display: block;
  width: inherit;
  height: inherit;
}
.actionButton {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
