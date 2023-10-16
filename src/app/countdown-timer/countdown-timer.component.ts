import { Component, OnInit, ChangeDetectorRef, NgZone, Renderer2, ElementRef } from '@angular/core';
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
  paused: boolean = true;
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
  editingWarningHours: number = 0;
  editingWarningMinutes: number = 0;
  editingWarningSeconds: number = 0;
  showButtons = true;
  showHours = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,) {
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
    const totalSeconds =
      this.editingHours * 3600 +
      this.editingMinutes * 60 +
      this.editingSeconds;
      
    if (this.editingHours > 0) {
        this.showHours = true
    }
    this.countdownTime = this.getTimeFromSeconds(totalSeconds);
    this.normalTimeInSeconds = totalSeconds;
    this.warningTimeProgress = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;
    if (!this.editMode) {
      this.updateProgressBar(this.normalTimeInSeconds, totalSeconds);
    }
  }
  
  applyUserInputWarningTime() {
    if (this.editModeWarning) {
      const [minutes, seconds] = this.userInputWarningTime.split(':').map(Number);
      const totalSeconds =       
      this.editingWarningHours * 3600 +
      this.editingWarningMinutes * 60 +
      this.editingWarningSeconds;
      
      if (this.editingWarningHours > 0) {
        this.showHours = true
      }
      this.warningTime = this.getTimeFromSeconds(totalSeconds);
      this.warningTimeInSeconds = totalSeconds;
      this.warningTimeProgress = (this.warningTimeInSeconds / this.normalTimeInSeconds) * 100;
      this.updateProgressBar(this.normalTimeInSeconds, totalSeconds);
    }
  }
  increaseEditingHours() {
    this.editingHours++;
    if (this.editingHours > 0) {
      this.showHours = true
    }
    this.cdr.detectChanges(); 
  }

  decreaseEditingHours() {
  if (this.editingHours > 0) {
    this.editingHours--;
    this.showHours = true
  }
  this.cdr.detectChanges(); 
}

  increaseEditingMinutes() {
    this.editingMinutes++;
  }

  decreaseEditingMinutes() {
    if (this.editingMinutes > 0) {
      this.editingMinutes--;
    }
  }

  increaseEditingSeconds() {
    this.editingSeconds++;
  }

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
  
  increase5Minutes(minutesToAdd: number) {
    this.editingMinutes += minutesToAdd;
    this.applyUserInputTime();
  }

  increase15Seconds(secondsToAdd: number) {
    this.editingSeconds += secondsToAdd;
    this.applyUserInputTime();
  }


  increaseEditingWarningHours() {
    this.editingWarningHours++;
    if (this.editingWarningHours > 0) {
      this.showHours = true
    }
    this.cdr.detectChanges(); 
  }

  decreaseEditingWarningHours() {
    if (this.editingWarningHours > 0) {
      this.editingWarningHours--;
      this.showHours = true
    }
    this.cdr.detectChanges(); 
  }

  increaseEditingWarningMinutes() {
    this.editingWarningMinutes++;
  }

  decreaseEditingWarningMinutes() {
    if (this.editingWarningMinutes > 0) {
      this.editingWarningMinutes--;
    }
  }

  increaseEditingWarningSeconds() {
    this.editingWarningSeconds++;
  }

  decreaseEditingWarningSeconds() {
    if (this.editingWarningSeconds > 0) {
      this.editingWarningSeconds--;
    }
  }

  resetEditingWarningTime() {
    this.editingWarningHours = 0;
    this.editingWarningMinutes = 0;
    this.editingWarningSeconds = 0;
    this.applyUserInputWarningTime();
  }

  increaseWarning5Minutes(minutesToAdd: number) {
    this.editingWarningMinutes += minutesToAdd;
    this.applyUserInputWarningTime();
  }

  increaseWarning15Seconds(secondsToAdd: number) {
    this.editingWarningSeconds += secondsToAdd;
    this.applyUserInputWarningTime();
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
    let countdownFromOvertime = false;

    this.countdownTime = this.originalCountdownTime;
    const endTimeFormat = this.getTimeBasedOnTimeFormatWithHours(totalSeconds);

    this.intervalId = setInterval(() => {
      if (!this.countdownStarted) {
        clearInterval(this.intervalId);
        return;
      }
      if (remainingSeconds === 0) {
        if (this.showOvertime) {
          countdownFromOvertime = true;
          arrow.style.transition = 'left 1s linear';
        } else {
          clearInterval(this.intervalId);
          this.countdownStarted = false;
        }
        arrow.style.left = '99.5%';
        overtimeSeconds = 0;
      }

      if (remainingSeconds >= 0) {
        if (!countdownFromOvertime) {
          if (remainingSeconds === totalSeconds - 1) {
            arrow.style.transition = 'left 1s linear';
          }
          arrowPosition = Math.min(100 - (remainingSeconds / totalSeconds) * 100, 99.5);
          arrow.style.left = arrowPosition + '%';
        }

        let countdownTimeDisplay = '';

        if (countdownFromOvertime) {
          countdownTimeDisplay = this.getTimeBasedOnTimeFormatWithHours(overtimeSeconds);
          if (this.showOvertime && this.countMode) {
            countModeTime++;
          }
          if (this.showOvertime) {
            remainingSeconds = totalSeconds;
          }
          overtimeSeconds++;
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
    this.isCountdownRunning = false;
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    } else {
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
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
    this.showButtons = true;
    if (this.editMode) {
      this.applyUserInputTime();
      this.editMode = false;
    }
  
    if (this.editModeWarning) {
      this.applyUserInputWarningTime();
      this.editModeWarning = false;
    }
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
      const [hours, minutes, seconds] = this.countdownTime.split(':').map(Number);
      this.editingHours = hours || 0;
      this.editingMinutes = minutes || 0; 
      this.editingSeconds = seconds || 0;
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
