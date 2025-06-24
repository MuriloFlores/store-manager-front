import {Component, inject} from '@angular/core';
import {NotificationService} from '../../services/notification';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})

export class ToastComponent {
  notificationService = inject(NotificationService)
}
