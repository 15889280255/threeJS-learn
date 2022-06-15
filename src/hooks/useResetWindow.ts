import { WebGLRenderer, PerspectiveCamera } from "three";
import { onMounted, onUnmounted, Ref } from "vue";

// 根据窗口大小变化，重新修改渲染器的视椎
const useResetWindow = (
  rendererRef: Ref<WebGLRenderer | undefined>,
  cameraRef: Ref<PerspectiveCamera | undefined>
) => {
  function handleResize() {
    if (!rendererRef.value || !cameraRef.value) return;
    const canvas = rendererRef.value?.domElement;
    if (canvas && cameraRef.value) {
      cameraRef.value.aspect = canvas.clientWidth / canvas.clientHeight;
      cameraRef.value.updateProjectionMatrix();
      rendererRef.value.setSize(canvas.clientWidth, canvas.clientHeight, false);
    }
    console.log("handleResize: ");
  }

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  return { handleResize };
};

export default useResetWindow;
