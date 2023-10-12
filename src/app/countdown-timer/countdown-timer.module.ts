import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CountdownTimerComponent } from './countdown-timer.component';



@NgModule({
  declarations: [
    CountdownTimerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
  ],
  exports: [CountdownTimerComponent],
})
export class CountdownTimerModule { }
