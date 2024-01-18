import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: ToastInfo[] = [];

  show(toast: ToastInfo) {
    this.toasts.push(toast);
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}

export interface ToastInfo {
  header: string;
  body: string;
  classname?: string;
  delay?: number;
}
