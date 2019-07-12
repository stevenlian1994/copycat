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
    newPost = {content: ''}
    newTag = {title: ''}
    newPostTag={posts_id:'', tags_id:''}


  constructor(private _httpService: HttpService, private _authService: AuthService) { }

  ngOnInit() {
    // On init, use observable to query for all posts
    let myObservable = this._httpService.getPosts();
    myObservable.subscribe(data=>{
        this.allPosts = data;
        console.log(this.allPosts);
    }
    )

  }
    logoutUser(){
    localStorage.clear()
    this._authService.logout();
    }
    createPost(){
        // STEP 1: CREATE THE POST AND RETURN POST ID
        console.log("this is newtag title:", this.newTag.title); 
        this.newPost['users_id'] = localStorage.getItem("user"); 
    // now add to mysql
    let tempObservable = this._httpService.createPost(this.newPost)
    tempObservable.subscribe(data => {
        console.log("Got our posts!", data);
        let posts_id= data["id"]; 
        console.log(posts_id); 
        this.allPosts.push(data["body"]);
        this.newPostTag[posts_id] = data["id"] ; 
        let tempObservable2 = this._httpService.createTag(this.newTag); 
        tempObservable2.subscribe(data =>{
          let tags_id= data["id"]; 
          this.newPostTag[tags_id] = data["id"] ; 
           console.log("Got our tag", data);
            let tempObservable3 = this._httpService.getPostsTags(this.newPostTag); 
            tempObservable3.subscribe(data =>{
            console.log("Got tag", data);
       })
      })
    })
  }
}

            
        // console.log(data.()); 
        // let tempObservable2 = this._httpService.createTag(this.newTag)
   // tempObservable2.subscribe(data =>{
        //   console.log("Got our tag");
        // this.allPosts.append(data)
        // // STEP 2: CREATE THE TAG AND RETURN TAG ID

  
      // createTag(){
      // let tempObservable = this._httpService.createTag(this.newTag)
      // tempObservable.subscribe(data => console.log("Got our tags!", data));
      // this.newTag = {title: ''}
      // let tags_id= data["id"]; 
      // console.log(tags_id); 
      // }