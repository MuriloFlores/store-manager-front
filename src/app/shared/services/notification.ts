import {Injectable, signal} from '@angular/core';

export interface ToastNotification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  public toastSignal = signal<ToastNotification | null>(null)
  private flashMessage: ToastNotification | null = null;

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.toastSignal.set({message, type})

    setTimeout(() => {
      this.toastSignal.set(null)
    }, 3000)
  }

  showOnNextRouter(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.flashMessage = {message, type: 'info'};
  }

  displayFlashMessage(): void {
    if (this.flashMessage) {
      this.show(this.flashMessage.message, this.flashMessage.type);
      this.flashMessage = null;
    }
  }
}
