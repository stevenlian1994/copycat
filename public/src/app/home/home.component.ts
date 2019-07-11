import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    newUser = {username: '', password: '', firstName: '', lastName: ''};
    userLogin = {username: '', password: ''}
    public data:any;
    @Output() isLoggedIn = false;
    constructor(private _httpService: HttpService, private router: Router, private _authService: AuthService){
    }

  ngOnInit() {
    console.log(
        "token",
        this._authService.isAuthenticated()
    )
    this.isLoggedIn = this._authService.isAuthenticated();
      console.log("inside homecomp")
  }

  createUser(){
    let tempObservable = this._httpService.createUser(this.newUser)
    tempObservable.subscribe(data => {
        localStorage.setItem("user", data["id"])
        this._authService.login();
    }
        // create new user in db and return that user with their id to be stored in session
        );
    // blank out user form
    this.newUser = {username: '', password: '', firstName: '', lastName: ''};
  }
  loginUser() {
    // console.log(this.userLogin)
    let tempObservable = this._httpService.loginUser(this.userLogin)
    tempObservable.subscribe(data => {
        // create new user in db and return that user with their id to be stored in session
        // console.log("this is userlogin from db:", data['id'])
        localStorage.setItem("user", data["id"])
        this._authService.login();
        this.router.navigate(['/dashboard']);
    }
    );
    this.userLogin = {username: '', password: ''}
  }
  logoutUser(){
      localStorage.clear()
      this._authService.logout();
  }

}
