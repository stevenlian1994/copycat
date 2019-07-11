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

}
