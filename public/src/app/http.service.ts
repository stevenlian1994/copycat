import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

    constructor(private _http: HttpClient){}

    getPosts(){
        return this._http.get('/getPosts')
    }
    createPost(newPost){
        return this._http.post('/createPost', newPost)
    }
    createTag(newTag){
        return this._http.post('/createTag', newTag)
    }
    createUser(newUser){
        console.log('inside service', newUser)
        return this._http.post('/createUser', newUser)
    }
    loginUser(userLogin){
        console.log('inside service', userLogin)
        return this._http.post('/loginUser/', userLogin )
    }

}

