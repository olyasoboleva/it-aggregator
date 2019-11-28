import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItEvent} from '../../classes/it-event';
import {EventService} from '../../_services/event.service';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.css']
})
export class EventCreationComponent implements OnInit {
  eventForm: FormGroup;
  itEvent: ItEvent;
  types: string[];
  imgMessage: string;
  today: Date;

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService) { }

  ngOnInit() {
    this.itEvent = new ItEvent();
    this.types = ['Хакатон', 'Олимпиада', 'Лекция', 'Конференция'];
    this.today = new Date();
    this.imgMessage = 'Выберите изображение';
    this.eventForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        type: ['', Validators.required],
        city: ['', Validators.required],
        date: ['', Validators.required],
        prize: ['', Validators.required],
        info: ['']
      }
    );
  }

  onFileChanged(event): void {
    if (event.target.files[0].type.match(/image\/*/) == null) {
      return;
    }
    this.itEvent.imageBlob = event.target.files[0];
    this.imgMessage = event.target.files[0].name;
  }

  onClick() {
    if (this.eventForm.invalid || this.imgMessage === 'Выберите изображение') {
      return;
    }
    this.itEvent.name = this.eventForm.get('name').value;
    this.itEvent.eventType = this.eventService.eventTypeRuEng(this.eventForm.get('type').value);
    this.itEvent.city = this.eventForm.get('city').value;
    this.itEvent.startDate = this.eventForm.get('date').value;
    this.itEvent.prize = this.eventForm.get('prize').value;
    this.itEvent.info = this.eventForm.get('info').value;
    const reader = new FileReader();
    reader.readAsDataURL(this.itEvent.imageBlob);
    reader.onload = (_event) => {
      this.itEvent.image = reader.result.toString().split('base64,')[1];
      this.eventService.createEvent(this.itEvent).subscribe();
    };
  }

}
