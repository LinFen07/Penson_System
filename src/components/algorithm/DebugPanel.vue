<template>
  <div class="debug-panel">
    <!-- 调试控制按钮 -->
    <div class="debug-controls">
      <el-button 
        icon="Play" 
        size="small" 
        @click="startDebugging"
        :disabled="debugState.isDebugging"
      >
        开始调试
      </el-button>
      <el-button 
        icon="Pause" 
        size="small" 
        @click="pauseDebugging"
        :disabled="!debugState.isDebugging || debugState.isPaused"
      >
        暂停
      </el-button>
      <el-button 
        icon="SkipForward" 
        size="small" 
        @click="stepOver"
        :disabled="!debugState.isPaused"
      >
        单步跳过
      </el-button>
      <el-button 
        icon="ArrowRight" 
        size="small" 
        @click="stepInto"
        :disabled="!debugState.isPaused"
      >
        单步进入
      </el-button>
      <el-button 
        icon="ArrowLeft" 
        size="small" 
        @click="stepOut"
        :disabled="!debugState.isPaused"
      >
        单步退出
      </el-button>
      <el-button 
        icon="Stop" 
        size="small" 
        type="danger"
        @click="stopDebugging"
        :disabled="!debugState.isDebugging"
      >
        停止调试
      </el-button>
    </div>

    <!-- 调试信息展示 -->
    <div class="debug-info">
      <el-tabs v-if="debugState.isDebugging" type="border-card">
        <el-tab-pane label="变量">
          <div class="variables-panel">
            <div v-for="varItem in debugState.variables" :key="varItem.name" class="variable-item">
              <span class="var-name">{{ varItem.name }}</span>
              <span class="var-type">{{ varItem.type }}</span>
              <span class="var-value">{{ varItem.value }}</span>
            </div>
            <div v-if="debugState.variables.length === 0 && debugState.isPaused" class="empty-state">
              无可用变量（可能处于函数调用之外）
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="调用栈">
          <div class="callstack-panel">
            <div v-for="frame in debugState.callStack" :key="frame.id" class="stack-frame">
              <div class="frame-name">{{ frame.name }}</div>
              <div class="frame-location">
                {{ frame.source.name }}:{{ frame.line }}
              </div>
            </div>
            <div v-if="debugState.callStack.length === 0 && debugState.isPaused" class="empty-state">
              无调用栈信息
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="断点">
          <div class="breakpoints-panel">
            <div v-for="bp in debugState.breakpoints" :key="bp.lineNumber" class="breakpoint-item">
              <el-checkbox 
                v-model="bp.enabled" 
                @change="updateBreakpoint(bp)"
              >
                行 {{ bp.lineNumber }}
                <el-input 
                  v-if="bp.condition"
                  v-model="bp.condition"
                  size="mini"
                  placeholder="条件断点"
                  @change="updateBreakpoint(bp)"
                />
                <el-button 
                  icon="Close" 
                  size="mini" 
                  type="text"
                  @click="removeBreakpoint(bp)"
                />
              </el-checkbox>
            </div>
            <el-button 
              type="text" 
              size="small" 
              @click="addBreakpoint"
            >
              添加断点
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, defineProps, defineEmits, shallowRef } from 'vue'
import * as monaco from 'monaco-editor'
import { DebugState, Breakpoint } from '@/types/algorithm.type'

// 接收编辑器实例和代码
const props = defineProps<{
  editor: monaco.editor.IStandaloneCodeEditor | null
  code: string
}>()

// 暴露调试状态
const emit = defineEmits<{
  (e: 'debug-state-change', state: DebugState): void
}>()

// 调试状态管理
const debugState = ref<DebugState>({
  isDebugging: false,
  isPaused: false,
  currentLine: null,
  variables: [],
  callStack: [],
  breakpoints: []
})

// 调试会话和适配器
const debugSession = shallowRef<monaco.debug.IDebugSession | null>(null)
const debugAdapter = shallowRef<monaco.debug.IDebugAdapter | null>(null)

// 初始化调试适配器
const initDebugAdapter = () => {
  if (!debugAdapter.value) {
    // 确保调试服务可用
    if (!monaco.services || !monaco.services.debug) {
      console.error('Monaco调试服务未加载')
      return
    }

    // 注册调试适配器工厂
    monaco.services.debug.registerDebugAdapterDescriptorFactory('javascript', {
      createDebugAdapterDescriptor: () => {
        return {
          type: 'javascript',
          configuration: {
            type: 'javascript',
            request: 'launch',
            name: 'Debug JavaScript',
            program: props.code,
            stopOnEntry: false
          }
        }
      }
    })
    // 创建JS调试适配器（基于Monaco内置支持）
    debugAdapter.value = monaco.debug.registerDebugAdapterDescriptorFactory('javascript', {
      createAdapter: () => new monaco.debug.SyncDebugAdapter({
        // 实现调试协议方法
        async setBreakpoints(params) {
          const breakpoints: Breakpoint[] = []
          params.breakpoints.forEach(bp => {
            breakpoints.push({
              lineNumber: bp.line,
              enabled: bp.enabled,
              condition: bp.condition
            })
          })
          debugState.value.breakpoints = breakpoints
          emit('debug-state-change', { ...debugState.value })
          return { breakpoints: params.breakpoints.map(bp => ({ ...bp, verified: true })) }
        },
        async stackTrace(params) {
          // 实际项目中需要根据调试会话返回真实调用栈
          return { stackFrames: debugState.value.callStack }
        },
        async variables(params) {
          // 返回变量信息
          return { variables: debugState.value.variables }
        }
      })
    })
  }
}

