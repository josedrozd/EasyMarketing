import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OrderData {
  serviceId: string | null;
  productId: string | null;
  qualityId: string | null;
  quantityId: string | null;
  username: string | null;
  mail: string | null;
  name: string | null;
  lastname: string | null;
  platform: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class OrderDataService {

  private readonly storageKey = 'orderData';
  isBrowser: boolean;
  orderData$: Observable<OrderData>;

  private initialData: OrderData = {
    serviceId: null,
    productId: null,
    qualityId: null,
    quantityId: null,
    username: null,
    mail: null,
    name: null,
    lastname: null,
    platform: null
  };

  private orderDataSubject: BehaviorSubject<OrderData>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    const saved = this.isBrowser
      ? localStorage.getItem(this.storageKey)
      : null;

    const data = saved ? JSON.parse(saved) as OrderData : this.initialData;

    this.orderDataSubject = new BehaviorSubject<OrderData>(data);
    this.orderData$ = this.orderDataSubject.asObservable();

    if (this.isBrowser) {
      this.orderData$.subscribe(currentData => {
        localStorage.setItem(this.storageKey, JSON.stringify(currentData));
      });
    }
  }

  setAll(data: Partial<OrderData>) {
    const current = this.orderDataSubject.value;
    this.orderDataSubject.next({ ...current, ...data });
  }

  getSnapshot(): OrderData {
    return this.orderDataSubject.value;
  }

  setServiceId(serviceId: string) {
    this.setAll({ serviceId });
  }

  setProductId(productId: string) {
    this.setAll({ productId });
  }

  setQualityId(qualityId: string) {
    this.setAll({ qualityId });
  }

  setQuantityId(quantityId: string) {
    this.setAll({ quantityId });
  }

  setUsername(username: string) {
    this.setAll({ username });
  }

  setMail(mail: string) {
    this.setAll({ mail });
  }

  setName(name: string) {
    this.setAll({ name });
  }

  setLastname(lastname: string) {
    this.setAll({ lastname });
  }

  setPlatform(platform: string) {
    this.setAll({ platform });
  }

  reset() {
    this.orderDataSubject.next({ ...this.initialData });
    if (this.isBrowser) {
      localStorage.removeItem(this.storageKey);
    }
  }
  
}
