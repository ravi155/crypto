import {Component, OnDestroy, OnInit} from '@angular/core';
import {BtcService} from '../../services/btc.service';
import {WalletService} from '../../services/wallet.service';
import {Subject} from 'rxjs';
import {Order, OrderStatus} from '../../interfaces/order';
import {OrdersService} from '../../services/orders.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {OrderDialogComponent} from '../../components/order-dialog/order-dialog.component';
import {map, switchMap} from 'rxjs/operators';
import {SortOrdersPipe} from '../../pipes/sort-orders.pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  OrderStatus = OrderStatus;

  btcPrice$ = this.btcService.BTCPrice$;
  myCash$ = this.walletService.myCash$;
  myBtc$ = this.walletService.myBTC$;

  displayedColumns: string[] = ['type', 'transactionType', 'amount', 'limit', 'stop', 'transactionPrice', 'transactionTotal', 'status', 'action'];

  orders = this.ordersService.ordersList$
    .pipe(
      map( orders => this.orderPipe.transform(orders) )
    );

  private unsubscribe$ = new Subject<void>();
  constructor(
    private btcService: BtcService,
    private walletService: WalletService,
    private ordersService: OrdersService,
    private orderDialog: MatDialog,
    private orderPipe: SortOrdersPipe
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addCash(): void {
    this.walletService.addCash(30000);
  }

  newOrder(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};

    const dialogRef = this.orderDialog.open(OrderDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (order: Order) => {
        if (order) {
          this.ordersService.addNewOrder(order);
        }
      }
    );
  }

  removeOrder(order: Order): void {
    this.ordersService.removeOrder(order);
  }
}
