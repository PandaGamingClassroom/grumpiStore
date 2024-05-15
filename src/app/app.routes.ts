import { Routes } from '@angular/router';
import { StoreScreenComponent } from './components/store-screen/store-screen.component';
import { HomeScreenComponent } from './components/home-screen/home-screen.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutScreenComponent } from './components/about-screen/about-screen.component';
import { LoginScreenComponent } from './components/login-screen/login-screen.component';
import { RulesComponent } from './components/rules/rules.component';
import { MedalsStoreComponent } from './components/store-screen/medals-store/medals-store.component';
import { AdminScreenComponent } from './components/admin-screen/admin-screen.component';
import { HelpComponentComponent } from './components/help-component/help-component.component';
import { BagComponent } from './components/profile/bag/bag/bag.component';
import { TrainersAdminComponent } from './components/admin-screen/trainers/trainers-admin/trainers-admin.component';
import { TrainersEditComponent } from './components/admin-screen/trainers/trainers-edit/trainers-edit.component';

export const routes: Routes = [
  { path: 'home', component: HomeScreenComponent },
  { path: 'store', component: StoreScreenComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'about', component: AboutScreenComponent },
  { path: '', component: LoginScreenComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'store/medals-store', component: MedalsStoreComponent },
  { path: 'admin', component: AdminScreenComponent },
  { path: 'admin/trainers-admin', component: TrainersAdminComponent },
  { path: 'admin/trainers-admin/edit', component: TrainersEditComponent },
  { path: 'help', component: HelpComponentComponent },
  { path: 'profile/bag', component: BagComponent },
];
