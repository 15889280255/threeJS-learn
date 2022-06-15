<script setup lang="ts">
import * as THREE from "three";
import { MeshBasicMaterialParameters } from "three";
import { onMounted } from "vue";

onMounted(() => {
  init();
});

function init() {
  const scene = new THREE.Scene();

  // 创建一个基本透明相机 camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1.5,
    2000
  );

  camera.position.z = 3;

  // 创建一个抗锯齿渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // 配置渲染器清除颜色
  renderer.setClearColor("#000000");

  // 配置渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 添加渲染器到Dom
  const container = document.getElementById("box");
  container && container.appendChild(renderer.domElement);

  // 创建一个立方体网格
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: "#00ffff",
    wireframe: true,
    transparent: true,
  });
  const cube = new THREE.Mesh(geometry, material);

  // 将立方体添加到网格
  scene.add(cube);

  /**创建材质的方法 */
  function createMesh(
    boxOptions: number[],
    meshPotions: MeshBasicMaterialParameters
  ) {
    const geometry = new THREE.BoxGeometry(...boxOptions);
    const material = new THREE.MeshBasicMaterial(meshPotions);
    return new THREE.Mesh(geometry, material);
  }

  const cube01 = createMesh([1, 1, 1], {
    color: "#00ffff",
    wireframe: true,
    transparent: true,
  });
  scene.add(cube01);

  const cube02 = createMesh([1, 1, 1], {
    color: "#00ffff",
    wireframe: true,
    transparent: true,
  });
  scene.add(cube02);

  const cube02_wireframe = createMesh([2, 2, 2], {
    color: "#433F81",
    wireframe: true,
    transparent: true,
  });

  scene.add(cube02_wireframe);

  const render = function () {
    requestAnimationFrame(render);
    if (Math.random() > 0.5) {
      cube.scale.x -= 0.02;
      cube.scale.y -= 0.02;
    } else {
      cube.scale.x += 0.02;
      cube.scale.y += 0.02;
    }

    cube01.rotation.x += 0.01;
    cube01.rotation.y += 0.01;

    cube02.rotation.x += 0.02;
    cube02.rotation.y += 0.02;

    cube02_wireframe.rotation.z += 0.05;

    renderer.render(scene, camera);
  };

  render();
}
</script>

<template>
  <div id="box"></div>
</template>

<style>
#box {
  width: 100%;
  height: 100%;
}
</style>
