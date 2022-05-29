import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cityName } from 'src/app/service/cityName';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private activeRouter: ActivatedRoute, private router: Router) {}

  cityName: { zh: string; en: string }[] = cityName;
  currentCity = '縣市';
  isCityOpen: boolean = false;

  formdata: {
    inputText: string;
    city: string;
  } = {
    inputText: '',
    city: '',
  };

  value: string = '';

  ngOnInit(): void {
    this.currentCity = '縣市';
  }
  selectedCity(e: Event) {
    this.cityName.forEach((c) => {
      if (c.zh == (e.target as HTMLInputElement).innerText) {
        this.formdata.city = c.en;
        this.currentCity = c.zh;
      }
    });
    this.isCityOpen = false;
  }

  send() {
    this.formdata.inputText = this.value;
    this.router.navigate(['/search/bike'], {
      queryParams: {
        inputText: this.formdata.inputText,
        city: this.formdata.city,
      },
    });
  }

  toggleCity() {
    this.isCityOpen = !this.isCityOpen;
    console.log(this.isCityOpen);
  }
}
