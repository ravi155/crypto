import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, interval, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BtcService implements OnDestroy{

  private interval: Observable<number>;
  private btcSub$: BehaviorSubject<number> = new BehaviorSubject<number>( Math.floor((Math.random() * 9999) + 20000));
  public get BTCPrice$(): Observable<number> {
    return this.btcSub$.asObservable();
  }
  private unsubscribe$ = new Subject<void>();
  constructor() {
    this.interval = interval(1000)
      .pipe(takeUntil(this.unsubscribe$));

    this.interval.subscribe( _ => {
      const btcVal = Math.floor((Math.random() * 9999) + 20000);
      this.btcSub$.next(btcVal);
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
