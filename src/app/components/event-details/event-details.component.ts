import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ItEvent} from '../../classes/it-event';
import {AuthenticationService} from '../../_services/authentication.service';
import {EventService} from '../../_services/event.service';
import {UserEventStatus} from '../../classes/user-event-status';
import {ImageService} from '../../_services/image.service';
import {ParticipantService} from '../../_services/participant.service';
import {Participant} from '../../classes/participant';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

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
    private participantService: ParticipantService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
    this.route.paramMap.subscribe(params => {
      this.eventService.getEvent(params.get('id')).subscribe(
        (data: ItEvent) => {
          data.eventType = this.eventService.eventTypeEngRu(data.eventType);
          data.startDate = new Date(data.startDate);
          data.imageBlob = this.imageService.dataURItoBlob(data.image.toString());
          this.updateUrlForBlob(data.imageBlob);
          this.itEvent = data;
          this.itEvent.eventId = params.get('id');
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
          console.log(this.itEvent  );
        }
      );
    });
  }

  saveStatus(): void {
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

  dropStatus(): void {
    if (this.userStatus.isGoing) {
      this.userStatus.isLookingForTeam = false;
    }
  }

  openParticipantList() {
    const dialogRef = this.dialog.open(ParticipantListComponent, {
      width: '400px',
      height: '400px',
      data: {eventId: this.itEvent.eventId}
    });
  }
}

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list-component.html',
  styleUrls: ['./event-details.component.css']
})
export class ParticipantListComponent implements OnInit {
  participants: Participant[];
  constructor(
    public dialogRef: MatDialogRef<ParticipantListComponent>,
    private eventService: EventService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.eventService.getParticipants(this.data.eventId).subscribe( (data: Participant[]) => {
      this.participants = data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
