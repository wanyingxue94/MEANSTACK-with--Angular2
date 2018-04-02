import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions} from "@angular/http";
import {AuthService} from "./auth.service";


@Injectable()
export class EventService {


  options;
  domain = this.authService.domain;

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

  // Function to create a new blog post
  newEvent(event) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'event/newEvent', event, this.options).map(res => res.json());
  }

  // Function to get the blog using the id
  getEvent(id) {
    this.createAuthenticationHeaders()
    return this.http.get(this.domain + 'event/singleEvent/' + id, this.options).map(res => res.json());
  }

  getAllEvent(username){
    this.createAuthenticationHeaders()
    return this.http.get(this.domain + 'event/allEvent/' + username, this.options).map(res => res.json());
  }

  getIp(){
    this.createAuthenticationHeaders()
    return this.http.get(this.domain + 'event/getlocalip/' ,this.options).map(res => res.json());
  }

  goToEvent(eventRequest){
    this.createAuthenticationHeaders()
    return this.http.post(this.domain + 'event/goToEvent',eventRequest ,this.options).map(res => res.json());
  }


}
