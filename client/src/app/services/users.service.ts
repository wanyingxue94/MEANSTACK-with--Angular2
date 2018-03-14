import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {Headers, Http, RequestOptions} from "@angular/http";

@Injectable()
export class UsersService {

  options;
  domain = "http://localhost:8080/";;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }


  updateProfile(user) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'authentication/updateProfile', user, this.options).map(res => res.json());
  }

  updateProfileAvatar(user) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'authentication/updateProfileAvatar', user, this.options).map(res => res.json());
  }

  follow(followrequest){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'authentication/follow', followrequest, this.options).map(res => res.json());
  }

  unfollow(unfollowrequest){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'authentication/unfollow', unfollowrequest, this.options).map(res => res.json());
  }

  loadfollowings(user){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'authentication/loadfollowings', user, this.options).map(res => res.json());
  }

  loadfollowers(user){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'authentication/loadfollowers', user, this.options).map(res => res.json());
  }

}
