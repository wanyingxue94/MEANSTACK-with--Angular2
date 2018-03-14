import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Location} from "@angular/common";
import {UsersService} from "../../../services/users.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  message;
  messageClass;
  username = '';
  email = '';
  user;
  aboutme = '';
  processing = false;

  constructor(
    private location: Location,
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) { }

  updateProfileSubmit(){
    this.processing = true; // Lock form fields
    // Function to send blog object to backend
    this.usersService.updateProfile(this.user).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set error bootstrap class
        this.message = data.message; // Set error message
        this.processing = false; // Unlock form fields
      } else {
        this.messageClass = 'alert alert-success'; // Set success bootstrap class
        this.message = data.message; // Set success message
        // After two seconds, navigate back to blog page
        setTimeout(() => {
          this.router.navigate(['/profile']); // Navigate back to route page
        }, 2000);
      }
    });
  }

  // Function to go back to previous page
  goBack() {
    this.location.back();
  }

  ngOnInit() {
    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Set username
      this.email = profile.user.email; // Set e-mail
      this.aboutme = profile.user.aboutme;
      this.user = profile.user;
    });
  }
}
