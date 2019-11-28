import { Component, OnInit } from '@angular/core';
import {ItEvent} from '../../classes/it-event';
import {Router} from '@angular/router';
import {CheckboxItem} from '../../classes/checkbox-item';
import {forEach} from '@angular/router/src/utils/collection';
import {EventService} from '../../_services/event.service';
import {ImageService} from '../../_services/image.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: ItEvent[];
  eventsFiltered: ItEvent[];
  cities = new Set();
  urls = new Map();
  cityFilter: string;
  eventTypes: CheckboxItem[];

  constructor(
    private router: Router,
    private eventService: EventService,
    private imageService: ImageService
  ) {
  }


  ngOnInit() {
    this.eventTypes = [{value: 'Хакатон', checked: false}, {value: 'Олимпиада', checked: false},
      {value: 'Лекция', checked: false}, {value: 'Конференция', checked: false}];
    this.events = [];
    this.eventService.getAllEvents().subscribe(
      (data: ItEvent[]) => {
        data.forEach(event => {
          event.startDate = new Date(event.startDate);
          event.eventType = this.eventService.eventTypeEngRu(event.eventType);
          event.imageBlob = this.imageService.dataURItoBlob(event.image.toString());
          this.events.push(event);
          this.urlForBlob(event.imageBlob, event.eventId);
        });
        this.events.forEach(event => this.cities.add(event.city));
        this.eventsFiltered = Array.from(this.events);
      }
    );
  }

  filterEvents() {
    let tempEvents;
    let chosenTypesCounter = 0;
    if (this.cityFilter !== undefined) {
      tempEvents = this.events.filter(event => event.city === this.cityFilter);
    } else {
      tempEvents = Array.from(this.events);
    }
    this.eventTypes.forEach(type => {
      if (type.checked === true) {
        chosenTypesCounter++;
      }
    });
    if (chosenTypesCounter !== 0) {
      this.eventsFiltered = tempEvents.filter(event => {
          for (let i = 0; i < this.eventTypes.length; i++) {
            if ((event.eventType === this.eventTypes[i].value) && this.eventTypes[i].checked) {
              return true;
            }
          }
          return false;
        }
      );
    } else {
      this.eventsFiltered = Array.from(tempEvents);
    }
  }

  urlForBlob(file: Blob, eventId: string): any {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (_event) => {
      this.urls.set(eventId, fileReader.result);
    };
  }
}
