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
    allPostsReversed: any;
    newPost = {content: ''}
    newTag = {title: ''}
    newPostTag={'posts_id':'', 'tags_id':''}


  constructor(private _httpService: HttpService, private _authService: AuthService) { }

  ngOnInit() {
    // On init, use observable to query for all posts
    let myObservable = this._httpService.getPosts();
    myObservable.subscribe(data=>{
        this.allPosts = data;
        for(var i = 0; i<this.allPosts.length; i++){
            this.allPosts[i]['age'] = this.timeConversion(new Date().getTime() - new Date(this.allPosts[i]['created_at']).getTime());
        }
        console.log(this.allPosts);
        
        this.allPostsReversed = this.allPosts.slice().reverse()
        // this.allPostsReversed.reverse()
    })
  }
  logoutUser(){
    localStorage.clear()
    this._authService.logout();
    }
    createPost(){
        // STEP 1: CREATE THE POST AND RETURN POST ID
        this.newPost['users_id'] = localStorage.getItem("user"); 
    // now add to mysql
        let tempObservable = this._httpService.createPost(this.newPost)
        tempObservable.subscribe(data => {
            console.log("Got our post:", data);
            data['age'] = 'Now';
            data['username'] = localStorage.getItem("username")
            data['content'] = data['body']['content']
            // this.allPosts.push(data);
            this.allPosts.push(data);

            // this.allPostsReversed = this.allPosts
            this.allPostsReversed = this.allPosts.slice().reverse()
            this.newPostTag['posts_id'] = data["id"]; 
            // STEP 2
            let tempObservable2 = this._httpService.createTag(this.newTag); 
            tempObservable2.subscribe(data =>{
            this.newPostTag['tags_id'] = data["id"]; 
            console.log("Got our tag:", data);
                // STEP 3
                let tempObservable3 = this._httpService.getPostsTags(this.newPostTag); 
                tempObservable3.subscribe(data =>{
                console.log("Got POSTTAG", data);
                })
        })
    })
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
}
