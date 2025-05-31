import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserData {
  mail: string | null;
  name: string | null;
  lastName: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private readonly storageKey = 'userData';
  isBrowser: boolean;
  userData$: Observable<UserData>;

  private initialData: UserData = {
    mail: null,
    name: null,
    lastName: null,
  };

  private userDataSubject: BehaviorSubject<UserData>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    const saved = this.isBrowser
      ? localStorage.getItem(this.storageKey)
      : null;

    const data = saved ? (JSON.parse(saved) as UserData) : this.initialData;

    this.userDataSubject = new BehaviorSubject<UserData>(data);
    this.userData$ = this.userDataSubject.asObservable();

    if (this.isBrowser) {
      this.userData$.subscribe((currentData) => {
        localStorage.setItem(this.storageKey, JSON.stringify(currentData));
      });
    }
  }

  setAll(data: Partial<UserData>) {
    const current = this.userDataSubject.value;
    this.userDataSubject.next({ ...current, ...data });
  }

  getSnapshot(): UserData {
    return this.userDataSubject.value;
  }

  setMail(mail: string) {
    this.setAll({ mail });
  }

  setName(name: string) {
    this.setAll({ name });
  }

  setLastName(lastName: string) {
    this.setAll({ lastName });
  }

  reset() {
    this.userDataSubject.next({ ...this.initialData });
    if (this.isBrowser) {
      localStorage.removeItem(this.storageKey);
    }
  }
}
