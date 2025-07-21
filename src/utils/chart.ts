import * as Chart from 'chart.js';
import { BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';
import type { ChartConfiguration, ChartType} from 'chart.js'
import {  onMounted, unref } from 'vue';
import type {Ref} from 'vue'

// 注册必要的Chart.js组件
Chart.Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale
);

// 图表配置类型
type ChartConfig = Omit<ChartConfiguration, 'type' | 'data'>;

// 创建响应式图表的组合式函数
export const useChart = (
  canvasRef: Ref<HTMLCanvasElement | null>,
  type: ChartType,
  data: ChartConfiguration['data'],
  options?: ChartConfig['options']
) => {
  let chartInstance: Chart.Chart | null = null;

  const initChart = () => {
    const canvas = unref(canvasRef);
    if (!canvas || chartInstance) return;

    // 销毁旧图表（如果存在）
    if (chartInstance) {
      chartInstance.destroy();
    }

    // 创建新图表
    chartInstance = new Chart.Chart(canvas, {
      type,
      data,
      options: {
        responsive: false, // 禁用响应式
        maintainAspectRatio: false,
        animation: {
          duration: 0 // 禁用动画
        },
        scales: {
          y: {
            beginAtZero: true // 从零开始
          }
        },
        ...options,
      },
    });
  };

  const updateChart = (newData: ChartConfiguration['data']) => {
    if (!chartInstance) return;
    chartInstance.data = newData;
    chartInstance.update();
  };

  onMounted(() => {
    initChart();
  });

  return {
    initChart,
    updateChart,
  };
};