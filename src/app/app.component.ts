import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private modalService: NgbModal,
    public keycloak: KeycloakService
  ) {}

  public open(modal: NgbModalRef): void {
    this.modalService.open(modal);
  }
}
