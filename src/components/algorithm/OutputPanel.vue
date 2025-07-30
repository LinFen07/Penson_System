<template>
  <div class="output-panel">
    <div class="output-header">
      <h3>运行结果</h3>
      <div class="output-actions">
        <el-button type="primary" size="small" @click="handleRunCode">运行代码</el-button>
        <el-button type="success" size="small" @click="handleRunTests">运行测试</el-button>
      </div>
    </div>
    
    <div class="output-content">
      <template v-if="testResults.length > 0">
        <div class="test-summary">
          <p>测试结果: {{ passedCount }}/{{ testResults.length }} 通过</p>
        </div>
        <div class="test-results">
          <div 
            v-for="result in testResults" 
            :key="result.caseIndex"
            :class="['test-result-item', result.passed ? 'passed' : 'failed']"
          >
            <div class="test-case-header">
              <span>示例 {{ result.caseIndex + 1 }}</span>
              <el-tag :type="result.passed ? 'success' : 'danger'">
                {{ result.passed ? '通过' : '失败' }}
              </el-tag>
            </div>
            <div class="test-details" v-if="!result.passed">
              <div class="test-detail-item">
                <span class="label">预期:</span>
                <span class="value">{{ result.expected }}</span>
              </div>
              <div class="test-detail-item" v-if="result.actual">
                <span class="label">实际:</span>
                <span class="value">{{ result.actual }}</span>
              </div>
              <div class="test-detail-item" v-if="result.error">
                <span class="label">错误:</span>
                <span class="value error">{{ result.error }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <pre>{{ output || '请运行代码或测试用例' }}</pre>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { TestResult } from '@/types/algorithm.type'

// 定义props
const props = defineProps<{
  output: string
  testResults: TestResult[]
}>()

// 定义emits
const emit = defineEmits<{
  (e: 'run-code'): void
  (e: 'run-tests'): void
}>()

// 计算通过的测试用例数量
const passedCount = computed(() => {
  return props.testResults.filter(result => result.passed).length
})

// 处理运行代码
const handleRunCode = () => {
  emit('run-code')
}

// 处理运行测试
const handleRunTests = () => {
  emit('run-tests')
}
</script>

<style scoped>
/* 样式保持不变 */
.output-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.output-actions {
  display: flex;
  gap: 5px;
}

.output-content {
  flex: 1;
  background-color: white;
  border: 1px solid #dcdfe6;
  padding: 10px;
  overflow: auto;
  border-radius: 4px;
}

.test-summary {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.test-results {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.test-result-item {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.test-result-item.passed {
  border-color: #e1f3d8;
  background-color: #f0f9eb;
}

.test-result-item.failed {
  border-color: #fde2e2;
  background-color: #fef0f0;
}

.test-case-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: bold;
}

.test-details {
  margin-top: 8px;
  font-size: 13px;
}

.test-detail-item {
  margin-bottom: 4px;
}

.label {
  color: #666;
  display: inline-block;
  width: 60px;
}

.value.error {
  color: #f56c6c;
}
</style>