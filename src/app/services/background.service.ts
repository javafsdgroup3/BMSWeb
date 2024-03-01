import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router'; // Import 'Event as RouterEvent'
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  currentBackgroundImage: string = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd) // Use 'event is NavigationEnd' to narrow down the type
    ).subscribe((event: NavigationEnd) => { // Subscribe to NavigationEnd events
      this.updateBackgroundImage(event.url);
    });
  }

  updateBackgroundImage(url: string) {
    // Logic to determine background image based on route
    // For example:
    if (url.includes('dashboard')) {
      console.log("URL BG dashboard"+url);
      this.currentBackgroundImage = 'url("/assets/DashBoard.jpeg")';
    } 
    else if(url.includes('deposit')){
      console.log("URL BG deposit"+url);
      this.currentBackgroundImage = 'url("https://static.vecteezy.com/system/resources/thumbnails/014/896/131/small/money-saving-with-bank-finance-investment-concept-business-cash-and-loan-growth-deposit-for-interest-in-retirement-photo.jpg")';
    }
    else if(url.includes('signup')){
      console.log("URL BG signup"+url);
      this.currentBackgroundImage = 'url("/assets/DashBoard.jpeg")';
    }
    else {
      console.log("URL BG"+url);
      this.currentBackgroundImage = 'url("/assets/log.png")';
    }

    this.setBackgroundImage();
  }

  setBackgroundImage(): void {
    // const backgroundImageUrl = this.currentBackgroundImage === 'url("/assets/log.png")' ? 'url("/assets/log.png")' : 'url("/assets/log.png")';
    
    
    document.documentElement.style.setProperty('--background-image-url', this.currentBackgroundImage);
    console.log("BG--URL "+this.currentBackgroundImage)
  }
}
