import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PurchaseDTO } from "./create-purchase.service";
import { environment } from "../../../../environments/environment";

export interface FailedCartItemDTO {
  username: string;
  serviceId: number;
  url: string;
  quantity: number;
  provider: string;
}

export interface PurchaseProcessData {
  completed: boolean;
  failedItems: FailedCartItemDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class ProcessPurchaseService {
  
  private baseUrl = environment.apiUrl;

  private apiUrl = `${this.baseUrl}/purchases`;

  constructor(private http: HttpClient) {}

  process(purchaseId: number): Observable<PurchaseProcessData> {
    return this.http.post<PurchaseProcessData>(`${this.apiUrl}/${purchaseId}/process`, {});
  }
}
