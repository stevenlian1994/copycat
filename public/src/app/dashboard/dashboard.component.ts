import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    // allPosts : any;
    // allPostsReversed = [];
    // newPost = {content: ''}
    // // newTag = {title: ''}
    // newPostTag={'posts_id':''}
    // newTagPlaceholder


  constructor(private _httpService: HttpService, private _authService: AuthService) { }

  ngOnInit() {
    // this.getAllPosts()
  }
  // getAllPosts()s{
  //   let myObservable = this._httpService.getPosts();
  //   myObservable.subscribe(data=>{
  //     this.allPosts = data;
  //     this.calculateAgeOfPosts(this.allPosts)
  //     // Method to reset AllPostsReversed
  //     this.setAllPostsReversed()
  //   })
  // }

  // createPost(){
  //   // STEP 1: CREATE THE POST AND RETURN POST ID
  //   this.newPost['users_id'] = localStorage.getItem("user"); 
  //   let tempObservable = this._httpService.createPost(this.newPost)
  //   tempObservable.subscribe(data => {
  //     this.newPostTag['posts_id'] = data['id'] //saving post id for post_has_tags query
  //     console.log('data from posting', data)
  //     // STEP 2 - Find all hashtags in content of post
  //       var allTags = this.findHashTags(this.newPost['content']) 
  //       //  allTags is an array of strings, but createTags is creating undefined titles for tags in db
  //     // STEP 3 - Create all tags if needed and return tag ids
  //     for(let i in allTags){
  //       if(allTags[i] == allTags[allTags.length-1]){
  //         var boolean = true
  //         console.log('our bool:', boolean)
  //       } else {
  //         var boolean = false
  //         console.log('our bool:', boolean)
  //       }
  //       this.createTag(allTags[i], data['id'], boolean)
  //     }  
  //   })
  // }
  // createTag(tag, postId, isLast){
  //   // STEP 1: call the server, sql query to check if tags already exists, return 
  //   console.log('inside createTags:', typeof tag)
  //   console.log('inside createTags:', tag)
  //   console.log('inside createTags:', isLast)
  //     let tempObservable2 = this._httpService.createTag(tag, postId); 
  //     tempObservable2.subscribe(data =>{
  //       console.log("this is our data from creating tags:", data)
  //       console.log(isLast)
  //       if(isLast){
  //         console.log('lets get all posts!!')
  //         this.getAllPosts()
  //       }
  //     })
  //   }

  // findHashTags(content){
  //   var hashIndexes = {}
  //   var allTags = []
  //   for(var i = 0; i < content.length; i++){
  //     if(content[i] == "#"){
  //       hashIndexes[i] = 1
  //       for(var j = i; j<content.length;j++){
  //         if(content[j] == " "){
  //           hashIndexes[i] = j
  //         }
  //       }
  //       if(hashIndexes[i] == 1){
  //         hashIndexes[i] = j
  //       }
  //       allTags.push(content.substring(i+1,hashIndexes[i]))
  //     }
  //   }
  //   return allTags
  // }

  // setAllPostsReversed(){
  //   this.allPostsReversed = []
  //   for(var j = this.allPosts.length-1; j>-1; j--){
  //     // this.allPosts[j]['content'] = this.allPosts[j]['content'].concat(' <a href="#">asdf</a>')
  //     // this.allPosts[j]['content'] = '<a href="#">hello</a>'
  //     this.allPosts[j]['content'] = this.allPosts[j]['content'].split(' ')

  //     console.log(this.allPosts[j]['content'])
  //     this.allPostsReversed.push(this.allPosts[j])
  //   }
  // }
  
  // calculateAgeOfPosts(posts){
  //   for(var i = 0; i<posts.length; i++){
  //     posts[i]['age'] = this.timeConversion(new Date().getTime() - new Date(posts[i]['created_at']).getTime());
  //   }
  // }
  // timeConversion(millisec) {
  //   // var seconds = (millisec / 1000).toFixed(0);
  //   var minutes = (millisec / (1000 * 60)).toFixed(0);
  //   var hours = (millisec / (1000 * 60 * 60)).toFixed(0);
  //   var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0);
  //   // if (parseInt(seconds) < 60) {
  //   //     return seconds + "s";
  //    if (parseInt(minutes) < 60) {
  //       return minutes + "m";
  //   } else if (parseInt(hours) < 24) {
  //       return hours + "h";
  //   } else {
  //       return days + "d"
  //   }
  // }
  logoutUser(){
    localStorage.clear()
    this._authService.logout();
  }
// end of class
}