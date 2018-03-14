import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {UsersService} from "../../services/users.service";

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

  constructor(
    private authService: AuthService,
    private usersService: UsersService
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

  ngOnInit() {
    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Set username
      this.email = profile.user.email; // Set e-mail
      this.aboutme = profile.user.aboutme;
      this.imagePath = profile.user.avatar;
      this.loadFollowingsAndFollowers();
    });
  }

}
