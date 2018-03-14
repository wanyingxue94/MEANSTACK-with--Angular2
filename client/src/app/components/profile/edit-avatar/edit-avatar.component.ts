import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {UsersService} from "../../../services/users.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-avatar',
  templateUrl: './edit-avatar.component.html',
  styleUrls: ['./edit-avatar.component.css']
})
export class EditAvatarComponent implements OnInit {

  message;
  messageClass;
  username = '';
  email = '';
  aboutme = '';
  imagePath = '';
  filesToUpload: Array<File>;
  processing = false;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) { }


  upload() {
    this.makeFileRequest("http://localhost:8080/upload", [], this.filesToUpload).then((result:Array<any>) => {
      if(result != null){
        this.imagePath = 'http://localhost:8080/'+ result[0].path;
      }
      const user = {
        username: this.username, // Title field
        avatar: this.imagePath
      }
      this.usersService.updateProfileAvatar(user).subscribe(data=>{
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
    }, (error) => {
      console.error(error);
    });
  }

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>> fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for(var i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  ngOnInit() {
    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Set username
      this.email = profile.user.email; // Set e-mail
      this.aboutme = profile.user.aboutme;
      this.imagePath = profile.user.avatar;
    });
  }


}
