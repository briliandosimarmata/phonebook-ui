import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected contacts: any[] = [];
  protected contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = fb.group(
      {
        name: null,
        phoneNumber: null,
        avatar: null
      }
    )
  }


  protected onSubmit() {
    console.log(this.contactForm.value);
    
  }

  protected onFileSelected(target: any) {
    const files: FileList = target.files;
    console.log(files[0].arrayBuffer());
    
  }

  protected onDelete(contact: any) {

  }

}
