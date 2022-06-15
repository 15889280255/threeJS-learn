<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const routeList = router.getRoutes();

function goToPage(e: MouseEvent) {
  const liDom = e.target;
  if (liDom) {
    const path = (liDom as HTMLLIElement).getAttribute("path");
    path && router.push(path);
    if (showMenu.value) showMenu.value = !showMenu.value;
  }
}

const showMenu = ref(false);
function toggleShowMenu() {
  showMenu.value = !showMenu.value;
}
</script>

<template>
  <button class="menuBtn" @click="toggleShowMenu">菜单</button>
  <div class="drawer" v-show="showMenu">
    <ul @click="goToPage">
      <li v-for="(route, index) in routeList" :path="route.path">
        <span v-if="index >= 1">{{ index }}.</span>{{ route.name }}
      </li>
    </ul>
  </div>
  <router-view></router-view>
</template>

<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
}
.menuBtn {
  width: 100px;
  height: 30px;
  border-radius: 15px;
  background-color: #399896;
  outline: none;
  border: 3px solid white;
  position: fixed;
  top: 10px;
  right: 20px;
  z-index: 99;
  cursor: pointer;
}
.drawer {
  position: fixed;
  right: 0;
  height: 100vh;
  width: 10vw;
  background-color: rgb(0, 0, 0);
  ul {
    list-style: none;
    li {
      margin-top: 10px;
      font-size: 18px;
      cursor: pointer;
      color: white;
    }
  }
}
</style>
