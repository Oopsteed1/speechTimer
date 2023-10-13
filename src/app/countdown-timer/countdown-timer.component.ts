import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit {
  originalCountdownTime: string = '00:05';
  countdownTime: string = this.originalCountdownTime;
  countdownStarted: boolean = false;
  editMode: boolean = false;
  unlocked: boolean = false;
  progress: number = 0;
  warningTime: string = '00:03';
  warningTime2: string = '00:02';
  warningTime3: string = '00:01';
  warningTimeInSeconds: number = this.getSecondsFromTime(this.warningTime);
  intervalId: any;
  normalTimeInSeconds: number = 5;
  normalTimeProgress: number = 100;
  warningTimeProgress: number = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;;
  arrowPosition: number = -0;
  timeEnded = false;
  userInputTime: string = '';
  arrowAnimationEnabled: boolean = false;
  userInputWarningTime: string = '00:02';
  editModeWarning: boolean = false;
  arrowPositionWarning: number = 0;
  warningIntervalId: any;
  warningEditable: boolean = false;
  warningTimeProgress2: number = 0;
  warningTimeProgress3: number = 0;
  isCardVisible = false;
  infoVisible = false;
  warningTimerVisible = false;
  shareVisible = false;
  settingVisible = false;
  soundOption: string = 'enabled';
  timeFormatOption: string = 'default'
  tags: string[] = ['#READYTOGO', '#wishmeluck', '#nervous', '#FeelingGood', '#relieved', '#tired'];
  selectedTagIndex: number = -1;
  defaultText: string = 'Share the moment';
  showTimeline: boolean = true;
  countMode: boolean = false;
  overtimeTime: number = 0;
  showOvertime: boolean = false;
  overtimeTimeInSeconds = 0;
  paused: boolean = false;
  countModeTime: number = 0;
  overtimeSeconds: number = 0;
  pausedSeconds: number = 0;
  isCountdownRunning: boolean = false;
  totalSeconds = this.getSecondsFromTime(this.countdownTime);
  remainingSeconds = this.totalSeconds;
  pausedArrowPosition: number = 0;
  tagSelected: boolean = false;
  isDefaultText: boolean = false;
  warningTimeVisible = true;
  editingHours: number = 0;
  editingMinutes: number = 0;
  editingSeconds: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private ngZone: NgZone) {
      this.userInputTime = this.originalCountdownTime;
      this.isDefaultText = true;
    }

  ngOnInit(): void {
  const warningTimeInSeconds2 = this.getSecondsFromTime(this.warningTime2);
  this.warningTimeProgress2 = (warningTimeInSeconds2 / this.normalTimeInSeconds) * 100;
  const warningTimeInSeconds3 = this.getSecondsFromTime(this.warningTime3);
  this.warningTimeProgress3 = (warningTimeInSeconds3 / this.normalTimeInSeconds) * 100;
  } 

  applyUserInputTime() {
    this.originalCountdownTime = this.countdownTime;
    
    // 计算总秒数
    const totalSeconds =
      this.editingHours * 3600 +
      this.editingMinutes * 60 +
      this.editingSeconds;
    
    // 使用字符串插值格式化时间
    this.countdownTime = `${String(this.editingHours).padStart(2, '0')}:${String(this.editingMinutes).padStart(2, '0')}:${String(this.editingSeconds).padStart(2, '0')}`;
    this.normalTimeInSeconds = totalSeconds;
    this.warningTimeProgress = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;
  
    // 手动触发变更检测
    this.cdr.detectChanges();
  
    if (!this.editMode) {
      this.updateProgressBar(this.normalTimeInSeconds, totalSeconds);
    }
  }

  // 新增函数以增加小时
  increaseEditingHours() {
    this.editingHours++;
  }

  // 新增函数以减少小时
  decreaseEditingHours() {
    if (this.editingHours > 0) {
      this.editingHours--;
    }
  }

  // 新增函数以增加分钟
  increaseEditingMinutes() {
    this.editingMinutes++;
  }

  // 新增函数以减少分钟
  decreaseEditingMinutes() {
    if (this.editingMinutes > 0) {
      this.editingMinutes--;
    }
  }

  // 新增函数以增加秒数
  increaseEditingSeconds() {
    this.editingSeconds++;
  }

  // 新增函数以减少秒数
  decreaseEditingSeconds() {
    if (this.editingSeconds > 0) {
      this.editingSeconds--;
    }
  }
  resetEditingTime() {
    this.editingHours = 0;
    this.editingMinutes = 0;
    this.editingSeconds = 0;
    this.applyUserInputTime();
  }
  
  // 增加指定分钟数
  increase5Minutes(minutesToAdd: number) {
    this.editingMinutes += minutesToAdd;
    this.applyUserInputTime();
  }
  
  // 增加指定秒数
  increase15Seconds(secondsToAdd: number) {
    this.editingSeconds += secondsToAdd;
    this.applyUserInputTime();
  }


  applyUserInputWarningTime() {
    const [minutes, seconds] = this.userInputWarningTime.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    this.warningTime = this.getTimeFromSeconds(totalSeconds);
    this.warningTimeInSeconds = totalSeconds;
    this.editModeWarning = false;
    
    this.warningTimeProgress = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;
    this.updateProgressBar(this.normalTimeInSeconds, totalSeconds);
  }

  startCountdown() {
    this.warningTimeVisible = false;
    const arrow = document.querySelector('.arrow') as HTMLElement;
    let arrowPosition = 0;
    if (this.pausedArrowPosition !== null) {
      arrowPosition = this.pausedArrowPosition;
    }
    arrow.style.left = arrowPosition + '%';
    arrow.style.transition = 'none';
  
    let totalSeconds = this.normalTimeInSeconds;
    let remainingSeconds = totalSeconds;
    let overtimeSeconds = 0;
    let countModeTime = 0;
  
    // 使用原始格式的时间
    this.countdownTime = this.originalCountdownTime;
  
    const endTimeFormat = this.getTimeBasedOnTimeFormatWithHours(totalSeconds);
  
    this.intervalId = setInterval(() => {
      if (!this.countdownStarted) {
        clearInterval(this.intervalId);
        return;
      }
  
      if (remainingSeconds === 0) {
        setTimeout(() => {
          arrow.style.transition = 'none';
          if (this.showOvertime) {
            arrow.style.left = '99.5%';
            if (this.countMode) {
              countModeTime = 0;
            }
            remainingSeconds = totalSeconds;
            if (this.showOvertime && this.countMode) {
              countModeTime++;
            } else {
              overtimeSeconds++;
            }
          }
        }, 2000);
      }
      if (remainingSeconds >= 0) {
        if (remainingSeconds === totalSeconds - 1) {
          if (!this.showOvertime) {
            arrow.style.transition = 'left 1s linear';
          }
        }
        arrowPosition = Math.min(100 - (remainingSeconds / totalSeconds) * 100, 99.5);
        arrow.style.left = arrowPosition + '%';
  
        let countdownTimeDisplay = '';
  
        if (this.showOvertime && remainingSeconds === 0) {
          countdownTimeDisplay = this.getTimeBasedOnTimeFormatWithHours(overtimeSeconds);
          if (this.showOvertime && this.countMode) {
            countModeTime++;
          }
          if (this.showOvertime) {
            remainingSeconds = totalSeconds;
          }
        } else if (this.countMode) {
          countdownTimeDisplay = this.getTimeBasedOnTimeFormatWithHours(countModeTime);
          if (this.showOvertime && !this.countMode) {
            remainingSeconds = totalSeconds;
            arrow.style.left = arrowPosition + '%';
          }
          countModeTime++;
        } else {
          countdownTimeDisplay = this.getTimeBasedOnTimeFormatWithHours(remainingSeconds);
        }
  
        this.countdownTime = countdownTimeDisplay;
        this.updateProgressBar(remainingSeconds, totalSeconds);
        remainingSeconds--;
      } else {
        clearInterval(this.intervalId);
        this.countdownStarted = false;
        this.timeEnded = true;
        this.countdownTime = endTimeFormat;
        this.countModeTime = 0;
        this.overtimeSeconds = 0;
      }
    }, 1000);
  }
  

  getTimeBasedOnTimeFormatWithHours(seconds: number): string {
    const showMinutesOnly = this.timeFormatOption === 'minutes';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    if (showMinutesOnly) {
      return `${String((hours * 60 + minutes)).padStart(2, '0')} minutes`;
    } else if (this.timeFormatOption === 'seconds') {
      return seconds + ' seconds';
    } else {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
  }
  
  
  
  stopCountdown() {
    this.countdownStarted = false;
    this.warningTimeVisible = true;
    clearInterval(this.intervalId);
    this.timeEnded = false;
    this.countdownTime = this.originalCountdownTime;
    this.normalTimeProgress = (this.normalTimeInSeconds / this.normalTimeInSeconds) * 100;
    this.warningTimeProgress = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;
    this.updateProgressBar(0, this.normalTimeInSeconds);
    const arrow = document.querySelector('.arrow') as HTMLElement;
    arrow.style.left = 0 + '%';
    arrow.style.transition = 'none';
  }
  
  pauseCountdown() {
    if (this.countdownStarted) {
      this.countdownStarted = false;
      this.pausedArrowPosition = this.arrowPosition;
    }
  }

  resumeCountdown() {
    if (!this.countdownStarted) {
      this.countdownStarted = true;
      this.startCountdown();
    }
  }

  navigateToRateUs() {
    window.open('https://apps.apple.com/tw/app/演講和演示計時器/id979433325', '_blank');
  }

  navigateToMoreApps() {
    window.open('https://apps.apple.com/tw/developer/senzillo-inc/id979433324', '_blank');
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
    this.infoVisible = true;
  }
  hide() {
    this.infoVisible = false;
    this.warningTimerVisible = false;
    this.shareVisible = false;
    this.settingVisible = false;
    this.selectedTagIndex = -1;
    this.tagSelected = false;
    this.warningTimeVisible = true;
    this.showTimeline = true;
    this.progress
    if (this.editMode) {
      this.applyUserInputTime(); // 将编辑的时间应用于倒计时时间
    }
  
    this.editMode = false; // 确保退出编辑模式
  
    // 如果需要，可以在此处添加其他逻辑
  
    // 更新倒计时进度条和其他相关信息
    this.updateProgressBar(this.normalTimeInSeconds, this.normalTimeInSeconds);
  
    this.ngZone.run(() => {
      this.isDefaultText = true;
    });
    
  }
  
  showShare() {
    this.shareVisible = true;
  }

  selectTag(index: number) {
    this.selectedTagIndex = index;
    this.isDefaultText = false;
    this.tagSelected = true;
  }
  
  get selectedTagText() {
    if (this.selectedTagIndex === -1) {
      this.isDefaultText = true;
      return this.defaultText;
    } else {
      const selectedTag = this.tags[this.selectedTagIndex];
      if (selectedTag === '#READYTOGO' || selectedTag === '#wishmeluck' || selectedTag === '#nervous') {
        return `Got to do a speech! ${selectedTag}`;
      } else if (selectedTag === '#FeelingGood' || selectedTag === '#relieved' || selectedTag === '#tired') {
        return `Finished a speech! ${selectedTag}`;
      } else {
        return selectedTag;
      }
    }
  }

  showSetting() {
    this.settingVisible = true;
  }

  shareSpeech() {
    if (navigator.share) {
      navigator.share({
        url: 'https://itunes.apple.com/app/id979433325'
      })
      .then(() => console.log('Shared successfully.'))
    }
  }
  
  toggleSoundOption() {
    if (this.soundOption === 'enabled') {
      this.soundOption = 'disabled';
    } else if (this.soundOption === 'disabled') {
      this.soundOption = 'chimes only';
    } else {
      this.soundOption = 'enabled';
    }
  }
  
  toggleTimeFormatOption() {
    switch (this.timeFormatOption) {
      case 'default':
        this.timeFormatOption = 'minutes';
        break;
      case 'minutes':
        this.timeFormatOption = 'seconds';
        break;
      case 'seconds':
        this.timeFormatOption = 'default';
        break;
      default:
        this.timeFormatOption = 'default';
    }
  }
  

  toggleTimeline() {
    this.showTimeline = !this.showTimeline;
    this.cdr.detectChanges();
  }

  toggleCountMode() {
    this.countMode = !this.countMode;
    this.cdr.detectChanges();
  }

  toggleOvertime() {
    this.showOvertime = !this.showOvertime;
    this.cdr.detectChanges();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.warningTimeVisible = false;
    this.showTimeline = false;
    if (this.editMode) {
      // 进入编辑模式时，将编辑属性设置为 countdownTime 的值
      const [hours, minutes, seconds] = this.countdownTime.split(':').map(Number);
      this.editingHours = hours || 0; // 如果没有小时，则默认为0
      this.editingMinutes = minutes || 0; // 如果没有分钟，则默认为0
      this.editingSeconds = seconds || 0; // 如果没有秒，则默认为0
    }
    
  }
  

  toggleEditModeWarning() {
    this.editModeWarning = !this.editModeWarning;
    this.editMode = false;
  }

  toggleWarningEdit() {
    this.warningEditable = !this.warningEditable;
  }

  toggleCountdown() {
    if (this.isCountdownRunning) {
      this.pauseCountdown();
      this.isCountdownRunning = false;
    } else {
      this.resumeCountdown();
      this.isCountdownRunning = true;
    }
  }
}
