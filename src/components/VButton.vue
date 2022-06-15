<template>
  <button class="VButton" v-bind="$attrs"><slot>按钮</slot></button>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.VButton {
  background-color: rgb(3, 116, 255);
  padding: 4px 5px;
  border-radius: 5px;
  border: 1px solid white;
  color: white;
  cursor: pointer;
}
</style>
