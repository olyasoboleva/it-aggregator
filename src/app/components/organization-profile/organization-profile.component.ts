import { Component, OnInit } from '@angular/core';
import {Organization} from '../../classes/organization';
import {ImageService} from '../../_services/image.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OrganizationService} from '../../_services/organization.service';

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
  orgForm: FormGroup;

  constructor(
    private imageService: ImageService,
    private orgService: OrganizationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    // TODO: remove id from params
    this.orgService.orgProfile('2063a4d0-0af1-4310-8398-819c9772dcbf').subscribe(
      (data: Organization) => {
        // data.image = this.imageService.dataToFile(data.image.toString());
        data.image = this.imageService.dataURItoBlob(data.image.toString());
        this.organization = data;
        this.updateUrlForBlob(this.organization.image);
      }
    );
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
    this.updateUrlForBlob(this.organization.image);
  }

  submit() {
    if (this.orgForm.invalid) {
      return;
    }
    this.edit = false;
    this.organization.phone = this.orgForm.get('phone').value;
    this.organization.email = this.orgForm.get('email').value;
    this.organization.info = this.orgForm.get('info').value;
    this.organization.image = this.newImage;
    // check return code
    // this.orgService.updateOrganization(this.organization);
  }

  updateUrlForBlob(file: Blob): any {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (_event) => {
      this.imgUrl = fileReader.result;
    };
  }
}
