import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
    isLoggedIn = false
    dict = {"isLoggedIn": 'string'}
    constructor(private _http: HttpClient){}

    uploadProfilePicture(imageFile){
      return this._http.post('/uploadProfilePicture', imageFile)
    }

    getUsers(){
        return this._http.get("/getUsers")
    }
    getUser(userId){
      return this._http.get(`/getUser/${userId}`)
    }

    getUserPosts(userId){
        return this._http.get("/getUserPosts/" + userId)
    }

    getPosts(){
        return this._http.get('/getPosts')
    }
    getFilteredPosts(hashtag){
        return this._http.get(`/getFilteredPosts/${hashtag}`)
    }

    getTags(postId){
        return this._http.post('/getTags', postId)
    }
    getProfilePicture(){
      return this._http.get('https://picsum.photos/v2/list')
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
        console.log("is user logged in?:", this.isLoggedIn);
        return this.isLoggedIn;
    }

    getPostsTags(newPostTag){
        return this._http.post('/getPostsTags', newPostTag)
    }
    getTotalTweets(users_id){
        return this._http.get(`/getTotalTweets/${users_id}`)
    }

    getAllTags(){
        return this._http.get("/getTags");

    }

    postDelete(postId){
        console.log("SAMSO " + postId);
        return this._http.delete(`/postDelete/${postId}`);
    }

    // followUser(userId) {
    //     return this._http.post(`/followUser/${userId}`);
        
    // }



}

