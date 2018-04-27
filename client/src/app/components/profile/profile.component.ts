import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {UsersService} from "../../services/users.service";
import { BlogService } from "../../services/blog.service";
import {EventService} from "../../services/event.service";
declare var google:any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username = '';
  email = '';
  aboutme = '';
  imagePath='';
  message;
  messageClass;
  followers = [];
  followings = [];
  followingUsers;
  followerUsers;
  score;
  mostLikeBlog;
  mostCommnetBlog;
  mostRecentBlog;
  events;
  googleapi = "https://chart.googleapis.com/chart?cht=qr&chs=250x250&choe=UTF-8&chl=";
  localip;
  linkScore;
  blogScore;
  likeScore;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private blogService: BlogService,
    private eventService: EventService
  ) { }

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

  loadMyBlogs(username){
    this.blogService.getAllBlogsForUser(username).subscribe(data=>{
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      }else{
        var myBlogs = data.blogs;
        var likeCount = -1;
        var resultMap = [];
        var recentDate = null;
        var commentCount = -1;
        for(var i = 0; i < myBlogs.length; i++) {
          var myBlog = myBlogs[i];
          if(myBlog.likes > likeCount){
            resultMap['mostLike'] = myBlog;
            likeCount = myBlog.likes;
          }

          if(recentDate == null){
            resultMap['mostRecent'] = myBlog;
            recentDate = myBlog.createdAt;
          }else{
            if(myBlog.createdAt>recentDate){
              resultMap['mostRecent'] = myBlog;
              recentDate = myBlog.createdAt;
            }
          }

          if(myBlog.comments.length > commentCount){
            resultMap['mostComment'] = myBlog;
            commentCount = myBlog.comments.length;
          }

        }
        this.mostLikeBlog = resultMap['mostLike'];
        this.mostRecentBlog = resultMap['mostRecent'];
        this.mostCommnetBlog = resultMap['mostComment'];
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

    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Set username
      this.email = profile.user.email; // Set e-mail
      this.aboutme = profile.user.aboutme;
      this.imagePath = profile.user.avatar;
      this.score = profile.user.score;
      this.blogScore = profile.user.blogScore;
      this.likeScore = profile.user.likeScore;
      this.linkScore = profile.user.linkScore;
      this.loadMyBlogs(this.username);
      this.loadMyEvent(this.username);
      this.loadFollowingsAndFollowers();

      this.getLocalip();

      google.charts.load('current', {'packages':['corechart']});

      google.charts.setOnLoadCallback(function() { drawChart(profile.user.likeScore, profile.user.blogScore,profile.user.linkScore); });
      //google.charts.setOnLoadCallback(drawChart,);

      function drawChart(likeScore,blogScore,linkScore) {
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Score from like received',     likeScore],
          ['Score from blog post',      blogScore],
          ['Score from link click',  linkScore]

        ]);

        var options = {
          title: '',
          is3D: true
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
      }
    });
  }

}
