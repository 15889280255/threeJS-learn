import Stats from "three/examples/jsm/libs/stats.module";
const useStats = () => {
  const stats = Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  return {
    stats, //这个函数真好用
  };
};
export default useStats;
