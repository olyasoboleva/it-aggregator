import { Component, OnInit } from '@angular/core';
import {Organization} from '../../classes/organization';
import {UserService} from '../../_services/user.service';
import {ImageService} from '../../_services/image.service';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.css']
})
export class OrganizationProfileComponent implements OnInit {
  organization: Organization;
  imgUrl: any;
  newImage: Blob;
  edit: boolean;

  constructor(
    private userService: UserService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    // TODO: remove id from params
    this.userService.orgProfile('2063a4d0-0af1-4310-8398-819c9772dcbf').subscribe(
      (data: Organization) => {
        // data.image = this.imageService.dataToFile(data.image.toString());
        data.image = this.imageService.dataURItoBlob(data.image.toString());
        this.organization = data;
        this.updateUrlForBlob(this.organization.image);
      }
    );
  }

  onFileChanged(event) {
    if (event.target.files[0].type.match(/image\/*/) == null) {
      return;
    }
    this.newImage = event.target.files[0];
    this.updateUrlForBlob(this.newImage);
  }

  updateUrlForBlob(file: Blob) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (_event) => {
      this.imgUrl = fileReader.result;
    };
  }

  cancel() {
    this.edit = false;
    this.updateUrlForBlob(this.organization.image);
  }

  submit() {
    this.edit = false;
  }
}
