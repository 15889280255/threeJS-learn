<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { nextTick, onMounted, ref } from "vue";
import { Mesh, Object3D, PerspectiveCamera, WebGLRenderer } from "three";
import useResetWindow from "../hooks/useResetWindow";
import addTextLabel from "../utils/addTextLabel";
import useStats from "../hooks/useStats";
import { makeTextSprite } from "../utils/addSpriteLabelText";
import VDialog from "../components/VDialog.vue";
import VButton from "../components/VButton.vue";
import VLoading from '../components/VLoading.vue'

const canvasDom = ref<HTMLCanvasElement>();
const renderRef = ref<WebGLRenderer>();
const cameraRef = ref<PerspectiveCamera>();

const temp = ref(10);
const temp2 = ref(10);
const showLoading = ref(true)

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
      object.traverse(function (item) {
        if (item instanceof Mesh) {
          item.material.transparent = true;
          item.material.opacity = 0.9;
        }
      });
      scene.add(object);
    },
    (xhr) => {
      const percentage = (xhr.loaded / xhr.total) * 100
      if (percentage >= 99){
         showLoading.value = false
         nextTick(()=>handleResize())
      }
    },
    (error) => {
      console.log(error);
    }
  );

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
const showDialog = ref(false);
</script>

<template>
  <VLoading :show-loading="showLoading" />
  <div v-show="!showLoading">
    <canvas id="canvas" style="display: none"></canvas>
    <canvas id="canvasDom" ref="canvasDom"></canvas>
    <div class="actionButton">
      <VButton id="seeInfoBtn" @click="() => (showDialog = !showDialog)">
        查看详细数据
      </VButton>
    </div>
    <VDialog v-model:show="showDialog" :width="'350px'" :top="'100px'" :title="'设备实时数据'"
      :background-color="'rgba(92,158,240,0.9)'">
      <div class="dialogContent">
        <table cellpadding="4">
          <thead>
            <th>
            <td colspan="3">设备1：</td>
            </th>
          </thead>
          <tbody>
            <tr>
              <td>室内温度：</td>
              <td>{{ temp }}</td>
              <td>°C</td>
            </tr>
            <tr>
              <td>电源输入端电压有效:</td>
              <td>{{ temp2 }}</td>
              <td>°C</td>
            </tr>
            <tr>
              <td>PFC散热片或PFC模块温度：</td>
              <td>{{ temp }}</td>
              <td>°C</td>
            </tr>
            <tr>
              <td>IPM散热片或IPM模块温度：</td>
              <td>{{ temp2 }}</td>
              <td>°C</td>
            </tr>
          </tbody>
        </table>
        <table cellpadding="4">
          <thead>
            <th>
            <td colspan="3">设备2：</td>
            </th>
          </thead>
          <tbody>
            <tr>
              <td>室内温度：</td>
              <td>{{ temp }}</td>
              <td>°C</td>
            </tr>
            <tr>
              <td>电源输入端电压有效:</td>
              <td>{{ temp2 }}</td>
              <td>°C</td>
            </tr>
            <tr>
              <td>PFC散热片或PFC模块温度：</td>
              <td>{{ temp }}</td>
              <td>°C</td>
            </tr>
            <tr>
              <td>IPM散热片或IPM模块温度：</td>
              <td>{{ temp2 }}</td>
              <td>°C</td>
            </tr>
          </tbody>
        </table>
        <VButton @click="() => (showDialog = !showDialog)"> 开机 </VButton>
        <VButton @click="() => (showDialog = !showDialog)"> 关机 </VButton>
      </div>
    </VDialog>
  </div>
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

.dialogContent {
  .keyValueUnit {
    display: flex;
  }
}
</style>
