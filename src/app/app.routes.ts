import { Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    {
        path: '',
        component: ContactComponent,
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
    }
];
