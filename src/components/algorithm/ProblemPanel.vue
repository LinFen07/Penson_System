<template>
  <div class="problem-panel">
    <el-card shadow="hover">
      <template #header>
        <div class="problem-header">
          <h3>{{ problem.title }}</h3>
          <el-tag :type="problem.difficulty === 'easy' ? 'success' : 
                         problem.difficulty === 'medium' ? 'warning' : 'danger'">
            {{ problem.difficulty }}
          </el-tag>
        </div>
      </template>
      <div class="problem-description">
        {{ problem.description }}
      </div>
      
      <div class="function-signature">
        <h4>函数签名:</h4>
        <pre>function {{ problem.functionSignature.name }}({{ problem.functionSignature.parameters }})</pre>
      </div>
    </el-card>

    <el-card shadow="hover" class="case-container">
      <template #header>
        <h3>示例</h3>
      </template>
      <div v-for="(problemCase, index) in problem.cases" :key="index" class="case-item">
        <h4>示例 {{ index + 1 }}</h4>
        <div class="case-input">
          <span class="case-label">输入：</span>
          <pre>{{ problemCase.input }}</pre>
        </div>
        <div class="case-output">
          <span class="case-label">输出：</span>
          <pre>{{ problemCase.output }}</pre>
        </div>
        <div v-if="problemCase.explanation" class="case-explanation">
          <span class="case-label">解释：</span>
          <p>{{ problemCase.explanation }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { AlgorithmProblem } from '@/types/algorithm.type'

const props = defineProps<{
  problem: AlgorithmProblem
}>()
</script>

<style scoped>
/* 样式保持不变 */
.problem-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 5px;
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.problem-description {
  line-height: 1.6;
  white-space: pre-wrap;
  font-size: 14px;
  margin: 10px 0;
}

.function-signature {
  margin: 10px 0;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.function-signature pre {
  margin: 0;
  font-family: monospace;
}

.case-container {
  flex: 1;
}

.case-item {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #ebeef5;
  font-size: 13px;
}

.case-item:last-child {
  border-bottom: none;
}

.case-label {
  font-weight: bold;
  color: #409eff;
}

.case-input,
.case-output,
.case-explanation {
  margin-top: 6px;
  line-height: 1.5;
}

.case-input pre,
.case-output pre {
  display: inline;
  background-color: #f5f7fa;
  padding: 2px 5px;
  border-radius: 3px;
}
</style>