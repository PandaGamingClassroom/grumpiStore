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
import { BattleGameComponent } from './components/battle-game/battle-game.component';
import { VirtualPetComponent } from './components/virtual-pet/virtual-pet.component';
import { AboutTheAppComponent } from './components/about-the-app/about-the-app.component';
import { BlogScreenComponent } from './components/admin-screen/profesor-admin/blog/blog-screen.component';
import { BlogComponent } from './components/blog/blog.component';
import { WebScreenComponent } from './components/web-screen/web-screen.component';
import { IntroComponent } from './components/rules/intro/intro.component';

/**
 * ADMINISTRADORs
 */
import { RulesAdminComponent } from './components/admin-screen/rules-admin/rules-admin.component';
import { CareerAdminComponent } from './components/admin-screen/rules-admin/career-admin/career-admin.component';
import { CombatsAdminComponent } from './components/admin-screen/rules-admin/combats-admin/combats-admin.component';
import { ObtainEnergiesAdmin } from './components/admin-screen/rules-admin/energies-admin/energies-admin.component';
import { GrumpidolaresAdminComponent } from './components/admin-screen/rules-admin/grumpidolares-admin/grumpidolares-admin.component';
import { GrumpisAdminComponent } from './components/admin-screen/rules-admin/grumpis-admin/grumpis-admin.component';
import { InChargeAdminComponent } from './components/admin-screen/rules-admin/in-charge-admin/in-charge-admin.component';
import { LeagueAdminComponent } from './components/admin-screen/rules-admin/league-admin/league-admin.component';
import { LegendAdminComponent } from './components/admin-screen/rules-admin/legend-admin/legend-admin.component';
import { MapsAdminComponent } from './components/admin-screen/rules-admin/maps-admin/maps-admin.component';
import { MedalsAdminComponent } from './components/admin-screen/rules-admin/medals-admin/medals-admin.component';
import { RestsAdminComponent } from './components/admin-screen/rules-admin/rests-admin/rests-admin.component';
import { IntroAdminComponent } from './components/admin-screen/rules-admin/intro-admin/intro-admin.component';
import { DashboardComponent } from './components/admin-screen/dashbard/dashboard.component';
import { RewardsComponent } from './components/admin-screen/rewards/rewards.component';


export const routes: Routes = [
  { path: 'home', component: HomeScreenComponent },
  { path: 'newUser', component: NewUserComponent },
  { path: 'store', component: StoreScreenComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'about', component: AboutScreenComponent },
  { path: 'about-the-app', component: AboutTheAppComponent },
  { path: '', component: LoginScreenComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'rules/intro', component: IntroComponent },
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

  { path: 'help', component: HelpComponentComponent },
  { path: 'profile/bag', component: BagComponent },
  { path: 'game', component: BattleGameComponent },
  { path: 'virtual-pet', component: VirtualPetComponent },
  { path: 'blog', component: BlogComponent },

  { path: 'web', component: WebScreenComponent },

  /**
   *
   * RUTAS DE GUÍA GRUMPI PARA EL ADMINISTRADOR
   *
   */
  { path: 'rules_admin', component: RulesAdminComponent },
  { path: 'rules_admin/intro_admin', component: IntroAdminComponent },
  { path: 'rules_admin/career_admin', component: CareerAdminComponent },
  { path: 'rules_admin/combats_admin', component: CombatsAdminComponent },
  { path: 'rules_admin/obtain-energies_admin', component: ObtainEnergiesAdmin },
  {
    path: 'rules_admin/grumpidolares_admin',
    component: GrumpidolaresAdminComponent,
  },
  { path: 'rules_admin/grumpis_admin', component: GrumpisAdminComponent },
  { path: 'rules_admin/inCharge_admin', component: InChargeAdminComponent },
  { path: 'rules_admin/league_admin', component: LeagueAdminComponent },
  { path: 'rules_admin/legend_admin', component: LegendAdminComponent },
  { path: 'rules_admin/maps_admin', component: MapsAdminComponent },
  { path: 'rules_admin/medals_admin', component: MedalsAdminComponent },
  { path: 'rules_admin/rests_admin', component: RestsAdminComponent },

  { path: 'store/medals-store', component: MedalsStoreComponent },
  {
    path: 'management/management-trainers-admin/edit',
    component: TrainersEditComponent,
  },
  { path: 'admin', component: AdminScreenComponent },
  { path: 'admin/trainers-admin', component: TrainersAdminComponent },
  { path: 'admin/trainers-admin/edit', component: TrainersEditComponent },
  { path: 'admin/creatures', component: CreaturesAdminComponent },
  { path: 'admin/leagueBadges', component: LeagueBadgesComponent },
  { path: 'admin/medals', component: MedalsAdminScreenComponent },
  { path: 'admin/grumpidolars', component: GrumpidolarsComponent },
  { path: 'admin/energies', component: EnergiesComponent },
  { path: 'admin/blog-admin', component: BlogScreenComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/rewards-admin', component: RewardsComponent },
];
