import { Component, OnInit } from '@angular/core';
import {Organization} from '../../classes/organization';
import {ImageService} from '../../_services/image.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OrganizationService} from '../../_services/organization.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.css']
})
export class OrganizationProfileComponent implements OnInit {
  organization: Organization;
  imgUrl: any;
  newImage: Blob;
  image: Blob;
  edit: boolean;
  orgForm: FormGroup;
  isCurrentUserProfile: boolean;

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
    private orgService: OrganizationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('id') === null) {
        this.isCurrentUserProfile = true;
        this.orgService.orgProfile().subscribe(
          (data: Organization) => {
            this.image = this.imageService.dataURItoBlob(data.image.toString());
            this.organization = new Organization();
            this.organization.setFields(data);
            this.updateUrlForBlob(this.image);
          }
        );
      } else {
        this.isCurrentUserProfile = false;
        this.orgService.getOrg(params.get('id')).subscribe(
          (data: Organization) => {
            this.image = this.imageService.dataURItoBlob(data.image.toString());
            this.organization = new Organization();
            this.organization.setFields(data);
            this.updateUrlForBlob(this.image);
          }
        );
      }
    });
    this.orgForm = this.formBuilder.group({
      email: ['', Validators.required],
      phone: ['', Validators.required],
      info: ['']
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
    this.updateUrlForBlob(this.image);
  }

  submit() {
    if (this.orgForm.invalid) {
      return;
    }
    this.edit = false;
    this.organization.phone = this.orgForm.get('phone').value;
    this.organization.email = this.orgForm.get('email').value;
    this.organization.info = this.orgForm.get('info').value;
    if (this.newImage !== undefined ) {
      this.image = this.newImage;
    }
    // check return code
    const reader = new FileReader();
    reader.readAsDataURL(this.image);
    reader.onload = (_event) => {
      this.organization.image = reader.result.toString().split('base64,')[1];
      this.orgService.updateOrganization(this.organization).subscribe();
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
    this.orgForm.setValue({phone: this.organization.phone, email: this.organization.email, info: this.organization.info});
  }
}
