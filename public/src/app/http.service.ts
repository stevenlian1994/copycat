import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
    isLoggedIn = false
    dict = {"isLoggedIn": 'string'}
    constructor(private _http: HttpClient){}

    getUsers(){
        return this._http.get("/getUsers")
    }
    getUser(userId){
      return this._http.get(`/getUser/${userId}`)
    }

    getUserPosts(userName){
        return this._http.get("/getUserPosts/" + userName)
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
    addLike(users_id,posts_id){
        return this._http.get(`/addLike/${posts_id}/${users_id}`);
    }
    

    postDelete(postId){
        return this._http.delete(`/postDelete/${postId}`);
    }

    followUser(followUserArg) {
        // followUserArg = JSON.stringify(followUserArg);
        console.log("MAmamamia!!!! " + followUserArg);
        return this._http.post("/followUser", followUserArg);

    }

    unfollowUser(unfollowUserArg){


        console.log("unfollowibg!!!!!!!!! " + unfollowUserArg);
        return this._http.post("/unfollowUser", unfollowUserArg);
    }

    getFolloweeId(ownId){
        console.log(ownId, "This is just a practice")
        return this._http.get("/getFolloweeId/" + ownId);

    }




    
}
