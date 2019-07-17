import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent implements OnInit {
  allPosts : any;
  allPostsReversed = [];
  newPost = {content: ''}
  newPostTag={'posts_id':''}

   constructor(private _httpService: HttpService,  private router: Router, private _authService: AuthService) { }

  ngOnInit() {
    this.getAllPosts()
  }
  getAllPosts(){
    let myObservable = this._httpService.getPosts();
    myObservable.subscribe(data=>{
      this.allPosts = data;
      this.calculateAgeOfPosts(this.allPosts)
      // Method to reset AllPostsReversed 
      this.setAllPostsReversed()
    })
  }
  hashtagRedirect(hashtag){
    hashtag[0] = hashtag[0].substring(1,hashtag[0].length)
    console.log('hi inside redirect', hashtag[0])
    this.router.navigate(['/dashboard/hashtag/', hashtag[0]]);
  }
  createPost(){
    // STEP 1: CREATE THE POST AND RETURN POST ID
    this.newPost['users_id'] = localStorage.getItem("user"); 
    let tempObservable = this._httpService.createPost(this.newPost)
    tempObservable.subscribe(data => {
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
    var hashIndexes = {}
    var allTags = []
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



}