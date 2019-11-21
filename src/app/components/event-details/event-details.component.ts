import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ItEvent} from '../../classes/it-event';
import {AuthenticationService} from '../../_services/authentication.service';
import {EventService} from '../../_services/event.service';
import {UserEventStatus} from '../../classes/user-event-status';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  currentUser: any;
  itEvent: ItEvent;
  edit: boolean;
  userStatus: UserEventStatus;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    this.route.paramMap.subscribe(params => {
      this.eventService.getEvent(params.get('id')).subscribe(
        (data: ItEvent) => {
          data.eventType = this.eventService.eventTypeTr(data.eventType);
          data.startDate = new Date(data.startDate);
          this.itEvent = data;
        }
      );
    });
    this.userStatus = new UserEventStatus(); this.userStatus.isGoing = false; this.userStatus.isLookingForTeam = false;
  }

  saveStatus() {
    this.edit = false;
    // запрос на бэк
  }

}
