<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { nextTick, onMounted, ref } from "vue";
import { AmbientLight, AxesHelper, Mesh, Object3D, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from "three";
import useResetWindow from "../hooks/useResetWindow";
import addTextLabel from "../utils/addTextLabel";
import useStats from "../hooks/useStats";
import { makeTextSprite } from "../utils/addSpriteLabelText";
import VDialog from "../components/VDialog.vue";
import VButton from "../components/VButton.vue";
import VLoading from '../components/VLoading.vue'

const canvasDom = ref<HTMLCanvasElement>(); 
const { stats } = useStats();//帧率

const temp = ref(10);
const temp2 = ref(10);
const showLoading = ref(true)

// 初始化渲染器
function initRenderer(){
  const renderer = new WebGLRenderer({
    canvas: canvasDom.value,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x77DDDD, 0.7)//渲染背景颜色
  return renderer
}

// 初始化相机
function initCamera(){
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, -0.5, 0.7);
  return camera
}

// 初始化场景
function initScene() {
  const scene = new THREE.Scene();
  // 添加坐标轴 xyz
  // scene.add(new AxesHelper(5));
  return scene
}

// 初始化灯光
function initLight(scene:Scene) {
  const light = new PointLight();
  light.position.set(0.8, 1.4, 1.0);
  scene.add(light);

  const light1 = new PointLight();
  light.position.set(0.8, 1.4, -1.0);
  scene.add(light1);

  const ambientLight = new AmbientLight();// 环境光
  scene.add(ambientLight); 
}

// 加载模型
async function LoadModel(scene:Scene) { 
  return new Promise((resolve,reject)=>{
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
        if (percentage >= 100){
          // showLoading.value = false 
          nextTick(()=>resolve(null))
        }
      },
      (error) => {
        console.log(error);
        reject()
      }
    );
  })
}

// 清空雪碧图
function clearSprite(scene: Scene,type = "Sprite") {
  const children: Object3D[] = [];
  (scene.children || []).forEach((v, idx) => {
    if (v.type !== type) {
      children.push(v);
    }
  });
  scene.children = children;
}

// 添加雪碧图
function initSprite(scene: Scene,) {
    temp.value += 1;
    temp2.value += 2;
    clearSprite(scene); 
    const sprite1 = makeTextSprite(scene, `设备1 ${temp2.value}°C`);
    sprite1?.position.set(-0.6, 0.125, 0.1);
    const sprite2 = makeTextSprite(scene, `设备2 ${temp2.value}°C`);
    sprite2?.position.set(-0.6, -0.15, 0.1);
    const sprite3 = makeTextSprite(scene, `设备3 ${temp2.value}°C`);
    sprite3?.position.set(-0.6, -0.45, 0.1); 
}

// 初始化控制器
function initControls(camera:PerspectiveCamera,renderer:WebGLRenderer) {
  // controls（轨道控制器）可以使得相机围绕目标进行轨道运动。
  // 用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 使动画循环使用时阻尼或自转 意思是否有惯性
  controls.enableZoom = true; //是否可以缩放
  controls.autoRotate = false; //是否自动旋转
  controls.minDistance = 0.5 //设置相机距离原点的最远距离
  controls.maxDistance = 3 //设置相机距离原点的最远距离
  controls.enablePan = true   //是否开启右键拖拽
  controls.target.set(0, -0.1, 0);// 设置角度
  return controls
}


async function init() {
  const camera = initCamera()
  const renderer = initRenderer()
  const scene = initScene()
  const controls = initControls(camera,renderer)
  const { handleResize } = useResetWindow(renderer, camera);
  initLight(scene)
  await LoadModel(scene)

  setInterval(() => {
    initSprite(scene);
  }, 1000);


  function animate() {
    requestAnimationFrame(animate);

    controls.update();
    stats.update();
    render();
  }
  function render() {
    renderer.render(scene, camera);
    if(showLoading.value) showLoading.value = false 
  }

  animate();
  setTimeout(() => {
    handleResize(); 
  }, 0);
}


onMounted(() => {
  init();
});

// 详细数据弹框
const showDialog = ref(false);
</script>

<template>
  <VLoading :show-loading="showLoading" />
  <div class="demo4" v-show="!showLoading">
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
.demo4{
  width: inherit;
  height: inherit;
}
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
