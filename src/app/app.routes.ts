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
import { CreaturesAdminComponent } from './components/admin-screen/creatures/creatures-admin.component';
import { MedalsAdminScreenComponent } from './components/admin-screen/medals/medals-admin-screen.component';
import { GrumpidolarsComponent } from './components/admin-screen/grumpidolars/grumpidolars.component';
import { EnergiesComponent } from './components/admin-screen/energies/energies.component';
import { CareerComponent } from './components/rules/career/career.component';
import { CombatsComponent } from './components/rules/combats/combats.component';
import { GrumpisComponent } from './components/rules/grumpis/grumpis.component';
import { InChargeComponent } from './components/rules/in-charge/in-charge.component';
import { LeagueComponent } from './components/rules/league/league.component';
import { LegendComponent } from './components/rules/legend/legend.component';
import { MapsComponent } from './components/rules/maps/maps.component';
import { MedalsComponent } from './components/rules/medals/medals.component';
import { RestsComponent } from './components/rules/rests/rests.component';
import { ObtainEnergies } from './components/rules/energies/energies.component';
import { GrumpidolaresComponent } from './components/rules/grumpidolares/grumpidolares.component';
import { NewUserComponent } from './components/login-screen/new-user/new-user.component';
import { LeagueBadgesComponent } from './components/admin-screen/league-badges/league-badges.component';
import { ManagementComponent } from './components/admin-screen/management/management.component';
import { TrainersManagementComponent } from './components/admin-screen/management/trainers-management/trainers-management.component';
import { CreaturesManagementComponent } from './components/admin-screen/management/creatures-management/creatures-management.component';
import { LeagueBadgesManagementComponent } from './components/admin-screen/management/league-badges-management/league-badges-management.component';
import { MedalsManagementComponent } from './components/admin-screen/management/medals-management/medals-management.component';
import { EnergiesManagementComponent } from './components/admin-screen/management/energies-management/energies-management.component';
import { BattleGameComponent } from './components/battle-game/battle-game.component';
import { VirtualPetComponent } from './components/virtual-pet/virtual-pet.component';

export const routes: Routes = [
  { path: 'home', component: HomeScreenComponent },
  { path: 'newUser', component: NewUserComponent },
  { path: 'store', component: StoreScreenComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'about', component: AboutScreenComponent },
  { path: '', component: LoginScreenComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'rules/career', component: CareerComponent },
  { path: 'rules/combats', component: CombatsComponent },
  { path: 'rules/obtain-energies', component: ObtainEnergies },
  { path: 'rules/grumpidolares', component: GrumpidolaresComponent },
  { path: 'rules/grumpis', component: GrumpisComponent },
  { path: 'rules/inCharge', component: InChargeComponent },
  { path: 'rules/league', component: LeagueComponent },
  { path: 'rules/legend', component: LegendComponent },
  { path: 'rules/maps', component: MapsComponent },
  { path: 'rules/medals', component: MedalsComponent },
  { path: 'rules/rests', component: RestsComponent },
  { path: 'store/medals-store', component: MedalsStoreComponent },
  { path: 'management', component: ManagementComponent },
  {
    path: 'management/management-trainers-admin',
    component: TrainersManagementComponent,
  },
  {
    path: 'management/management-trainers-admin/edit',
    component: TrainersEditComponent,
  },
  {
    path: 'management/management-creatures',
    component: CreaturesManagementComponent,
  },
  {
    path: 'management/management-leagueBadges',
    component: LeagueBadgesManagementComponent,
  },
  {
    path: 'management/management-medals',
    component: MedalsManagementComponent,
  },
  {
    path: 'management/management-energies',
    component: EnergiesManagementComponent,
  },
  { path: 'admin', component: AdminScreenComponent },
  { path: 'admin/trainers-admin', component: TrainersAdminComponent },
  { path: 'admin/trainers-admin/edit', component: TrainersEditComponent },
  { path: 'admin/creatures', component: CreaturesAdminComponent },
  { path: 'admin/leagueBadges', component: LeagueBadgesComponent },
  { path: 'admin/medals', component: MedalsAdminScreenComponent },
  { path: 'admin/grumpidolars', component: GrumpidolarsComponent },
  { path: 'admin/energies', component: EnergiesComponent },
  { path: 'help', component: HelpComponentComponent },
  { path: 'profile/bag', component: BagComponent },
  { path: 'game', component: BattleGameComponent },
  { path: 'virtual-pet', component: VirtualPetComponent },
];
