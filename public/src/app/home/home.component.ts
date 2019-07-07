import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    newUser = {username: '', password: '', firstName: '', lastName: ''};
    userLogin = {username: '', password: ''}
    isLoggedIn = false;
    public data:any=[];
    constructor(private _httpService: HttpService){
    }

  ngOnInit() {
      this.checkLogin();
  }
  checkLogin(){
    console.log(localStorage.getItem("user"))
    if(localStorage.getItem("user") !== null){
        this.isLoggedIn = true;
    } else {
        this.isLoggedIn = false; 
    }
    console.log(this.isLoggedIn)
  }
  createUser(){
    let tempObservable = this._httpService.createUser(this.newUser)
    tempObservable.subscribe(data => {
        localStorage.setItem("user", data["id"])
        this.checkLogin()
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
        this.checkLogin()
        }
    );
    this.userLogin = {username: '', password: ''}
  }
  logoutUser(){
      localStorage.clear()
      this.checkLogin();
  }

}
