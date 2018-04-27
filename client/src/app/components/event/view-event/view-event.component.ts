import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {FormBuilder,Validators} from "@angular/forms";
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {

  username;
  currentUrl;
  event;
  messageClass;
  message;
  going = false;
  form;
  fullname;
  email;
  paymentFinished = false;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private router: Router,
  ) {
    this.createNewEventForm();
  }

  // Function to create new blog form
  createNewEventForm() {
    this.form = this.formBuilder.group({
      // Title field
      fullname: ['', Validators.compose([
        Validators.required
      ])],
      // Body field
      email: ['', Validators.compose([
        Validators.required
      ])]
    })
  }

  getTicket(){
    const goToEventRequest = {
      id:this.event._id
    }
    this.eventService.goToEvent(goToEventRequest).subscribe(data=>{
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      }else{
        this.message = data.message;
        this.going = true;
        this.email = this.form.get('email').value;
        this.fullname = this.form.get('fullname').value;
      }
    });
  }

  openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_jZXCMhhVOvEQjL2stizZ6ab5',
      locale: 'auto',
      token: function (token: any) {
        console.log(token.id);
        const goToEventRequest = {
          id:this.event._id
        }
        this.eventService.goToEvent(goToEventRequest).subscribe(data=>{
          if (!data.success) {
            this.messageClass = 'alert alert-danger'; // Return bootstrap error class
            this.message = data.message; // Return error message
          }else{
            this.message = data.message;
            this.going = true;
            this.email = this.form.get('email').value;
            this.fullname = this.form.get('fullname').value;
          }
        });
      }
    });

    handler.open({
      name: this.event.eventName,
      description: this.event.eventName,
      amount: this.event.price*100
    });

  }

  buyTicket(){
    var eventId = this.event._id;
    const goToEventRequest = {
      id:this.event._id
    }
    if(this.event.price == null||this.event.price<=0){
      this.eventService.goToEvent(goToEventRequest).subscribe(data=>{
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Return bootstrap error class
          this.message = data.message; // Return error message
        }else{
          this.message = data.message;
          this.going = true;
          this.email = this.form.get('email').value;
          this.fullname = this.form.get('fullname').value;
        }
      });
    }else{
      var handler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_jZXCMhhVOvEQjL2stizZ6ab5',
        locale: 'en',
        token: token => {
          if(token.id != null){
          var request = {
            id:eventId,
            token:token.id
          }
          console.log(eventId);
          this.eventService.goToEvent(request).subscribe(data=>{
            if (!data.success) {
              this.messageClass = 'alert alert-danger'; // Return bootstrap error class
              this.message = data.message; // Return error message
            }else{
              this.message = data.message;
              this.going = true;
              this.email = this.form.get('email').value;
              this.fullname = this.form.get('fullname').value;
            }
          });
        }
        }
      });

      handler.open({
        name: this.event.eventName,
        description: this.event.eventName,
        amount: this.event.price*100
      });
    }
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new blog posts and comments
    });
    this.eventService.getEvent(this.currentUrl.id).subscribe(data=>{
      this.event = data.event;
    });
  }

}
