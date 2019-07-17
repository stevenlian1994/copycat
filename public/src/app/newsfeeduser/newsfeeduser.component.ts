import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterInitializer } from '@angular/router/src/router_module';
import { Params } from '@angular/router';

@Component({
  selector: 'app-newsfeeduser',
  templateUrl: './newsfeeduser.component.html',
  styleUrls: ['./newsfeeduser.component.css']
})
export class NewsfeeduserComponent implements OnInit {

  allPosts : any;
  allPostsReversed = [];
  userId: String;
  
  constructor(private _httpService: HttpService, private _authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe( params => this.userId=params.userId);
  }

  ngOnInit() {
    // this.userId = this.route.snapshot.paramMap.get("userId");
    // console.log("this is the student id " + this.userId);
    console.log(this.userId);
    this.getUserPosts(this.userId);

  }
  

  getUserPosts(userId){
    
    let myObservable = this._httpService.getUserPosts(userId);
    myObservable.subscribe(data=>{
      this.allPosts = data;
      console.log(data);
      this.calculateAgeOfPosts(this.allPosts)
      // Method to reset AllPostsReversed
      this.setAllPostsReversed()
    })
  }

  calculateAgeOfPosts(posts){
    for(var i = 0; i<posts.length; i++){
      posts[i]['age'] = this.timeConversion(new Date().getTime() - new Date(posts[i]['created_at']).getTime());
    }
  }

  timeConversion(millisec) {
    // var seconds = (millisec / 1000).toFixed(0);
    var minutes = (millisec / (1000 * 60)).toFixed(0);
    var hours = (millisec / (1000 * 60 * 60)).toFixed(0);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0);
    // if (parseInt(seconds) < 60) {
    //     return seconds + "s";
     if (parseInt(minutes) < 60) {
        return minutes + "m";
    } else if (parseInt(hours) < 24) {
        return hours + "h";
    } else {
        return days + "d"
    }
  }

  setAllPostsReversed(){
    this.allPostsReversed = []
    for(var j = this.allPosts.length-1; j>-1; j--){
      // this.allPosts[j]['content'] = this.allPosts[j]['content'].concat(' <a href="#">asdf</a>')
      // this.allPosts[j]['content'] = '<a href="#">hello</a>'
      this.allPosts[j]['content'] = this.allPosts[j]['content'].split(' ')

      console.log(this.allPosts[j]['content'])
      this.allPostsReversed.push(this.allPosts[j])
    }
  }

}
