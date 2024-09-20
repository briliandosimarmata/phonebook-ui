import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUri = 'http://localhost:8080/api/v1/contact'

  constructor(private http: HttpClient) {
  }

  addContact(contact: any) {
    return this.http.post(`${this.baseUri}`, contact);
  }

  editContact(contact: any) {
    return this.http.put(`${this.baseUri}`, contact);
  }

  getContact(id: string) {
    return this.http.get(`${this.baseUri}/${id}`);
  }

  deleteContact(id: string, version: number) {
    return this.http.delete(`${this.baseUri}/${id}`, {
      params: {
        version: version
      }
    });
  }

  getAllContact() {
    return lastValueFrom(this.http.get(`${this.baseUri}`)).then(
      (res: any) => {
        return res.data;
      }
    ).catch(
      (err) => {
        throw err;
      }
    )
  }
}
