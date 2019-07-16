import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username1={}; 

  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.getUser()
  }
  getUser(){
        
        let username2=localStorage.getItem("username");
        this.username1=username2;
        console.log( "aaa" + username2)
    }


}
