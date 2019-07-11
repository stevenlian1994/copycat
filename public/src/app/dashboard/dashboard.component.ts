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
        console.log("this is newtag title:", this.newTag.title)
        this.newPost['users_id'] = localStorage.getItem("user")
    // now add to mysql
    let tempObservable = this._httpService.createPost(this.newPost)
    tempObservable.subscribe(data => {
        console.log("Got our posts!", data);
        this.allPosts.push(data);
        // this.allPosts.append(data)
        // // STEP 2: CREATE THE TAG AND RETURN TAG ID
        // let tempObservable2 = this._httpService.createTag(this.newTag)
        // tempObservable2.subscribe(data =>{
        //     console.log("Got our tag");
        //     // another observable
        //     // STEP 3: INSERT BOTH IDS INTO POST_HAS_TAGS
        // })
    });
    }

    createTag(){
    let tempObservable = this._httpService.createTag(this.newTag)
    tempObservable.subscribe(data => console.log("Got our posts!", data));
    this.newTag = {title: ''}
    }

}
