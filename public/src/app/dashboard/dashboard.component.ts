import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _httpService: HttpService, private _authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  userRedirect(){
    this.router.navigate(['/dashboard/user/', localStorage.getItem('username')]);
  }
  logoutUser(){
    localStorage.clear()
    this._authService.logout();
  }
// end of class
}