// 全局变量：存储音频对象、播放状态、定时器
let audioInstances = []; // 存储所有正在播放的音频
let playTimer = null;    // 播放定时器（顺序/随机）
let isPlaying = false;   // 播放状态标记

// 1. 顺序播放功能
document.getElementById('play-seq').addEventListener('click', function() {
  // 先停止现有播放
  stopAllPlayback();
  
  // 顺序播放列表（可自定义顺序）
  const soundIds = [1, 2, 3, 4];
  let currentIndex = 0;
  isPlaying = true;

  // 递归播放
  function playNext() {
    if (!isPlaying || currentIndex >= soundIds.length) {
      // 播放完一轮后可选择循环：currentIndex = 0;
      return;
    }
    
    const soundId = soundIds[currentIndex];
    const soundPath = `/static/sounds/sound${soundId}.wav`;
    const audio = new Audio(soundPath);
    
    // 应用对应音量（如果有单个音量调节）
    audio.volume = (soundId === 2) ? targetSoundVolume : 1.0;
    
    // 播放完成后切换下一个
    audio.onended = function() {
      currentIndex++;
      playNext();
    };
    
    // 存储音频实例，用于停止
    audioInstances.push(audio);
    audio.play();
    
    currentIndex++;
    // 可选：添加播放间隔（比如2秒）
    playTimer = setTimeout(playNext, 2000);
  }
  
  playNext();
});

// 2. 随机播放功能
document.getElementById('play-rand').addEventListener('click', function() {
  // 先停止现有播放
  stopAllPlayback();
  
  isPlaying = true;

  function playRandom() {
    if (!isPlaying) return;
    
    // 随机选一个声音ID
    const soundId = Math.floor(Math.random() * 4) + 1;
    const soundPath = `/static/sounds/sound${soundId}.wav`;
    const audio = new Audio(soundPath);
    
    // 应用对应音量
    audio.volume = (soundId === 2) ? targetSoundVolume : 1.0;
    
    // 播放完成后继续随机
    audio.onended = function() {
      playTimer = setTimeout(playRandom, 1500); // 随机间隔1.5秒
    };
    
    audioInstances.push(audio);
    audio.play();
  }
  
  playRandom();
});

// 3. 停止播放功能（核心）
document.getElementById('stop-all').addEventListener('click', stopAllPlayback);

// 通用停止播放函数
function stopAllPlayback() {
  isPlaying = false;
  
  // 清除定时器
  if (playTimer) {
    clearTimeout(playTimer);
    playTimer = null;
  }
  
  // 停止所有正在播放的音频
  audioInstances.forEach(audio => {
    audio.pause();
    audio.currentTime = 0; // 重置播放位置
  });
  
  // 清空音频实例列表
  audioInstances = [];
}

// 原有播放函数（如果需要，添加到音频实例列表）
// 修改原有playSound函数，将音频加入实例列表：
function playSound(soundId) {
  const soundPath = `/static/sounds/sound${soundId}.wav`;
  const audio = new Audio(soundPath);
  audio.volume = (soundId === 2) ? targetSoundVolume : 1.0;
  
  // 新增：加入音频实例列表，方便停止
  audioInstances.push(audio);
  
  audio.play().catch(error => {
    console.error('播放失败：', error);
    alert(`声音${soundId}播放失败，请检查文件是否存在！`);
  });
}
