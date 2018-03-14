import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { SearchService } from '../../services/search.service';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  username;
  blogPosts: any[];
  currentUrl;
  message;
  messageClass;
  newPost = false;

  constructor(
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {

  }

  searchBlogs(){
    this.currentUrl = this.activatedRoute.snapshot.params;
    var searhQuery = this.currentUrl.text;
    this.searchService.searchBlogs(searhQuery).subscribe(data => {
      this.blogPosts = data.blogs; // Assign array to use in HTML
    });
  }


  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new blog posts and comments
    });
    this.searchBlogs();
  }
}
