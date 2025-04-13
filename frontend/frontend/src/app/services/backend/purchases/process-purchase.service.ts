import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PurchaseDTO } from "./create-purchase.service";

export interface FailedCartItemDTO {
  serviceId: number;
  url: string;
  quantity: number;
}

export interface PurchaseProcessData {
  completed: boolean;
  failedItems: FailedCartItemDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class ProcessPurchaseService {
  private apiUrl = 'http://localhost:8080/purchases';

  constructor(private http: HttpClient) {}

  process(purchaseId: number): Observable<PurchaseProcessData> {
    return this.http.post<PurchaseProcessData>(`${this.apiUrl}/${purchaseId}/process`, {});
  }
}
