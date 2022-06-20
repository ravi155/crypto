import {Pipe, PipeTransform} from '@angular/core';
import {Order, OrderStatus} from '../interfaces/order';

class Orders {
}

@Pipe({
  name: 'sortOrders'
})
export class SortOrdersPipe implements PipeTransform {

  transform(items: Orders[]): any[] {
    if (!items) {
      return [];
    }

    const sortedItems = items.sort((itemA: Order, itemB: Order) => {
      if (itemA.status !== OrderStatus.OPEN && itemB.status === OrderStatus.OPEN) {
        return 1;
      } else if (itemA.status === OrderStatus.OPEN && itemB.status !== OrderStatus.OPEN) {
        return -1;
      } else {
        return 0;
      }
    })

    return sortedItems
  }

}
