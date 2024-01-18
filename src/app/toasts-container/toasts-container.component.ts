import { Component } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toasts-container',
  templateUrl: './toasts-container.component.html',
  styleUrl: './toasts-container.component.scss',
})
export class ToastsContainerComponent {
  constructor(public toastService: ToastService) {}
}
