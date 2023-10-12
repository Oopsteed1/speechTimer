import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';

const routes: Routes = [
  { path: 'countdown-timer', component: CountdownTimerComponent },
  { path: '', redirectTo: '/countdown-timer', pathMatch: 'full' }, // 默认路由
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
