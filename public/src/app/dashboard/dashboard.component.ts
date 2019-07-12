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
    newTag = {title: ''}
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
  createPost(){
    // STEP 1: CREATE THE POST AND RETURN POST ID
    this.newPost['users_id'] = localStorage.getItem("user"); 
    // now add to mysql
    let tempObservable = this._httpService.createPost(this.newPost)
    tempObservable.subscribe(data => {
      data['username'] = localStorage.getItem("username")
      data['age'] = 'Now';
      data['content'] = data['body']['content']
      console.log("Got our post:", data);
      // this.allPosts.push(data);
      this.newTagPlaceholder = data
      console.log(this.newTagPlaceholder)
      // this.allPosts.push(data);
      // this.allPostsReversed = this.allPosts
      this.allPostsReversed = this.allPosts.slice().reverse()
      this.newPostTag['posts_id'] = data["id"]; 
      // STEP 2
        // Find all hashtags
        this.newPost['users_id'] = localStorage.getItem("user"); 
        console.log(this.newPost)
        // console.log(this.newPost['content'])
        var content = this.newPost['content']
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


      let tempObservable2 = this._httpService.createTag(allTags); 
      tempObservable2.subscribe(data =>{
        this.newPostTag['tag_ids'] = data
        console.log("Got our tag:", data);
        // this.newTagPlaceholder['tags'] = data['body']['title']
        // this.allPosts.push(this.newTagPlaceholder);
        // this.setAllPostsReversed()
        // STEP 3
        let tempObservable3 = this._httpService.getPostsTags(this.newPostTag); 
              tempObservable3.subscribe(data =>{
              console.log("Got POSTTAG", data);
          })
      })
    })





  }
  setAllPostsReversed(){
    this.allPostsReversed = []
    for(var j = this.allPosts.length-1; j>-1; j--){
      this.allPostsReversed.push(this.allPosts[j])
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
  calculateAgeOfPosts(posts){
    for(var i = 0; i<posts.length; i++){
      posts[i]['age'] = this.timeConversion(new Date().getTime() - new Date(posts[i]['created_at']).getTime());
  }
  }

}
