import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  searchForm;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
  ) {
    this.createSearcbForm()
  }

  createSearcbForm() {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.compose([
      ])],
    })
  }


  // Function to logout user
  onLogoutClick() {
    this.authService.logout(); // Logout user
    this.flashMessagesService.show('You are logged out', { cssClass: 'alert-info' }); // Set custom flash message
    this.router.navigate(['/']); // Navigate back to home page
  }

  onSearchClick(){
    var searchText = this.searchForm.get('search').value
    this.router.navigate(['/search/text/'+searchText])
  }

  ngOnInit() {
  }

}
