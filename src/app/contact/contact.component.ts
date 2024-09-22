import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactService } from './contact.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  protected contactForm: FormGroup;
  protected $conctacts1: Promise<any[]> | undefined;
  protected notification: {
    message?: string,
    code?: string,
    type?: 'success' | 'error'
  };

  protected contact: any;
  protected contacts: any[];

  protected avatar: string | undefined;

  protected $contacts: BehaviorSubject<any[]>;

  constructor(private fb: FormBuilder, private service: ContactService,
    private domSanitizer: DomSanitizer) {
    this.contactForm = fb.group(
      {
        name: null,
        phoneNumber: null,
        avatar: null
      }
    );

    this.notification = {};

    this.$contacts = new BehaviorSubject<any[]>([]);
    this.contacts = [];
  }

  ngOnInit(): void {
    this.doQueryAllContact();
  }


  protected onSubmit() {
    let contact = {
      name: this.contactForm.value.name,
      phoneNumber: this.contactForm.value.phoneNumber,
      avatar: this.avatar ? this.avatar : ""
    }

    this.service.addContact(contact).then(
      (value: any) => {
        this.setNotificationSuccess('Contact has been sucessfully added!', 3000);
        this.doQueryAllContact();
        this.contactForm.reset();
        this.avatar = undefined;
      }
    ).catch(
      (err) => {
        this.setNotificationError(err, 3000);
      }
    );
  }

  protected async onFileSelected(target: any) {
    const files: FileList = target.files;
    if (files.length < 1) return;

    const arrBufferFile = await files[0].arrayBuffer();
    const typedArrayFile = new Uint8Array(arrBufferFile);
    const stringFile = typedArrayFile.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');

    const base64StringFile = window.btoa(stringFile);
    this.avatar = `${base64StringFile}`;
  }

  protected onDelete(contact: any) {
    this.service.deleteContact(contact.id, contact.version).
      then(
        () => {
          if (this.contact) {
            if (contact.id == this.contact.id) {
              this.contact = null;
              this.avatar = undefined;
              this.contactForm.reset();
            }
          }

          this.setNotificationSuccess('Contact has been sucessfully deleted!', 3000);
          this.doQueryAllContact();
        }
      ).catch(
        (err) => {
          this.setNotificationError(err, 3000);
        }
      )
  }

  private doQueryAllContact() {
    this.service.getAllContact().then(
      val => {
        this.contacts = val;
        this.$contacts.next(val);
      }
    ).catch(
      err => {
        this.setNotificationError(err, 3000);
      }
    )
  }

  protected toSrcFile(base64: string) {
    const srcFile = this.domSanitizer.bypassSecurityTrustUrl(
      `data:image/jpg;base64,${base64}`);

    return srcFile;
  }

  protected closeNotification() {
    this.notification = {}
  }

  private setNotificationSuccess(message: string, timeout: number) {
    this.notification = {
      message: message,
      type: 'success'
    }

    setTimeout(() => {
      this.closeNotification()
    }, timeout);
  }

  private setNotificationError(err: any, timeout: number) {
    let message;
    let code;

    if (err instanceof HttpErrorResponse) {
      if (err.error.message) {
        message = err.error.message.message;
        code = err.error.message.code;
      } else {
        message = err;
        code = 'UNKNOWN'
      }
    } else {
      message = err;
      code = 'UNKNOWN'
    }

    this.notification = {
      message: message,
      code: code,
      type: 'error'
    };

    setTimeout(() => {
      this.closeNotification()
    }, timeout);
  }

  protected onGet(contact: any) {
    this.contact = contact;
    this.avatar = contact.avatar;

    this.contactForm.patchValue(
      {
        name: contact.name,
        phoneNumber: contact.phoneNumber,
      }
    )
  }

  protected onEdit() {
    this.contact.name = this.contactForm.value.name
    this.contact.phoneNumber = this.contactForm.value.phoneNumber
    this.contact.avatar = this.avatar

    this.service.editContact(this.contact)
      .then(
        (value) => {
          this.contact.version = value.version;
          this.setNotificationSuccess('Contact has been sucessfully edited!', 3000);
          this.doQueryAllContact();
        }
      ).catch(
        (err) => {
          this.setNotificationError(err, 3000);
        }
      )
  }

  protected onCancel() {
    this.contact = null;
    this.avatar = undefined;
    this.contactForm.reset();
  }

  protected filterContacts(target?: any) {
    let filter = target.value;
    if (filter != null && filter != undefined) {
      if (filter.length > 0) {
        this.$contacts.next(
          this.contacts.filter(
            (el) => {
              let regExp = new RegExp(`[${filter.toLowerCase()}]`, 'g');
              let nameMatch = el.name.toLowerCase().match(regExp);
              let phoneNumberMatch = el.phoneNumber.toLowerCase().match(regExp);

              return nameMatch ? nameMatch.length > 0 : false
                || phoneNumberMatch ? phoneNumberMatch.length > 0 : false;
            }
          )
        );
      } else {
        this.$contacts.next(this.contacts);
      }
    } else {
      this.$contacts.next(this.contacts);
    }
  }

}
