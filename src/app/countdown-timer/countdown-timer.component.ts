import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit {
  originalCountdownTime: string = '00:05'; // 保存原始倒计时时间
  countdownTime: string = this.originalCountdownTime; // 当前倒计时时间
  countdownStarted: boolean = false;
  editMode: boolean = false;
  unlocked: boolean = false;
  progress: number = 0;
  warningTime: string = '00:03'; // 默认的警告倒计时时间
  warningTime2: string = '00:02'; // 第三个警告时间，橘色
  warningTime3: string = '00:01'; // 第四个警告时间，红色
  warningTimeInSeconds: number = this.getSecondsFromTime(this.warningTime);
  intervalId: any;
  normalTimeInSeconds: number = 5; // 一般计时器的持续时间（以秒为单位）
  normalTimeProgress: number = 100; // 一般计时器的进度比例（0-100）
  warningTimeProgress: number = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;; // Warning Time 计时器的进度比例（0-100）
  arrowPosition: number = -0;
  timeEnded = false;
  userInputTime: string = ''; // 用于接收用户输入的时间
  arrowAnimationEnabled: boolean = false;
  userInputWarningTime: string = '00:02'; // 用于编辑警告倒计时的输入框
  editModeWarning: boolean = false; // 是否处于编辑模式
  arrowPositionWarning: number = 0; // 箭头位置
  warningIntervalId: any; // 用于保存警告倒计时的 Interval ID 
  warningEditable: boolean = false;
  warningTimeProgress2: number = 0; // 第三个警告时间的进度
  warningTimeProgress3: number = 0; // 第四个警告时间的进度
  isCardVisible = false;
  infoVisible = false;
  warningTimerVisible = false;
  shareVisible = false;
  tags: string[] = ['#READYTOGO', '#wishmeluck', '#nervous', '#FeelingGood', '#relieved', '#tired'];
  selectedTagIndex: number = -1;
  defaultText: string = 'Share the moment';

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router) {
      this.userInputTime = this.originalCountdownTime; // 初始化为默认值
    }

  ngOnInit(): void {
      // 计算第三个警告时间的进度值
  const warningTimeInSeconds2 = this.getSecondsFromTime(this.warningTime2);
  this.warningTimeProgress2 = (warningTimeInSeconds2 / this.normalTimeInSeconds) * 100;

  // 计算第四个警告时间的进度值
  const warningTimeInSeconds3 = this.getSecondsFromTime(this.warningTime3);
  this.warningTimeProgress3 = (warningTimeInSeconds3 / this.normalTimeInSeconds) * 100;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  toggleEditModeWarning() {
    this.editModeWarning = !this.editModeWarning;
    this.editMode = false; // 关闭原始倒计时器的编辑模式
  }

  toggleWarningEdit() {
    this.warningEditable = !this.warningEditable;
  }

  applyUserInputTime() {
    // 将当前 countdownTime 设置为 originalCountdownTime
    this.originalCountdownTime = this.countdownTime;
  
    // 获取用户输入的时间并解析为秒数，然后应用到 countdownTime 和 normalTimeInSeconds
    const [minutes, seconds] = this.userInputTime.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    this.countdownTime = this.getTimeFromSeconds(totalSeconds);
    this.normalTimeInSeconds = totalSeconds;
    this.editMode = false;
    this.warningTimeProgress = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;
    if(!this.editMode) {
      this.updateProgressBar(this.normalTimeInSeconds, totalSeconds);
    }
  }
    
  // applyUserInputWarningTime() {
  //   this.warningTime = this.userInputWarningTime;
  //   this.warningTimeInSeconds = this.getSecondsFromTime(this.warningTime);
  //   this.toggleEditModeWarning();
  // }
  applyUserInputWarningTime() {
    // 获取用户输入的 Warning Timer 时间并解析为秒数，然后应用到 warningTime 和 warningTimeInSeconds
    const [minutes, seconds] = this.userInputWarningTime.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    this.warningTime = this.getTimeFromSeconds(totalSeconds);
    this.warningTimeInSeconds = totalSeconds;
    this.editModeWarning = false;
    
    this.warningTimeProgress = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;
    // 计算绿色部分的百分比
    this.updateProgressBar(this.normalTimeInSeconds, totalSeconds);
  }

  startCountdown() {
    this.countdownStarted = true;
    this.normalTimeProgress = 100;
    this.warningTimeProgress = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;
    this.countdownStarted = true;
    this.timeEnded = false; // 重置时间结束标志
    this.countdownTime = this.originalCountdownTime; // 使用原始倒计时时间
    const totalSeconds = this.getSecondsFromTime(this.countdownTime);
    let remainingSeconds = totalSeconds;
    const arrow = document.querySelector('.arrow') as HTMLElement;
    // 最开始设置 transition 为 none
    arrow.style.transition = 'none';
    this.intervalId = setInterval(() => { // 保存intervalId
      if (remainingSeconds === 0) {
        setTimeout(() => {
          arrow.style.transition = 'none';
          arrow.style.left = this.arrowPosition + '%';
        }, 2000);
      }
      if (remainingSeconds >= 0) {
        if (remainingSeconds === totalSeconds - 1) {
          console.log('123');
          arrow.style.left = this.arrowPosition + '%';
          arrow.style.transition = 'left 1s linear';
        }
  
        this.countdownTime = this.getTimeFromSeconds(remainingSeconds);
  
        // 计算箭头的位置，但限制在 99.5% 以内
        this.arrowPosition = Math.min(100 - (remainingSeconds / totalSeconds) * 100, 99.5);
  
        // 在此处设置箭头位置
        arrow.style.left = this.arrowPosition + '%';
  
        // 更新进度条
        this.updateProgressBar(remainingSeconds, totalSeconds);
  
        // 在最后一次 tick 后禁用过渡效果
        remainingSeconds--;
      } 
      else {
        clearInterval(this.intervalId); // 清除intervalId
        this.countdownStarted = false;
        this.timeEnded = true;
      }
    }, 1000);
  } 

  stopCountdown() {
    this.countdownStarted = false;
    clearInterval(this.intervalId); // 清除intervalId
    this.timeEnded = false; // 重置时间结束标志
    this.countdownTime = this.originalCountdownTime; // 重置倒计时时间
    
    // 计算停止时绿色和黄色的比例
    this.normalTimeProgress = (this.normalTimeInSeconds / this.normalTimeInSeconds) * 100;
    this.warningTimeProgress = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;
  
    // 更新进度条位置
    this.updateProgressBar(0, this.normalTimeInSeconds);
    const arrow = document.querySelector('.arrow') as HTMLElement;
    arrow.style.left = 0 + '%';
    arrow.style.transition = 'none';
  }
  

  private getSecondsFromTime(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  private getTimeFromSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  private updateProgressBar(remainingSeconds: number, totalSeconds: number) {
    this.progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  }

  showWarningTimer() {
    this.warningTimerVisible = true;
  }
  showInfo() {
    this.infoVisible = true; // 控制滑出效果
  }
  hide() {
    this.infoVisible = false; // 控制滑出效果
    this.warningTimerVisible = false;
    this.shareVisible = false;
  }
  showShare() {
    this.shareVisible = true; // 控制滑出效果
  }


  selectTag(index: number) {
    this.selectedTagIndex = index;
  }

  get selectedTagText() {
    if (this.selectedTagIndex !== -1) {
      return `Got to do a speech! ${this.tags[this.selectedTagIndex]}`;
    }
    return this.defaultText; // 如果未选择标签，返回空文本
  }
}
