import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cityName, routeCityName } from 'src/app/service/cityName';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}

  cityName: { zh: string; en: string }[] = cityName;
  currentCity = '縣市';
  isCityOpen: boolean = false;
  isCardOpen: boolean = true;
  formdata: {
    inputText: string;
    city: string;
  } = {
    inputText: '',
    city: '',
  };

  value: string = '';

  ngOnInit(): void {
    this.isCardOpen = false;
  }

  backToHome() {
    this.router.navigate(['/home']);
  }

  toggleCard() {
    this.isCardOpen = !this.isCardOpen;
    console.log(this.isCardOpen);
  }

  toggleCity() {
    this.isCityOpen = !this.isCityOpen;
    console.log(this.isCityOpen);
  }

  setCityName(router: string) {
    if (router == 'bike') {
      this.cityName = cityName;
    } else {
      this.cityName = routeCityName;
    }
  }

  send() {
    this.formdata.inputText = this.value;
    if (this.router.url.includes('bike')) {
      this.router.navigate(['/search/bike'], {
        queryParams: {
          inputText: this.formdata.inputText,
          city: this.formdata.city,
        },
      });
    } else {
      this.router.navigate(['/search/route'], {
        queryParams: {
          inputText: this.formdata.inputText,
          city: this.formdata.city,
        },
      });
    }
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
}
