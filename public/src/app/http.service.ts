import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

    constructor(private _http: HttpClient){}

    // getTasks(){
    //     return this._http.get('/');
    // }
    getPosts(){
        return this._http.get('/getPosts')
    }
    createPost(newPost){
        // console.log('inside service')
        return this._http.post('/createPost', newPost)
    }
    createTag(newTag){
        // console.log('inside service')
        return this._http.post('/createTag', newTag)
    }

    // createProduct(product){
    //     console.log('inside service')
    //     return this._httpClient.post('/createProduct', product);
    // }
}

