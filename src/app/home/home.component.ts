import { Component, OnInit } from '@angular/core';
import { CommonService, HomeResponseDto } from '../api/catalog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  data: HomeResponseDto = { sections: [] };
  constructor(private catalogService: CommonService) {}

  ngOnInit(): void {
    this.getHome();
  }

  getHome() {
    this.catalogService.commonControllerHome().subscribe(data => {
      this.data = data;
    });
  }
}
