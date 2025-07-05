<template>
  <div class="container">
    <!-- 图表 -->
    <canvas ref="chartCanvas" class="w-full h-64" />

    <!-- 动画元素 -->
    <div ref="animatedBox" class="w-16 h-16 bg-blue-500 rounded" />

    <!-- PDF 导出按钮 -->
    <button @click="exportPDF" class="mt-4 px-4 py-2 bg-green-500 text-white">
      导出 PDF
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useChart } from '@/utils/chart';
import { useAnimation } from '@/utils/animation';
import { generateTablePDF } from '@/utils/pdf';

// 图表
const chartCanvas = ref<HTMLCanvasElement | null>(null);
useChart(chartCanvas, 'bar', {
  labels: ['一月', '二月', '三月', '四月', '五月'],
  datasets: [
    {
      label: '销售额',
      data: [12, 19, 3, 5, 2],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    },
  ],
});

// 动画
const animatedBox = ref<HTMLElement | null>(null);
// const { play } = useAnimation(animatedBox, {
//   translateX: 200,
//   rotate: '1turn',
//   duration: 0,
//   easing: 'easeOutElastic(1, .5)',
// });

// PDF 导出
const exportPDF = () => {
  const data = [
    ['姓名', '年龄', '职业'],
    ['张三', 28, '工程师'],
    ['李四', 32, '设计师'],
    ['王五', 45, '产品经理'],
  ];

  generateTablePDF(data.slice(1), data[0], '员工列表.pdf');
}; 
</script>

<style>

</style>