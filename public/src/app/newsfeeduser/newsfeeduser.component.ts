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
  userId: String;
  imageFile: any;
  selectedFile: any;
  imageurl: any;
  myUser:any;

  username1={}; 
  totalTweets:any; 
  // imageFile: any;
  // selectedFile: any;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  
  constructor(private _httpService: HttpService, private _authService: AuthService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe( params => this.userId=params.userId);
  }
  
  ngOnInit() {
    this.router.events.subscribe(
      (event: Event) => {
             if (event instanceof NavigationEnd) {
              this.getUserPosts(this.userId);
              this.getUser(); 
              this.getTotalTweets(); 
             }
      });

    console.log(this.userId);
    this.getUserPosts(this.userId);
    this.getUser(); 
    this.getTotalTweets();
    this.getAllTags();
    this.getAllUsers();
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
    console.log('inside on file change', this.selectedFile)
  }
  onUpload() {
    let myObservable = this._httpService.uploadProfilePicture(this.selectedFile);
    myObservable.subscribe(data=>{
      console.log(data)

      this.convertBuffer(data)
    })
  }
  convertBuffer(data){
    let TYPED_ARRAY = new Uint8Array(data['data']);
    const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);
    // const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
    //   return data + String.fromCharCode(byte);
    //   }, '');
    let base64String = btoa(STRING_CHAR);
    // console.log(base64String)
    console.log('before sanitize')
    this.imageurl = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
    console.log(this.imageurl)
  }
  
  getAllUsers(){
    let myObservable = this._httpService.getUsers();
    myObservable.subscribe(data=>{
      // console.log('got our data into comp', data)
      this.allUsers = data;
      // console.log(this.allUsers);
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

  getUserPosts(userId){
    
    let myObservable = this._httpService.getUserPosts(userId);
    myObservable.subscribe(data=>{
      this.allPosts = data;
      // console.log(data);
      this.calculateAgeOfPosts(this.allPosts)
      // Method to reset AllPostsReversed
      this.setAllPostsReversed()
    })
  }
  hashtagRedirect(hashtag){
    hashtag[0] = hashtag[0].substring(1,hashtag[0].length)
    // console.log('hi inside redirect', hashtag[0])
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
      // this.allPosts[j]['content'] = this.allPosts[j]['content'].concat(' <a href="#">asdf</a>')
      // this.allPosts[j]['content'] = '<a href="#">hello</a>'
      this.allPosts[j]['content'] = this.allPosts[j]['content'].split(' ')

      // console.log(this.allPosts[j]['content'])
      this.allPostsReversed.push(this.allPosts[j])
    }
  }
  getUser(){
    // let username2=localStorage.getItem("username");
    // this.username1=username2;
    let myObservable = this._httpService.getUser(localStorage.getItem('user'));
    myObservable.subscribe(data=>{
      this.myUser = data[0]
      console.log(this.myUser)
    })
    this.username1 = this.userId;
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
