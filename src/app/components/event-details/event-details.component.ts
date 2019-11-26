import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ItEvent} from '../../classes/it-event';
import {AuthenticationService} from '../../_services/authentication.service';
import {EventService} from '../../_services/event.service';
import {UserEventStatus} from '../../classes/user-event-status';
import {ImageService} from '../../_services/image.service';
import {ParticipantService} from '../../_services/participant.service';
import {Participant} from '../../classes/participant';

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
  imgUrl: any;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private eventService: EventService,
    private imageService: ImageService,
    private participantService: ParticipantService
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    this.route.paramMap.subscribe(params => {
      this.eventService.getEvent(params.get('id')).subscribe(
        (data: ItEvent) => {
          data.eventType = this.eventService.eventTypeTr(data.eventType);
          data.startDate = new Date(data.startDate);
          data.image = this.imageService.dataURItoBlob(data.image.toString());
          this.updateUrlForBlob(data.image);
          this.itEvent = data;
          if (this.currentUser.type) {
            this.userStatus = new UserEventStatus();
            this.participantService.getStatus(this.itEvent.eventId).subscribe(
              (participant: Participant) => {
                if (participant === null) {
                  this.userStatus.isGoing = false; this.userStatus.isLookingForTeam = false;
                } else {
                  this.userStatus.isGoing = true;
                  this.userStatus.isLookingForTeam = participant.teamNeed;
                }
              }
            );
          }
        }
      );
    });
  }

  saveStatus() {
    this.edit = false;
    if (!this.userStatus.isGoing) {
      this.participantService.deleteStatus(this.itEvent.eventId).subscribe();
    } else {
      const participant = new Participant();
      participant.eventId = new ItEvent();
      participant.teamNeed = this.userStatus.isLookingForTeam;
      participant.eventId.eventId = this.itEvent.eventId;
      this.participantService.updateStatus(participant).subscribe();
    }
  }

  updateUrlForBlob(file: Blob): any {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (_event) => {
      this.imgUrl = fileReader.result;
    };
  }

  dropStatus() {
    if (this.userStatus.isGoing) {
      this.userStatus.isLookingForTeam = false;
    }
  }
}