// 开始调试
const startDebugging = async () => {
  if (!props.editor || debugState.value.isDebugging) return

  initDebugAdapter()
  
  // 创建调试会话
  debugSession.value = monaco.debug.startDebugging({
    type: 'javascript',
    name: 'JS Debug',
    request: 'launch',
    program: 'virtual:///debug.js', // 虚拟文件路径
    stopOnEntry: true,
    breakpoints: debugState.value.breakpoints.map(bp => ({
      line: bp.lineNumber,
      enabled: bp.enabled,
      condition: bp.condition
    }))
  })

  // 监听调试事件
  debugSession.value?.onDidChangeState(e => {
    debugState.value.isPaused = e.state === monaco.debug.DebugSessionState.Running
    debugState.value.isDebugging = e.state !== monaco.debug.DebugSessionState.Terminated
    emit('debug-state-change', { ...debugState.value })
  })

  // 监听断点命中
  debugSession.value?.onDidReceiveDebugEvent(e => {
    if (e.event === 'stopped') {
      debugState.value.isPaused = true
      debugState.value.currentLine = e.body?.line
      // 实际项目中需要从调试器获取变量和调用栈
      // 这里简化处理
      debugState.value.variables = [
        { name: 'this', value: 'Window', type: 'object', variablesReference: 1 }
      ]
      debugState.value.callStack = [
        {
          id: 1,
          name: 'twoSum',
          source: { name: 'debug.js', path: 'virtual:///debug.js' },
          line: e.body?.line || 0,
          column: 0
        }
      ]
      emit('debug-state-change', { ...debugState.value })
    }
  })

  debugState.value.isDebugging = true
  emit('debug-state-change', { ...debugState.value })
}

// 调试控制方法
const pauseDebugging = () => {
  debugSession.value?.pause()
}

const stepOver = () => {
  debugSession.value?.stepOver()
}

const stepInto = () => {
  debugSession.value?.stepInto()
}

const stepOut = () => {
  debugSession.value?.stepOut()
}

const stopDebugging = () => {
  if (debugSession.value) {
    debugSession.value.terminate()
    debugSession.value = null
  }
  debugState.value = {
    ...debugState.value,
    isDebugging: false,
    isPaused: false,
    currentLine: null
  }
  emit('debug-state-change', { ...debugState.value })
}

// 断点管理
const addBreakpoint = () => {
  if (!props.editor) return
  const cursorPos = props.editor.getPosition()
  if (cursorPos) {
    const newBp: Breakpoint = {
      lineNumber: cursorPos.lineNumber,
      enabled: true
    }
    debugState.value.breakpoints.push(newBp)
    updateBreakpoints()
  }
}

const removeBreakpoint = (bp: Breakpoint) => {
  debugState.value.breakpoints = debugState.value.breakpoints.filter(
    item => item.lineNumber !== bp.lineNumber
  )
  updateBreakpoints()
}

const updateBreakpoint = (bp: Breakpoint) => {
  updateBreakpoints()
}

const updateBreakpoints = () => {
  // 同步编辑器断点显示
  if (props.editor) {
    props.editor.deltaDecorations(
      [],
      debugState.value.breakpoints.filter(bp => bp.enabled).map(bp => ({
        range: new monaco.Range(
          bp.lineNumber, 1,
          bp.lineNumber, 1000
        ),
        options: {
          isBreakpoint: true,
          className: 'debug-breakpoint'
        }
      }))
    )
  }
  emit('debug-state-change', { ...debugState.value })
}

// 监听代码变化
watch(
  () => props.code,
  (newCode) => {
    // 代码变化时更新调试目标
    if (debugSession.value && newCode) {
      // 实际项目中需要更新虚拟文件内容
    }
  }
)

// 清理函数
onUnmounted(() => {
  if (debugSession.value) {
    debugSession.value.terminate()
  }
  if (debugAdapter.value) {
    monaco.debug.unregisterDebugAdapterDescriptorFactory('javascript')
  }
})
</script>

<style scoped>
.debug-panel {
  border-top: 1px solid #e5e7eb;
  padding: 10px;
}

.debug-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  align-items: center;
}

.debug-info {
  margin-top: 10px;
}

.variables-panel,
.callstack-panel,
.breakpoints-panel {
  padding: 5px 0;
}

.variable-item {
  padding: 4px 0;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.var-name {
  font-weight: bold;
  min-width: 100px;
}

.var-type {
  color: #666;
  font-size: 12px;
  min-width: 80px;
}

.var-value {
  color: #0d9488;
  flex: 1;
}

.stack-frame {
  padding: 6px 0;
  border-bottom: 1px solid #f5f5f5;
}

.frame-name {
  font-weight: 500;
}

.frame-location {
  font-size: 12px;
  color: #666;
}

.breakpoint-item {
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.breakpoint-item .el-input {
  width: 180px;
  margin-left: 10px;
}

.empty-state {
  color: #999;
  font-size: 12px;
  padding: 10px;
  text-align: center;
}
</style>