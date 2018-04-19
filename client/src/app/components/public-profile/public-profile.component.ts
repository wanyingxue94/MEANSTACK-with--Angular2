import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { BlogService } from '../../services/blog.service';
import {UsersService} from "../../services/users.service";
import {Location} from "@angular/common";
import {EventService} from "../../services/event.service";

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  currentUrl;
  username;
  email;
  foundProfile = false;
  messageClass;
  message;
  blogPosts;
  currentUser;
  followers = [];
  followings = [];
  isFollowing;
  followingUsers;
  followerUsers;
  aboutme = '';
  imagePath='';
  score;
  events;
  googleapi = "https://chart.googleapis.com/chart?cht=qr&chs=250x250&choe=UTF-8&chl=";
  localip;
  linkScore;
  blogScore;
  likeScore;


  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private usersService: UsersService,
    private router: Router,
    private eventService: EventService
  ) { }

  // Function to get all blogs from the database
  getAllBlogs() {
    // Function to GET all blogs from database
    this.blogService.getAllBlogs().subscribe(data => {
      var results = [];
      for(var i = 0, len = data.blogs.length ; i<len ; i++)
      {
        var item = data.blogs[i];
        if(item.createdBy == this.username){
          results.push(item);
        }
      }
      this.blogPosts = results; // Assign array to use in HTML
    });
  }

  follow(){
    const followRequest = {
      first: this.currentUser, // Title field
      second: this.username, // Body field
    }
    this.usersService.follow(followRequest).subscribe(data =>{
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      }else{
        this.message = data.message;
        this.isFollowing = true;
        this.router.navigateByUrl('blank').then(() => {
          this.router.navigateByUrl("user/"+this.username);
        });
      }
    });
  }


  unfollow(){
    const unfollowRequest = {
      first: this.currentUser, // Title field
      second: this.username, // Body field
    }
    this.usersService.unfollow(unfollowRequest).subscribe(data =>{
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      }else{
        this.message = data.message;
        this.isFollowing = false;
        this.router.navigateByUrl('blank').then(() => {
          this.router.navigateByUrl("user/"+this.username);
        });
      }
    });
  }

  loadFollowingsAndFollowers(){
    const user = {
      username: this.username,
    }
    this.usersService.loadfollowings(user).subscribe(data=>{
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      }else{
        this.followingUsers = data.users;
      }
    });

    this.usersService.loadfollowers(user).subscribe(data=>{
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      }else{
        this.followerUsers = data.users;
      }
    });
  }

  loadMyEvent(username){
    this.eventService.getAllEvent(username).subscribe(data=>{
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      }else{
        this.events = data.events;
      }
    });

  }

  getLocalip(){
    this.eventService.getIp().subscribe(data=>{
      this.localip = "http://"+ data.ip + ":4200/view-event/";
    });
  }



  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // Get URL parameters on page load
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.currentUser = profile.user.username; // Used when creating new blog posts and comments
    });
    // Service to get the public profile data
    this.authService.getPublicProfile(this.currentUrl.username).subscribe(data => {
      // Check if user was found in database
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      } else {
        this.username = data.user.username; // Save the username for use in HTML
        this.email = data.user.email; // Save the email for use in HTML
        this.followers = data.user.followers;
        this.followings = data.user.followings;
        this.aboutme = data.user.aboutme;
        this.imagePath = data.user.avatar;
        this.score = data.user.score;
        this.blogScore = data.user.blogScore;
        this.likeScore = data.user.likeScore;
        this.linkScore = data.user.linkScore;
        this.loadFollowingsAndFollowers();
        this.loadMyEvent(this.username);
      }
    });
    this.getAllBlogs();
  }



}
