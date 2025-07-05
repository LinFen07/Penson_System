# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 代码目录
```js
src/

│

├── assets/               # 静态资源文件夹

│   ├── images/           # 图片资源

│   ├── icons/            # 图标资源

│   └── styles/           # 样式文件

│       ├── base.css      # 基础样式

│       ├── main.css      # 主样式文件

│       └── tailwind.css  # Tailwind CSS 配置文件

│

├── components/           # 组件文件夹

│   ├── common/           # 通用组件

│       ├── Button.vue    # 通用按钮组件

│       ├── Input.vue     # 通用输入框组件

│       └── Modal.vue     # 通用模态框组件

│   ├── AlgorithmSandbox/ # 算法沙盒组件

│       ├── AlgorithmVisualization.vue # 算法可视化组件

│       ├── CodeComparison.vue         # 双屏代码对比组件

│       ├── VoiceAnnotation.vue        # 语音注释组件

│       ├── AlgorithmChallenge/       # 算法闯关子组件

│       │   ├── ChallengeLevel.vue     # 关卡组件

│       │   └── MedalSystem.vue        # 勋章体系组件

│       └── AlgorithmSandboxWrapper.vue # 算法沙盒包装组件

│   ├── ProblemBoard/     # 刷题看板组件

│       ├── ProblemList.vue          # 刷题列表组件

│       ├── ErrorPaperGenerator.vue  # 错题试卷生成器组件

│       ├── KnowledgeRadar.vue       # 知识漏洞雷达图组件

│       ├── StudyCalendar.vue        # 刷题热力日历组件

│       ├── BrowserAssistant.vue     # 浏览器标签页助手组件

│       └── ProblemBoardWrapper.vue  # 刷题看板包装组件

│   ├── NoteModule/       # 笔记模块组件

│       ├── NoteEditor.vue         # 笔记编辑器组件

│       ├── NoteSearch.vue         # 笔记搜索组件

│       ├── AlgorithmCardGenerator.vue # 算法速查卡片生成器组件

│       ├── NoteCollaboration.vue    # 笔记协同编辑组件

│       └── NoteModuleWrapper.vue    # 笔记模块包装组件

│   └── GameCenter/       # 学习游戏中心组件

│       ├── GameLevel.vue        # 关卡式算法挑战组件

│       ├── AchievementSystem.vue # 成就系统组件

│       ├── Leaderboard.vue      # 学习排行榜组件

│       └── GameCenterWrapper.vue # 学习游戏中心包装组件

│

├── views/                # 视图文件夹

│   ├── AlgorithmSandboxView.vue # 算法沙盒视图

│   ├── ProblemBoardView.vue     # 刷题看板视图

│   ├── NoteModuleView.vue       # 笔记模块视图

│   └── GameCenterView.vue       # 学习游戏中心视图

│

├── router/               # 路由文件夹

│   ├── index.js          # 路由配置文件

│   └── routes.js         # 路由规则定义文件

│

├── stores/               # 状态管理文件夹

│   ├── index.js          # 状态管理配置文件

│   ├── modules/          # 状态管理模块

│       ├── algorithmSandbox.js # 算法沙盒状态模块

│       ├── problemBoard.js     # 刷题看板状态模块

│       ├── noteModule.js       # 笔记模块状态模块

│       └── gameCenter.js       # 学习游戏中心状态模块

│

├── utils/                # 工具函数文件夹

│   ├── api.js            # API 请求工具

│   ├── pdfGenerator.js   # PDF 生成工具

│   ├── voiceRecognition.js # 语音识别工具

│   ├── localStorage.js   # 本地存储工具

│   └── chartUtils.js     # 图表工具函数

│

├── plugins/              # 插件文件夹

│   ├── tailwind.js       # Tailwind CSS 插件配置

│   └── webSpeech.js      # 语音识别插件配置

│

└── App.vue               # 根组件

└── main.js               # 入口文件

```

