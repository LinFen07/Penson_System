<template>
  <div class="font-inter bg-gray-50 text-dark min-h-screen">
    <!-- 主内容区 -->
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
      <!-- 个人资料卡片 -->
      <section id="home" class="mb-8">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="bg-gradient-to-r from-primary to-secondary h-40 relative">
            <div class="absolute inset-0 bg-black bg-opacity-20"></div>
            <div class="container mx-auto px-6 pt-10 relative z-10">
              <div class="flex flex-col md:flex-row items-center">
                <div class="flex-shrink-0 mb-4 md:mb-0">
              <img class="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg" 
                   :src="userInfo.avatar" 
                   alt="用户头像"
                   width="96"
                   height="96"
                   loading="lazy">
                </div>
                <div class="ml-0 md:ml-6 text-center md:text-left">
                  <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-white">{{ userInfo.username }}</h1>
                  <div class="flex items-center justify-center md:justify-start mt-2">
                    <span class="bg-success text-white text-xs px-3 py-1 rounded-full flex items-center">
                      <i class="fa fa-star mr-1"></i> {{ userInfo.rank }}
                    </span>
                    <span class="mx-2 text-white/80">|</span>
                    <span class="text-white/90 text-sm">积分: {{ userInfo.points }}</span>
                  </div>
                </div>
                <div class="ml-auto mt-4 md:mt-0">
                  <button class="bg-white text-primary px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transition-all transform hover:-translate-y-0.5">
                    <i class="fa fa-edit mr-1"></i> 编辑资料
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-light rounded-lg p-4 flex items-center">
                <div class="bg-primary/10 p-3 rounded-full mr-4">
                  <i class="fa fa-trophy text-primary text-xl"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">竞赛排名</p>
                  <p class="text-2xl font-bold">{{ userStats.competitionRank }}</p>
                </div>
              </div>
              <div class="bg-light rounded-lg p-4 flex items-center">
                <div class="bg-secondary/10 p-3 rounded-full mr-4">
                  <i class="fa fa-check-circle text-secondary text-xl"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">已完成挑战</p>
                  <p class="text-2xl font-bold">{{ userStats.completedChallenges }}/{{ userStats.totalChallenges }}</p>
                </div>
              </div>
              <div class="bg-light rounded-lg p-4 flex items-center">
                <div class="bg-success/10 p-3 rounded-full mr-4">
                  <i class="fa fa-medal text-success text-xl"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">获得成就</p>
                  <p class="text-2xl font-bold">{{ userStats.achievements }}/{{ userStats.totalAchievements }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 游戏闯关进度 -->
      <section id="challenges" class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">游戏闯关进度</h2>
          <a href="#" class="text-primary hover:text-primary/80 font-medium flex items-center">
            查看全部 <i class="fa fa-arrow-right ml-1 text-sm"></i>
          </a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 关卡卡片 -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1" 
               v-for="(challenge, index) in challenges" :key="index">
            <div class="relative h-40">
            <img :src="challenge.image" 
                 :alt="challenge.title" 
                 class="w-full h-full object-cover"
                 width="600"
                 height="400"
                 loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <h3 class="text-xl font-bold">{{ challenge.title }}</h3>
                <p class="text-white/80 text-sm">{{ challenge.subtitle }}</p>
              </div>
            </div>
            <div class="p-5">
              <div class="mb-3">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600">完成进度</span>
                  <span class="font-medium">{{ challenge.progress }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-value" :class="challenge.color" :style="{ width: challenge.progress + '%' }"></div>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary">{{ challenge.completed }}</div>
                  <div class="text-xs text-gray-500">已完成</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-400">{{ challenge.remaining }}</div>
                  <div class="text-xs text-gray-500">未完成</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-warning">{{ challenge.stars }}</div>
                  <div class="text-xs text-gray-500">星评级</div>
                </div>
              </div>
              <button class="w-full" :class="[challenge.buttonColor, 'text-white py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg']">
                {{ challenge.buttonText }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 竞赛参与情况 -->
      <section id="competitions" class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">近期竞赛</h2>
          <a href="#" class="text-primary hover:text-primary/80 font-medium flex items-center">
            查看全部 <i class="fa fa-arrow-right ml-1 text-sm"></i>
          </a>
        </div>
        
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-semibold mb-4">参与中的竞赛</h3>
                <div class="space-y-4">
                  <div class="border-l-4 border-primary pl-4 py-2 hover:bg-gray-50 transition-colors" 
                       v-for="(competition, index) in activeCompetitions" :key="index">
                    <h4 class="font-medium">{{ competition.title }}</h4>
                    <div class="flex items-center text-sm text-gray-500 mt-1">
                      <i class="fa fa-calendar-o mr-1"></i> {{ competition.date }}
                    </div>
                    <div class="flex items-center mt-2" v-if="competition.type === 'team'">
                      <div class="flex -space-x-2 mr-3">
                        <img v-for="(member, idx) in competition.teamMembers" :key="idx" 
                             :src="member.avatar" 
                             class="h-6 w-6 rounded-full border-2 border-white"
                             width="24"
                             height="24"
                             loading="lazy"
                             :alt="member.name">
                      </div>
                      <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">团队赛</span>
                    </div>
                    <div class="flex items-center mt-2" v-else-if="competition.remainingDays">
                      <div class="bg-warning/10 text-warning text-xs px-2 py-1 rounded-full">
                        <i class="fa fa-clock-o mr-1"></i> 剩余{{ competition.remainingDays }}天
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold mb-4">已完成的竞赛</h3>
                <div class="space-y-4">
                  <div class="border-l-4 border-success pl-4 py-2 hover:bg-gray-50 transition-colors" 
                       v-for="(competition, index) in completedCompetitions" :key="index">
                    <h4 class="font-medium">{{ competition.title }}</h4>
                    <div class="flex items-center text-sm text-gray-500 mt-1">
                      <i class="fa fa-calendar-o mr-1"></i> {{ competition.date }}
                    </div>
                    <div class="flex items-center mt-2">
                      <span class="text-success font-medium mr-2" v-if="competition.rank">
                        <i class="fa fa-trophy mr-1"></i> 第{{ competition.rank }}名
                      </span>
                      <span class="text-gray-500 font-medium mr-2" v-else>
                        <i class="fa fa-check-circle mr-1"></i> 已完成
                      </span>
                      <span class="text-xs" :class="[competition.points > 0 ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600', 'px-2 py-1 rounded-full']">
                        {{ competition.points > 0 ? '+' + competition.points + '积分' : '已完成' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 成就系统 -->
      <section id="achievements" class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">我的成就</h2>
          <a href="#" class="text-primary hover:text-primary/80 font-medium flex items-center">
            查看全部 <i class="fa fa-arrow-right ml-1 text-sm"></i>
          </a>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <!-- 成就徽章 -->
            <div class="badge" :class="[achievement.unlocked ? achievement.color + '/10' : 'bg-gray-200 badge-locked']" 
                 v-for="(achievement, index) in achievements" :key="index">
              <div class="badge-icon" :class="[achievement.unlocked ? achievement.color : 'text-gray-400']">
                <i :class="achievement.icon"></i>
              </div>
              <div class="badge-tooltip">{{ achievement.tooltip }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据分析 -->
      <section class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">数据统计</h2>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm bg-primary text-white rounded-md">周</button>
            <button class="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors">月</button>
            <button class="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors">年</button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4">游戏活跃度</h3>
            <div class="h-80">
              <canvas id="activityChart"></canvas>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4">竞赛表现</h3>
            <div class="h-80">
              <canvas id="performanceChart"></canvas>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="bg-dark text-white py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">GameArena</h3>
            <p class="text-gray-400 text-sm">打造专业的游戏竞赛平台，让每一位玩家都能展现自己的实力。</p>
            <div class="flex space-x-4 mt-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fa fa-facebook"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fa fa-twitter"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fa fa-instagram"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fa fa-youtube-play"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">快速链接</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">首页</a></li>
              <li><a href="#" class="hover:text-white transition-colors">游戏中心</a></li>
              <li><a href="#" class="hover:text-white transition-colors">竞赛日历</a></li>
              <li><a href="#" class="hover:text-white transition-colors">排行榜</a></li>
              <li><a href="#" class="hover:text-white transition-colors">帮助中心</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">游戏分类</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">动作游戏</a></li>
              <li><a href="#" class="hover:text-white transition-colors">策略游戏</a></li>
              <li><a href="#" class="hover:text-white transition-colors">角色扮演</a></li>
              <li><a href="#" class="hover:text-white transition-colors">休闲益智</a></li>
              <li><a href="#" class="hover:text-white transition-colors">多人竞技</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">联系我们</h4>
            <ul class="space-y-2 text-gray-400">
              <li class="flex items-center">
                <i class="fa fa-map-marker w-5"></i>
                <span>北京市海淀区中关村科技园区</span>
              </li>
              <li class="flex items-center">
                <i class="fa fa-phone w-5"></i>
                <span>+86 10 8888 8888</span>
              </li>
              <li class="flex items-center">
                <i class="fa fa-envelope w-5"></i>
                <span>contact@gamearena.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2025 GameArena. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'App',
  setup() {
    // 用户信息
    const userInfo = ref({
      username: '玩家12345',
      avatar: 'https://picsum.photos/id/237/200/200',
      rank: '钻石段位',
      points: '12,540'
    });
    
    // 用户统计信息
    const userStats = ref({
      competitionRank: '24/1,587',
      completedChallenges: 87,
      totalChallenges: 120,
      achievements: 32,
      totalAchievements: 50
    });
    
    // 游戏关卡数据
    const challenges = ref([
      {
        title: '冒险世界',
        subtitle: '第1章：森林探险',
        image: 'https://picsum.photos/id/1/600/400',
        progress: 75,
        color: 'bg-primary',
        completed: 5,
        remaining: 2,
        stars: 3,
        buttonText: '继续挑战',
        buttonColor: 'bg-primary'
      },
      {
        title: '竞技挑战',
        subtitle: '第3季：极限对决',
        image: 'https://picsum.photos/id/2/600/400',
        progress: 40,
        color: 'bg-secondary',
        completed: 4,
        remaining: 6,
        stars: 2,
        buttonText: '开始挑战',
        buttonColor: 'bg-secondary'
      }
    ]);
    
    // 进行中的竞赛
    const activeCompetitions = ref([
      {
        title: '全球游戏开发者大赛',
        date: '2025-06-15 至 2025-07-30',
        type: 'team',
        teamMembers: [
          { name: '队友1', avatar: 'https://picsum.photos/id/1001/100/100' },
          { name: '队友2', avatar: 'https://picsum.photos/id/1002/100/100' },
          { name: '队友3', avatar: 'https://picsum.photos/id/1003/100/100' }
        ]
      },
      {
        title: '算法挑战赛',
        date: '2025-06-20 至 2025-06-25',
        remainingDays: 2
      }
    ]);
    
    // 已完成的竞赛
    const completedCompetitions = ref([
      {
        title: '春季编程马拉松',
        date: '2025-03-10 至 2025-03-12',
        rank: 2,
        points: 1200
      },
      {
        title: '新手训练营',
        date: '2025-02-05 至 2025-02-15',
        points: 500
      }
    ]);
    
    // 成就系统
    const achievements = ref([
      { unlocked: true, icon: 'fa fa-bolt', color: 'text-primary', tooltip: '闪电手：在30秒内完成10道题' },
      { unlocked: true, icon: 'fa fa-shield', color: 'text-secondary', tooltip: '不败神话：连续赢得20场比赛' },
      { unlocked: true, icon: 'fa fa-crown', color: 'text-success', tooltip: '王者之冠：获得钻石段位' },
      { unlocked: true, icon: 'fa fa-lightbulb-o', color: 'text-warning', tooltip: '创意之星：设计独特游戏关卡' },
      { unlocked: false, icon: 'fa fa-lock', tooltip: '未解成就：连续30天登录游戏' },
      { unlocked: false, icon: 'fa fa-lock', tooltip: '未解成就：通关所有困难模式' },
      { unlocked: true, icon: 'fa fa-users', color: 'text-primary', tooltip: '团队领袖：带领团队赢得比赛' },
      { unlocked: false, icon: 'fa fa-lock', tooltip: '未解成就：累计获得100,000积分' },
      { unlocked: true, icon: 'fa fa-trophy', color: 'text-success', tooltip: '竞赛大师：赢得5场官方竞赛' },
      { unlocked: false, icon: 'fa fa-lock', tooltip: '未解成就：破解隐藏关卡' }
    ]);
    
    // 初始化图表
    onMounted(() => {
      // 游戏活跃度图表
      const activityCtx = document.getElementById('activityChart').getContext('2d');
      new Chart(activityCtx, {
        type: 'line',
        data: {
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          datasets: [{
            label: '游戏时长(小时)',
            data: [2.5, 1.8, 3.2, 2.1, 4.5, 6.2, 5.1],
            borderColor: '#165DFF',
            backgroundColor: 'rgba(22, 93, 255, 0.1)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });

      // 竞赛表现图表
      const performanceCtx = document.getElementById('performanceChart').getContext('2d');
      new Chart(performanceCtx, {
        type: 'bar',
        data: {
          labels: ['竞赛1', '竞赛2', '竞赛3', '竞赛4', '竞赛5'],
          datasets: [{
            label: '排名',
            data: [5, 2, 8, 1, 3],
            backgroundColor: [
              'rgba(22, 93, 255, 0.7)',
              'rgba(114, 46, 209, 0.7)',
              'rgba(0, 180, 42, 0.7)',
              'rgba(255, 125, 0, 0.7)',
              'rgba(245, 63, 63, 0.7)'
            ],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              reverse: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    });
    
    return {
      userInfo,
      userStats,
      challenges,
      activeCompetitions,
      completedCompetitions,
      achievements
    };
  }
}
</script>

