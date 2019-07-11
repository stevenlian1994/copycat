import { Component } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './services/auth.service';
// import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'public';
  isLoggedIn = false;
  public data:any;
  constructor(private _httpService: HttpService, private _authService: AuthService){
  }

  ngOnInit() {
    this.isLoggedIn = this._authService.isAuthenticated();
}
}
