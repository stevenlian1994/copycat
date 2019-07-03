import { Component } from '@angular/core';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'public';
  constructor(private _httpService: HttpService){
  }
  ngOnInit() {
    this.readAllPosts();
}
    readAllPosts(){
        let tempObservable = this._httpService.getPosts()
        tempObservable.subscribe(data => console.log("Got our tasks!", data));
    }
}
