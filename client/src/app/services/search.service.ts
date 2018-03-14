import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class SearchService {

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

  // Function to search blogs from the database
  searchBlogs(text) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get("http://localhost:8080/" + 'search/text/'+ text, this.options).map(res => res.json());
  }

  // Function to search blogs from the database
  searchBlogsByTag(tag) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get("http://localhost:8080/" + 'search/tags/'+ tag, this.options).map(res => res.json());
  }

}
