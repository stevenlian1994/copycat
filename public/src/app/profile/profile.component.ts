import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../services/auth.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username1={}; 
  totalTweets:any; 
  imageFile: any;
  selectedFile: any;

  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.getUser(); 
    this.getTotalTweets(); 
  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
    console.log('inside on file change', this.selectedFile)
  }
  onUpload() {
    // store in assets/img/dog.jpg
    // const uploadData = new FormData();
    // uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    let myObservable = this._httpService.uploadProfilePicture(this.selectedFile);
    myObservable.subscribe(data=>{
      // console.log("onUpload"+ data);
      // this.createImageFromBlob(data);
      
    })
    // this.http.post('my-backend.com/file-upload', this.selectedFile)
    // .subscribe(...);
    // this.imageFile = this.selectedFile.name;
    
  }

  // imageBlobUrl: string;

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();

    if (image) {
        reader.readAsDataURL(image);
      }
  }



  getUser(){
        let username2=localStorage.getItem("username");
        this.username1=username2;
        console.log( "aaa" + username2)
    }
  // previewFile(){
  //   console.log('inside previewfile method ~~~~~~~~~~~~')
  //   console.log(this.imageFile)
  //   console.log(typeof this.imageFile)
    
  // }
  
  getTotalTweets(){
  let users_id=localStorage.getItem("user");
  console.log("bbb"+users_id);
  let myObservable = this._httpService.getTotalTweets(users_id);
  myObservable.subscribe(data=>{
    console.log("ccc"+ data);
    this.totalTweets=data;
  })
  }
}