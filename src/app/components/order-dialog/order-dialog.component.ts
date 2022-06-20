import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Order, OrderStatus, OrderTransactionType, OrderType} from '../../interfaces/order';
import {Subject} from 'rxjs';
import {WalletService} from '../../services/wallet.service';
import {BtcService} from '../../services/btc.service';
import {takeUntil} from 'rxjs/operators';
import {OrdersService} from '../../services/orders.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent implements OnInit, OnDestroy {

  userCash: number;
  btcVal: number;

  canBuy: any;

  OrderTransactionType = OrderTransactionType;
  OrderType = OrderType;

  order: Order;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<OrderDialogComponent>,
    private walletService: WalletService,
    private btcService: BtcService,
    private orderService: OrdersService,
    @Inject(MAT_DIALOG_DATA) data) {
      this.order = {
        transactionType: OrderTransactionType.BUY,
        type: OrderType.MARKET,
        status: OrderStatus.OPEN
      };
  }

  ngOnInit(): void {

    this.walletService.myCash$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(cash => {
        this.userCash = cash;
      });

    this.btcService.BTCPrice$
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe( btc => {
          this.btcVal = btc;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  placeOrder(): void {
    if (this.order.type === OrderType.STOP_LIMIT) {
      this.order.status = OrderStatus.STOP;
    }

    this.dialogRef.close(this.order);
  }

  close(): void {
    this.dialogRef.close();
  }

  isDisabled(): boolean {
    switch (this.order.transactionType) {
      case OrderTransactionType.BUY:
        return this.order.amount <= 0 || !this.orderService.canBuy(this.order);
        break;
      case OrderTransactionType.SELL:
        return this.order.amount <= 0 || !this.orderService.canSell(this.order);
        break;
    }
  }
}
