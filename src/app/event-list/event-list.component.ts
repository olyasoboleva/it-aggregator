import { Component, OnInit } from '@angular/core';
import {ItEvent} from '../classes/it-event';
import {Router} from '@angular/router';
import {CheckboxItem} from '../classes/checkbox-item';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: ItEvent[];
  eventsFiltered: ItEvent[];
  cities = new Set();
  cityFilter: string;
  eventTypes: CheckboxItem[];

  constructor(
    private router: Router
  ) {
    this.eventTypes = [{value: 'Хакатон', checked: false}, {value: 'Олимпиада', checked: false},
      {value: 'Лекция', checked: false}, {value: 'Конференция', checked: false}];
    this.events = [{city: 'Москва', info: '', name: 'haha', start_date: '01.12.2019', type: 'Хакатон', event_id: 1},
      {city: 'Санкт-Петербург', info: '', name: 'hehe', start_date: '01.12.2019', type: 'Хакатон', event_id: 2},
      {city: 'Казань', info: '', name: 'hoho', start_date: '01.12.2019', type: 'Олимпиада', event_id: 2},
      {city: 'Екатеринбург', info: '', name: 'hihi', start_date: '01.12.2019', type: 'Лекция', event_id: 2},
      {city: 'Москва', info: '', name: 'huhu', start_date: '01.12.2019', type: 'Хакатон', event_id: 2}];
      this.events.forEach(event => this.cities.add(event.city));
      this.eventsFiltered = Array.from(this.events);
  }

  ngOnInit() {
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
            if ((event.type === this.eventTypes[i].value) && this.eventTypes[i].checked) {
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
}
