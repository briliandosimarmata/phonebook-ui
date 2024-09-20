import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactService } from './contact.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  protected contactForm: FormGroup;
  protected $conctacts: Promise<any[]> | undefined;

  constructor(private fb: FormBuilder, private service: ContactService) {
    this.contactForm = fb.group(
      {
        name: null,
        phoneNumber: null,
        avatar: null
      }
    );
  }

  ngOnInit(): void {
    this.doQueryAllContact();
  }


  protected onSubmit() {
    let contact = {
      name: this.contactForm.value.name,
      phoneNumber: this.contactForm.value.phoneNumber,
      avatar: ''
    }

    this.service.addContact(contact).subscribe(
      {
        next: (value) => {
          this.doQueryAllContact();
        },

        error(err) {

        },
        complete() {

        },
      }
    )
  }

  protected onFileSelected(target: any) {
    const files: FileList = target.files;
    console.log(files[0].arrayBuffer());

  }

  protected onDelete(contact: any) {
    this.service.deleteContact(contact.id, contact.version).
      then(
        () => {
          this.doQueryAllContact();
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      )
  }

  private doQueryAllContact() {
    this.$conctacts = this.service.getAllContact();
  }

}
