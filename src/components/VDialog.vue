<template>
  <Teleport to="body" v-if="show">
    <div class="VDialog" :style="{ top, width, backgroundColor }">
      <header>
        <div class="title">{{ title }}</div>
        <div class="close" @click="onCancel">x</div>
      </header>
      <main>
        <slot>内容</slot>
      </main>
      <footer>
        <VButton @click="onCancel">取消</VButton>
        <VButton @click="onSubmit">确定</VButton>
      </footer>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import VButton from "./VButton.vue";

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "标题",
  },
  width: {
    type: String,
    default: "100px",
  },
  backgroundColor: {
    type: String,
    default: "white",
  },
  top: {
    type: String,
    default: "110px",
  },
});

function onCancel() {}
function onSubmit() {}
</script>

<style lang="scss" scoped>
$border: 1px solid rgb(188, 188, 188);
.VDialog {
  height: auto;
  position: fixed;
  z-index: 9999;
  left: 50%;
  transform: translateX(-50%);
  border: $border;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  header {
    padding: 3px 10px;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    .title {
      font-size: 18px;
    }
    .close {
      cursor: pointer;
      user-select: none;
    }
    background-color: inherit;
    -webkit-filter: brightness(120%); /* Chrome, Safari, Opera */
    filter: brightness(120%);
  }
  main {
    padding: 10px;
    border-bottom: $border;
    color: white;
  }
  footer {
    padding: 10px;
    display: flex;
    justify-content: space-evenly;
  }
}
</style>
