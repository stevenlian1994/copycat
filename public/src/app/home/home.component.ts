import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

// import {LOCAL_STORAGE, WebStorageService} from '../angular-webstorage-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    newUser = {username: '', password: '', firstName: '', lastName: ''};
    public data:any=[];
    constructor(private _httpService: HttpService){
    }

  ngOnInit() {
  }
  createUser(){
    // console.log('inside createPost method', this.newUser)
    let tempObservable = this._httpService.createUser(this.newUser)
    tempObservable.subscribe(data => 
        // localStorage.setItem("userId", data)
        // console.log("Created user, here is id!", data['id'])
        console.log("New user:", data)
        
        );
    localStorage.setItem("user", this.newUser.username)
    this.newUser = {username: '', password: '', firstName: '', lastName: ''};
  }

//   saveInLocal(key, val): void {
//     console.log('received= key:' + key + 'value:' + val);
//     this.storage.set(key, val);
//     this.data[key]= this.storage.get(key);
//    }

// getFromLocal(key): void {
//     console.log('received= key:' + key);
//     this.data[key]= this.storage.get(key);
//     console.log(this.data);
//    }

}
