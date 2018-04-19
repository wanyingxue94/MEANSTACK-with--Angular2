import { Component, OnInit } from '@angular/core';
import {EventService} from "../../../services/event.service";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Location} from "@angular/common";


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  newEvent = false;
  processing = false;
  form;
  username;
  messageClass;
  message;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private eventService:EventService
  ) {
    this.createNewEventForm();
  }

  // Function to create new blog form
  createNewEventForm() {
    this.form = this.formBuilder.group({
      // Title field
      eventName: ['', Validators.compose([
        Validators.required
      ])],
      // Body field
      detail: ['', Validators.compose([
        Validators.required
      ])],
      eventTime: ['', Validators.compose([
        Validators.required
      ])],
      location: ['', Validators.compose([
      ])],
      ticketNumber: ['', Validators.compose([
        Validators.required
      ])],
    })
  }

  // Enable new Event form
  enableFormNewEventForm() {
    this.form.get('eventName').enable(); // Disable title field
    this.form.get('detail').enable(); // Disable body field
    this.form.get('eventTime').enable();
    this.form.get('location').enable();
    this.form.get('ticketNumber').enable();
  }

  // Disable new Event form
  disableFormNewEventForm() {
    this.form.get('eventName').disable(); // Disable title field
    this.form.get('detail').disable(); // Disable body field
    this.form.get('eventTime').disable();
    this.form.get('location').disable();
    this.form.get('ticketNumber').disable();
  }

  // Function to submit a new blog post
  onCreateEventSubmit() {
    this.processing = true; // Disable submit button
    this.disableFormNewEventForm(); // Lock form

    const event = {
      eventName: this.form.get('eventName').value, // Title field
      detail: this.form.get('detail').value, // Body field
      eventTime: this.form.get('eventTime').value, // CreatedBy field
      location: this.form.get('location').value,
      ticketNumber: this.form.get('ticketNumber').value,
      createdBy: this.username,
    }

    // Function to save blog into database
    this.eventService.newEvent(event).subscribe(data => {
      // Check if blog was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableFormNewEventForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        // Clear form data after two seconds
        setTimeout(() => {
          this.goBack();
        }, 2000);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username =  profile.user.username;
    });
  }

}
