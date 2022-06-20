import {Injectable} from '@angular/core';
import {Order, OrderStatus, OrderTransactionType, OrderType} from '../interfaces/order';
import {WalletService} from './wallet.service';
import {BtcService} from './btc.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private ordersKey = 'orders';

  private userCash: number;
  private userBtc: number;
  private btcVal: number;

  private orders: Order[];

  private ordersSub$: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  public get ordersList$(): Observable<Order[]> {
    return this.ordersSub$.asObservable();
  }

  constructor(
    private walletService: WalletService,
    private btcService: BtcService
  ) {

    const orders = localStorage.getItem(this.ordersKey) || null;
    this.orders = JSON.parse(orders) || [];
    this.ordersSub$.next(this.orders);

    this.walletService.myCash$
      .subscribe(cash => {
        this.userCash = cash;
      });

    this.walletService.myBTC$
      .subscribe(btc => {
        this.userBtc = btc;
      });

    this.btcService.BTCPrice$
      .subscribe(btc => {
        this.btcVal = btc;

        const stopOrders = this.orders.filter( order => order.status === OrderStatus.STOP && order.type === OrderType.STOP_LIMIT);
        stopOrders.forEach( order => this.executeOrder(order));

        const openOrders = this.orders.filter( order => order.status === OrderStatus.OPEN);
        openOrders.forEach( order => this.executeOrder(order));

        localStorage.setItem(this.ordersKey, JSON.stringify(this.orders));
        this.ordersSub$.next(this.orders);
      });
  }

  addNewOrder(order: Order): void {
    this.executeOrder(order);

    this.orders.unshift(order);
    this.ordersSub$.next(this.orders);

    localStorage.setItem(this.ordersKey, JSON.stringify(this.orders));
  }

  executeOrder(order: Order): Order {
    switch (order.type) {
      case OrderType.MARKET:

        switch (order.transactionType) {
          case OrderTransactionType.BUY:
            this.doBuy(order);
            return order;
            break;
          case OrderTransactionType.SELL:
            this.doSell(order);
            return order;
            break;
        }
        break;

      case OrderType.LIMIT:

        switch (order.transactionType) {
          case OrderTransactionType.BUY:
            if (this.btcVal <= order.limit) {
              this.doBuy(order);
            }
            break;
          case OrderTransactionType.SELL:
            if (this.btcVal >= order.limit) {
              this.doSell(order);
            }
            break;
        }
        return order;
        break;
      case OrderType.STOP_LIMIT:

        switch (order.transactionType) {
          case OrderTransactionType.BUY:
            if (order.status === OrderStatus.STOP) {
              if (this.btcVal >= order.stop) {
                order.status = OrderStatus.OPEN;
              }
            } else if (order.status === OrderStatus.OPEN) {
              if (this.btcVal <= order.limit) {
                this.doBuy(order);
              }
            }
            break;
          case OrderTransactionType.SELL:
            if (order.status === OrderStatus.STOP) {
              if (this.btcVal <= order.stop) {
                order.status = OrderStatus.OPEN;
              }
            } else if (order.status === OrderStatus.OPEN) {
              if (this.btcVal >= order.limit) {
                this.doSell(order);
              }
            }
            break;
        }

        return order;
        break;
    }
  }

  doBuy(order: Order): void {
    if (this.canBuy(order)) {
      const btcVal = this.btcVal;
      this.walletService.subtractCash(order.amount * btcVal);
      this.walletService.addBTC(order.amount);
      order.status = OrderStatus.CLOSED;
      order.transactionTotal = Math.round((order.amount * btcVal) * 100) / 100;
      order.transactionPrice = btcVal;
    } else {
      order.status = OrderStatus.ERROR;
    }
  }

  doSell(order: Order): void {
    if (this.canSell(order)) {
      const btcVal = this.btcVal;
      this.walletService.subtractBTC(order.amount);
      this.walletService.addCash(order.amount * btcVal);
      order.status = OrderStatus.CLOSED;
      order.transactionTotal = Math.round((order.amount * btcVal) * 100) / 100;
      order.transactionPrice = btcVal;
    } else {
      order.status = OrderStatus.ERROR;
    }
  }

  canBuy(order: Order): boolean {
    switch (order.type) {
      case OrderType.MARKET:
        return this.userCash > order.amount * this.btcVal;
        break;
      case OrderType.LIMIT:
      case OrderType.STOP_LIMIT:
        return this.userCash > order.amount * order.limit;
        break;
    }
  }

  canSell(order: Order): boolean {
    switch (order.type) {
      case OrderType.MARKET:
      case OrderType.LIMIT:
      case OrderType.STOP_LIMIT:
        return this.userBtc >= order.amount;
        break;
    }

  }

  removeOrder(orderToRemove: Order): void {
    this.orders = this.orders.filter(order => order !== orderToRemove);
    this.ordersSub$.next(this.orders);
  }
}
