import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {BtcService} from './services/btc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Crypto';
  btcPrice: number;

  public isAuthenticated = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private btcService: BtcService
  ) { }

  public ngOnInit(): void {
    this.authService.isAuthenticated$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated);

    this.btcService.BTCPrice$.subscribe( price => {
      this.btcPrice = price;
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public logout(): void {
    this.authService.logout('/').pipe(take(1)).subscribe();
  }
}
