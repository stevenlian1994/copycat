import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    newUser = {username: '', password: '', firstName: '', lastName: ''};
    constructor(private _httpService: HttpService){
    }

  ngOnInit() {
  }
  createUser(){
    console.log('inside createPost method', this.newUser)
  }

}
