import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsersPanelService} from '../users-panel.service';
import {Subscription} from 'rxjs';
import {User} from '../../models/user/user.model';

@Component({
  selector: 'app-donor-form',
  templateUrl: './donor-form.component.html',
  styleUrls: ['./donor-form.component.scss']
})
export class DonorFormComponent implements OnInit {

  @Input('displayForm') displayForm: boolean;

  @ViewChild('donorForm') donorForm: ElementRef;

  public formular: FormGroup;
  public user: User;

  private _userSub: Subscription;

  constructor(
    private _fb: FormBuilder,
    private _userService: UsersPanelService
  ) {

    this._userSub = this._userService.loggedInUser$.subscribe(
      res => this.user = res
    );
    this.buildForm();
  }

  ngOnInit() {
  }

  public onSavePDF() {
    console.log(this.donorForm.nativeElement.innerHTML);
    html2canvas(this.donorForm.nativeElement).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf');
    });
  }

  private buildForm() {
    const form = {
      q_1: 'Consideraţi că aveţi o stare bună de sănătate?',
      q_1_a: 'În ultima vreme aţi avut:',
      q_1_a_1: 'o pierdere în greutate neaşteptată',
      q_1_a_2: 'febră neexplicabilă',
      q_1_a_3: 'tratament stomatologic, vaccinări',
    };

    this.formular = this._fb.group({
      q_1: [null, [Validators.required]],
      q_1_a: [null, [Validators.required]],
      q_1_a_1: [null, [Validators.required]],
      q_1_a_2: [null, [Validators.required]],
      q_1_a_3: [null, [Validators.required]],
    });
  }

  checkForm(form) {
    console.log(form);
  }
}
