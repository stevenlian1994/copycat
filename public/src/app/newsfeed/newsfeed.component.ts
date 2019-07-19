import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterInitializer } from '@angular/router/src/router_module';
import { userInfo } from 'os';


@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})


export class NewsfeedComponent implements OnInit {
  allTags : any;
  allPosts : any;
  allUsers : any;
  allPostsReversed = [];
  newPost = {content: ''};
  newPostTag={'posts_id':''};
  options: string[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  postId : any;
  ownId : any;


  constructor(private _httpService: HttpService, private route: ActivatedRoute,  private router: Router, private _authService: AuthService) { }

  ngOnInit() {
    this.ownId = localStorage.getItem("user");
    console.log(this.ownId);
    this.getAllPosts();
    this.getAllUsers();
    this.getAllTags();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => 
      option.toLowerCase().includes(filterValue)
    );
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


  getAllTags(){
    let myObservable = this._httpService.getAllTags();
    myObservable.subscribe(data=>{
      this.allTags = data;      
     
    })
  }

  getAllPosts(){
    let myObservable = this._httpService.getPosts();
    myObservable.subscribe(data=>{
      this.allPosts = data;
      this.calculateAgeOfPosts(this.allPosts)
      // Method to reset AllPostsReversed 
      this.setAllPostsReversed();
      console.log(this.allPostsReversed);
    })
  }

  hashtagRedirect(hashtag){
    hashtag[0] = hashtag[0].substring(1,hashtag[0].length);
    this.router.navigate(['/dashboard/hashtag/', hashtag[0]]);
  }

  trendredirect(hashtag){
    this.router.navigate(['/dashboard/hashtag/', hashtag]);
  }

  profileRedirect(username){
    this.router.navigate(['/dashboard/user/', username[0]]);
  }
  
  createPost(){
    // STEP 1: CREATE THE POST AND RETURN POST ID
    this.newPost['users_id'] = localStorage.getItem("user"); 
    let tempObservable = this._httpService.createPost(this.newPost);
    tempObservable.subscribe(data => {
      this.newPost = {content: ''};
      this.newPostTag['posts_id'] = data['id'] //saving post id for post_has_tags query
      // STEP 2 - Find all hashtags in content of post
        var allTags = this.findHashTags(this.newPost['content']) 
        //  allTags is an array of strings, but createTags is creating undefined titles for tags in db
      // STEP 3 - Create all tags if needed and return tag ids
      if(allTags.length == 0){
        this.getAllPosts()
      }
      for(let i in allTags){
        if(allTags[i] == allTags[allTags.length-1]){
          var boolean = true
        } else {
          var boolean = false
        }
        this.createTag(allTags[i], data['id'], boolean)
      }  
    })
  }

  createTag(tag, postId, isLast){
    // STEP 1: call the server, sql query to check if tags already exists, return 
      let tempObservable2 = this._httpService.createTag(tag, postId); 
      tempObservable2.subscribe(data =>{
        if(isLast){
          this.getAllPosts()
        }
      })
    }
  
  findHashTags(content){
    var hashIndexes = {};
    var allTags = [];
    for(var i = 0; i < content.length; i++){
      if(content[i] == "#"){
        hashIndexes[i] = 1
        for(var j = i; j<content.length;j++){
          if(content[j] == " "){
            hashIndexes[i] = j
          }
        }
        if(hashIndexes[i] == 1){
          hashIndexes[i] = j
        }
        allTags.push(content.substring(i+1,hashIndexes[i]))
      }
    }
    return allTags
  }

  setAllPostsReversed(){
    this.allPostsReversed = []
    for(var j = this.allPosts.length-1; j>-1; j--){
      this.allPosts[j]['content'] = this.allPosts[j]['content'].split(' ')
      this.allPostsReversed.push(this.allPosts[j])
    }
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

  goUser(option) {
    this.router.navigate(["dashboard/user", option]);
  }



  postDelete(postId){
    console.log(postId);

    let tempObservable = this._httpService.postDelete(postId);
    tempObservable.subscribe(data =>{
      this.getAllPosts()
    })
  }

  followUser(usersId){
    let myObservable = this._httpService.followUser(userId);
    myObservable.subscribe(data => {
      // your codes here


      
    })




  }

}
