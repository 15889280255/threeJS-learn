import { WebGLRenderer, PerspectiveCamera } from "three";
import { onMounted, onUnmounted, Ref } from "vue";

// 根据窗口大小变化，重新修改渲染器的视椎
const useResetWindow = (
  rendererRef: WebGLRenderer,
  cameraRef: PerspectiveCamera
) => {
  function handleResize() {
    if (!rendererRef || !cameraRef) return;
    const canvas = rendererRef?.domElement;
    if (canvas && cameraRef) {
      cameraRef.aspect = canvas.clientWidth / canvas.clientHeight;
      cameraRef.updateProjectionMatrix();
      rendererRef.setSize(canvas.clientWidth, canvas.clientHeight, false);
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
