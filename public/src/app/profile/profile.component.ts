import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username1={}; 
  totalTweets:any; 
  imageFile: any;
  selectedFile: any;

  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.getUser(); 
    this.getTotalTweets(); 
  }

  getUser(){
        let username2=localStorage.getItem("username");
        this.username1=username2;
        console.log( "aaa" + username2)
    }

  getTotalTweets(){
  let users_id=localStorage.getItem("user");
  console.log("bbb"+users_id);
  let myObservable = this._httpService.getTotalTweets(users_id);
  myObservable.subscribe(data=>{
    console.log("ccc"+ data);
    this.totalTweets=data;
  })
  }
}