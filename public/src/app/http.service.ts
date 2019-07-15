import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
    isLoggedIn = false
    dict = {"isLoggedIn": 'string'}
    constructor(private _http: HttpClient){}

    getPosts(){
        return this._http.get('/getPosts')
    }
    getTags(postId){
        return this._http.post('/getTags', postId)
    }
    
    createPost(newPost){
        return this._http.post('/createPost', newPost)
    }
    createTag(newTag, postId){
      return this._http.post(`/createTag/${postId}`, {"newTag": newTag})
    }
    createUser(newUser){
        return this._http.post('/createUser', newUser)
    }
    loginUser(userLogin){
        return this._http.post('/loginUser/', userLogin )
    }
    checkLogin(){
        if(localStorage.getItem("user") !== null){
            this.isLoggedIn = true;
        } else {
            this.isLoggedIn = false; 
        }
        console.log("is user logged in?:", this.isLoggedIn)
        return this.isLoggedIn
        // this.dict["isLoggedIn"]  = this.isLoggedIn
        // return this.dict2
    }

    getPostsTags(newPostTag){
        return this._http.post('/getPostsTags', newPostTag)
    }
}

