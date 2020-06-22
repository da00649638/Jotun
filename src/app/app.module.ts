import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormulationHandbookComponent } from './formulation-handbook/formulation-handbook.component';
import { UsersComponent } from './user-management/users/users.component';
import { UsersRolesComponent } from './user-management/users-roles/users-roles.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    FormulationHandbookComponent,
    UsersComponent,
    UsersRolesComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
