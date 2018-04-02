import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {FormBuilder} from "@angular/forms";
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

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private router: Router,
  ) { }

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
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
    this.eventService.getEvent(this.currentUrl.id).subscribe(data=>{
      this.event = data.event;
    });
  }

}
