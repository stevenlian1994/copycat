import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';
import { RouterInitializer } from '@angular/router/src/router_module';
import { Params } from '@angular/router';
import { Router, NavigationEnd, Event } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-newsfeeduser',
  templateUrl: './newsfeeduser.component.html',
  styleUrls: ['./newsfeeduser.component.css']
})

export class NewsfeeduserComponent implements OnInit {
  allTags : any;
  allUsers : any;
  options: string[] = [];
  allPosts : any;
  allPostsReversed = [];
  userName: String;
  imageFile: any;
  selectedFile: any;
  imageurl: any;
  myUser:any;
  totalTweets:any; 
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  
  constructor(private _httpService: HttpService, private _authService: AuthService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe( params => this.userName=params.userName);
  }
  
  ngOnInit() {
    this.router.events.subscribe(
      (event: Event) => {
             if (event instanceof NavigationEnd) {
              this.getUserPosts(this.userName);
              this.getUser(); 
              this.getTotalTweets(); 
             }
      });

    this.getUserPosts(this.userName);
    this.getUser(); 
    this.getTotalTweets();
    this.getAllTags();
    this.getAllUsers();
  }
  getAllUsers(){
    let myObservable = this._httpService.getUsers();
    myObservable.subscribe(data=>{
      this.allUsers = data;
      for (let i=0; i<this.allUsers.length; i++){
        this.options.push(this.allUsers[i]["username"])
      };
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value))
      );
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => 
      option.toLowerCase().includes(filterValue)
    );
  }

  getUserPosts(userName){
    let myObservable = this._httpService.getUserPosts(userName);
    myObservable.subscribe(data=>{
      this.allPosts = data;
      this.calculateAgeOfPosts(this.allPosts)
      // Method to reset AllPostsReversed
      this.setAllPostsReversed()
    })
  }
  hashtagRedirect(hashtag){
    hashtag[0] = hashtag[0].substring(1,hashtag[0].length)
    this.router.navigate(['/dashboard/hashtag/', hashtag[0]]);
  }
  profileRedirect(username){
    this.router.navigate(['/dashboard/user/', username[0]]);
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
      this.allPosts[j]['content'] = this.allPosts[j]['content'].split(' ')
      this.allPostsReversed.push(this.allPosts[j])
    }
  }
  getUser(){
    let myObservable = this._httpService.getUser(localStorage.getItem('user'));
    myObservable.subscribe(data=>{
      this.myUser = data[0]
    })
  }

  getTotalTweets(){
  let users_id=localStorage.getItem("user");
  console.log("total tweets1"+users_id);
  let myObservable = this._httpService.getTotalTweets(users_id);
  myObservable.subscribe(data=>{
  console.log("total tweets2"+ data);
  this.totalTweets=data;
  })
  }

  goUser(option) {
    this.router.navigate(["dashboard/user", option]);
    
  }

  trendredirect(hashtag){
    this.router.navigate(['/dashboard/hashtag/', hashtag]);
  }

  getAllTags(){
    let myObservable = this._httpService.getAllTags();
    myObservable.subscribe(data=>{
      this.allTags = data;
      console.log("this is all tags:", this.allTags);
    })
  }
}
