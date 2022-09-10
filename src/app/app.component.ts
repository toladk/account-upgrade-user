import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IdleService } from './components/services/idle.service';
import { TokenService } from './authentication/services/token.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Unknown-User-Side';

  constructor(
    private idleService: IdleService,
    private tokenService: TokenService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.initialIdleSettings();
  }

  private initialIdleSettings() {
    const idleTimeoutInSeconds: number = environment.idleTimeInMinutes * 60;
    this.idleService.startWatching(idleTimeoutInSeconds).subscribe((isTimeOut: boolean) => {
      if (isTimeOut) {
          this.tokenService.logout()
          this.notification.error( 'Session', 'Session time-out, Please login !!' );
      }
    });
  }

}
