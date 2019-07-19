import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import {ActivatedRoute} from "@angular/router";
import { Router, NavigationEnd, Event } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from "rxjs/operators";

@Component({
  selector: 'app-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.css']
})
export class HashtagComponent implements OnInit {
  hashtag : String;
  allPostsReversed = [];
  filteredPosts : any;
  allUsers : any;
  allHashTags : any;
  options: string[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;


  constructor(private _httpService: HttpService,   private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe( params => this.hashtag = params.title );
   }

   private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => 
      option.toLowerCase().includes(filterValue)
    );
  }

  ngOnInit() {
    this.router.events.subscribe(
      (event: Event) => {
             if (event instanceof NavigationEnd) {
               this.getFilteredPosts(this.hashtag);
               this.getAllTags()
               this.getAllUsers()
             }
      });
      this.getFilteredPosts(this.hashtag);
      this.getAllTags()
      this.getAllUsers()
  }
  getFilteredPosts(tag){
    let myObservable = this._httpService.getFilteredPosts(tag);
    myObservable.subscribe(data=>{
      console.log('this is filtered posts:', data);
      this.filteredPosts=data;
      this.calculateAgeOfPosts(this.filteredPosts)
      this.setAllPostsReversed()

    })
  }

  getAllUsers(){
    let myObservable = this._httpService.getUsers();
    myObservable.subscribe(data=>{
      this.allUsers = data;
      console.log('allUsers:', this.allUsers)
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
      this.allHashTags = data;      
      console.log('all Hash Tags', this.allHashTags)
    })
  }

  hashtagRedirect(hashtag){
    hashtag[0] = hashtag[0].substring(1,hashtag[0].length)
    console.log('hi inside redirect', hashtag[0])
    this.router.navigate(['/dashboard/hashtag/', hashtag[0]]);
  }
  profileRedirect(username){
    this.router.navigate(['/dashboard/user/', username[0]]);
  }
  setAllPostsReversed(){
    this.allPostsReversed = []
    for(var j = this.filteredPosts.length-1; j>-1; j--){
      this.filteredPosts[j]['content'] = this.filteredPosts[j]['content'].split(' ')
      this.allPostsReversed.push(this.filteredPosts[j])
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
