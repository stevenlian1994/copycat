import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
    newPost = {content: ''}
    newTag = {title: ''}
    constructor(private _httpService: HttpService){
    }

  ngOnInit() {
  }
  createPost(){
      console.log('inside createPost method', this.newPost)
    // now add to mysql
    let tempObservable = this._httpService.createPost(this.newPost)
    tempObservable.subscribe(data => console.log("Got our posts!", data));
  }
  createTag(){
    let tempObservable = this._httpService.createTag(this.newTag)
    tempObservable.subscribe(data => console.log("Got our posts!", data));
  }
}
