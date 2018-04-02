import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router,Params} from "@angular/router";
import {Location} from "@angular/common";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  currentUrl;
  currentUser;


  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) { }

  ngOnInit() {

    this.authService.getProfile().subscribe(profile => {
      this.currentUser = profile.user.username; // Used when creating new blog posts and comments
      this.currentUrl = this.activatedRoute.snapshot.params;
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        let user = params['user'];
        let url = params['url'];
        if(user!=this.currentUser){
          const point ={
            user: user,
            point : 3
          }
          this.usersService.addPoint(point).subscribe(data => {

          });
        }
        window.location.href = url;
      });
    });
  }

}
