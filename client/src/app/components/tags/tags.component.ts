import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {BlogService} from "../../services/blog.service";
import {SearchService} from "../../services/search.service";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  username;
  blogPosts: any[];
  currentUrl;
  message;
  messageClass;
  tagName;

  constructor(
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {

  }

  searchBlogsByTag(){
    this.currentUrl = this.activatedRoute.snapshot.params;
    var tag = this.currentUrl.tag;
    this.tagName = this.currentUrl.tag;
    this.searchService.searchBlogsByTag(tag).subscribe(data => {
      this.blogPosts = data.blogs; // Assign array to use in HTML
    });
  }


  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new blog posts and comments
    });
    this.searchBlogsByTag();
  }

}
