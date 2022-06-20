import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private cashKey = 'cash';
  private btcKey = 'btc';

  private currentCash = 0;
  private currentBTC = 0;

  private myCashSub$: BehaviorSubject<number> = new BehaviorSubject<number>(this.currentCash);
  public get myCash$(): Observable<number> {
    return this.myCashSub$.asObservable();
  }

  private myBTCSub$: BehaviorSubject<number> = new BehaviorSubject<number>(this.currentBTC);
  public get myBTC$(): Observable<number> {
    return this.myBTCSub$.asObservable();
  }

  constructor() {
    const btc = localStorage.getItem(this.btcKey) || null;
    this.currentBTC = JSON.parse(btc) || 0;
    this.myBTCSub$.next( this.currentBTC );

    const cash = localStorage.getItem(this.cashKey) || null;
    this.currentCash = JSON.parse(cash) || 0;
    this.myCashSub$.next( this.currentCash );
  }

  addCash(cash: number): void {
    this.currentCash = Math.round((this.currentCash + cash) * 100) / 100;
    localStorage.setItem(this.cashKey, JSON.stringify(this.currentCash));
    this.myCashSub$.next( this.currentCash );
  }

  subtractCash(cash: number): void {
    this.currentCash = Math.round((this.currentCash - cash) * 100) / 100;
    localStorage.setItem(this.cashKey, JSON.stringify(this.currentCash));
    this.myCashSub$.next( this.currentCash );
  }

  addBTC(btc: number): void {
    this.currentBTC = Math.round((this.currentBTC + btc) * 100000) / 100000;
    localStorage.setItem(this.btcKey, JSON.stringify(this.currentBTC));
    this.myBTCSub$.next( this.currentBTC );
  }

  subtractBTC(btc: number): void {
    this.currentBTC = Math.round((this.currentBTC - btc) * 100000) / 100000;
    localStorage.setItem(this.btcKey, JSON.stringify(this.currentBTC));
    this.myBTCSub$.next( this.currentBTC );
  }
}
