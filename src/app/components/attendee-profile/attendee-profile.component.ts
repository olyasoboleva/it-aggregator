import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ImageService} from '../../_services/image.service';
import {Attendee} from '../../classes/attendee';
import {AttendeeService} from '../../_services/attendee.service';

@Component({
  selector: 'app-attendee-profile',
  templateUrl: './attendee-profile.component.html',
  styleUrls: ['./attendee-profile.component.css']
})
export class AttendeeProfileComponent implements OnInit {
  attendee: Attendee;
  imgUrl: any;
  newImage: Blob;
  image: Blob;
  edit: boolean;
  attForm: FormGroup;

  constructor(
    private imageService: ImageService,
    private attService: AttendeeService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.attService.attProfile().subscribe(
      (data: Attendee) => {
        this.image = this.imageService.dataURItoBlob(data.image.toString());
        this.attendee = new Attendee();
        this.attendee.setFields(data);
        this.updateUrlForBlob(this.image);
      }
    );
    this.attForm = this.formBuilder.group({
      email: ['', Validators.required],
      skills: ['']
    });
  }

  onFileChanged(event) {
    if (event.target.files[0].type.match(/image\/*/) == null) {
      return;
    }
    this.newImage = event.target.files[0];
    this.updateUrlForBlob(this.newImage);
  }

  cancel() {
    this.edit = false;
    this.newImage = undefined;
    this.updateUrlForBlob(this.image);
  }

  submit() {
    if (this.attForm.invalid) {
      return;
    }
    this.edit = false;
    this.attendee.email = this.attForm.get('email').value;
    this.attendee.skills = this.attForm.get('skills').value;
    if (this.newImage !== undefined ) {
      this.image = this.newImage;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.image);
    reader.onload = (_event) => {
      this.attendee.image = reader.result.toString().split('base64,')[1];
      this.attService.updateAttendee(this.attendee).subscribe(data => console.log(data));
    };
  }

  updateUrlForBlob(file: Blob): any {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (_event) => {
      this.imgUrl = fileReader.result;
    };
  }

  editMode() {
    this.edit = true;
    this.attForm.setValue({email: this.attendee.email, skills: this.attendee.skills});
  }
}
