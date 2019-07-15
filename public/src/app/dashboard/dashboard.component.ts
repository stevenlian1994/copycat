import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    allPosts : any;
    allPostsReversed = [];
    newPost = {content: ''}
    // newTag = {title: ''}
    newPostTag={'posts_id':''}
    newTagPlaceholder


  constructor(private _httpService: HttpService, private _authService: AuthService) { }

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
  // FIX THIS
  addNewestPost(data){
    data['username'] = localStorage.getItem("username")
    data['age'] = 'Now';
    data['content'] = data['body']['content']
    this.newTagPlaceholder = data
    // console.log(this.newTagPlaceholder)
        // this.allPosts.push(data);
    // this.allPostsReversed = this.allPosts
    this.allPostsReversed = this.allPosts.slice().reverse()
    this.newPostTag['posts_id'] = data["id"]; 
  }
  // getNewestPost(postId){

  // }


  createPost(){
    // STEP 1: CREATE THE POST AND RETURN POST ID
    this.newPost['users_id'] = localStorage.getItem("user"); 
    let tempObservable = this._httpService.createPost(this.newPost)
    tempObservable.subscribe(data => {
      this.newPostTag['posts_id'] = data['id'] //saving post id for post_has_tags query
      // this.addNewestPost(data) FIX TAGS BEFORE WORKING ON THIS
      // STEP 2 - Find all hashtags in content of post
        var allTags = this.findHashTags(this.newPost['content']) 
        //  allTags is an array of strings, but createTags is creating undefined titles for tags in db
      // STEP 3 - Create all tags if needed and return tag ids
      for(let tag of allTags){
        this.createTag(tag, data['id'])
      }  
    // }
    })
    // var allTags = this.findHashTags(this.newPost['content']) 
    // console.log('this is all tags:', allTags) 
    // console.log('this is all tags:', allTags[0]) 
    // this.createTag(allTags[0])
  }
  createTag(tag, postId){
    // STEP 1: call the server, sql query to check if tags already exists, return 
    console.log('inside createTags:', typeof tag)
    console.log('inside createTags:', tag)
      let tempObservable2 = this._httpService.createTag(tag, postId); 
      tempObservable2.subscribe(data =>{
        console.log("this is our data:", data)
        // data returned needs to be array of tag ids
        // this.newPostTag['tag_ids'] = data
        // console.log("returned from obs2:", data);
        // this.newTagPlaceholder['tags'] = data['body']['title']
        // this.allPosts.push(this.newTagPlaceholder);
        // this.setAllPostsReversed()
        // STEP 3
        // let tempObservable3 = this._httpService.getPostsTags(this.newPostTag); 
        //       tempObservable3.subscribe(data =>{
        //       console.log("Got POSTTAG", data);
        //   })
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
      this.allPostsReversed.push(this.allPosts[j])
    }
  }
  
  calculateAgeOfPosts(posts){
    for(var i = 0; i<posts.length; i++){
      posts[i]['age'] = this.timeConversion(new Date().getTime() - new Date(posts[i]['created_at']).getTime());
    }
  }
  timeConversion(millisec) {
    var seconds = (millisec / 1000).toFixed(1);
    var minutes = (millisec / (1000 * 60)).toFixed(1);
    var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    if (parseInt(seconds) < 60) {
        return seconds + " Sec";
    } else if (parseInt(minutes) < 60) {
        return minutes + " Min";
    } else if (parseInt(hours) < 24) {
        return hours + " Hrs";
    } else {
        return days + " Days"
    }
  }
  logoutUser(){
    localStorage.clear()
    this._authService.logout();
  }
// end of class
}
