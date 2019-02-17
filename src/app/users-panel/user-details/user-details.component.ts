import {Component, OnDestroy, OnInit} from '@angular/core';
import { UsersPanelService } from '../users-panel.service';
import {NgbModal, ModalDismissReasons, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { User } from '../../models/user/user.model';
import {Subscription} from 'rxjs';
import {ImageUploadService} from '../../shared/image-upload.service';
import {UtilsService} from '../../shared/utils.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  closeResult: string;
  // User
  public user: User;
  // User profile form
  public userForm: FormGroup;
  // Loading component
  public isLoading = true;
  // subscriptions
  private sub: Subscription;

  constructor(
    private userPanelService: UsersPanelService,
    private modalService: NgbModal,
    private datepickerconfig: NgbDatepickerConfig,
    private fb: FormBuilder,
    private imageUploadService: ImageUploadService,
    private _utilsService: UtilsService
  ) {
    // ==> Get: User
    this.sub = this.userPanelService.loggedInUser$.subscribe(user => {
      this.user = user;
      if ( user) {
        this.isLoading = false;
        this.buildUserForm(user);
      }
    });

    this.datepickerconfig.minDate = {year: 1970, month : 1, day: 1};
  }

  ngOnInit() {}

  // Upload profile image
  public async imageUpload(event): Promise<void> {
    const type = event.target.files[0].type.split('/')[0];
    if (type === 'image') {
      try {
        const image = await this.imageUploadService.uploadImage(event.target.files[0], this.user.uid);
        if (image) {
          this.user.photoUrl = image;
          await this.userPanelService.userUpdate(this.user);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  // Update User details
  public async updateUserData(): Promise<void> {
    const user: User = this.userForm.value;
     user.dob = this._utilsService.convertDateToMiliseconds(this.userForm.value.dob);
    if (this.userForm.valid) {
      user.canDonate = true;
    }
    const update = await this.userPanelService.userUpdate(user);
    if (update) {
      this.closeModal();
    }
  }

  // Open Modal
  open(content): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  // Close Modal
  closeModal(): void {
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any) {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  // Build User form
  private buildUserForm(user: User): void {
    this.userForm = this.fb.group({
      firstName: new FormControl(user.firstName, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      lastName: new FormControl(user.lastName, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      email: new FormControl(user.email, [Validators.email]),
      phone: new FormControl(user.phone, [Validators.required, Validators.pattern('^[0-9]*$')]),
      gender: new FormControl(user.gender, [Validators.required]),
      dob: new FormControl(this._utilsService.convertToNgbDate(user.dob), [Validators.required]),
      blood_type: new FormControl(user.blood_type, [Validators.required]),
      rh: new FormControl(user.rh, [Validators.required]),
      email_notification: new FormControl(user.email_notification),
      sms_notification: new FormControl(user.sms_notification),
    });
  }

  // Get: firstname
  get firstName() {
    return this.userForm.get('firstName');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
