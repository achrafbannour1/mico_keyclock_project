import { APP_INITIALIZER,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './front_off/Client/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PaymentComponent } from './front_off/Client/payment/payment/payment.component';
import { ProjectComponent } from './front_off/Client/project/project/project.component';
import { SheduleComponent } from './front_off/Client/schedule/shedule/shedule.component';
import { NavclComponent } from './front_off/Client/navcl/navcl.component';
import { ResourceComponent } from './front_off/Manager/resource/resource/resource.component';
import { DocumentComponent } from './front_off/Client/document/document/document.component';
import { EquipmentDetailsComponent } from './front_off/Manager/resource/equipment-details/equipment-details.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS,HttpClient, HttpClientModule} from "@angular/common/http";
import {KeycloakService} from "./services/keycloak/keycloak.service";
import {HttpTokenInterceptor} from './services/interceptor/http-token.interceptor';
import { NavadminComponent } from './back_off/admin/navadmin/navadmin.component';
import { AddresourceComponent } from './back_off/admin/Resource/addresource/addresource.component';
import { ResourcedetailsComponent } from './front_off/Manager/resource/resourcedetails/resourcedetails.component';
import { ShowadminresourceComponent } from './back_off/admin/Resource/showadminresource/showadminresource.component';
import { ResourceadmindetailsComponent } from './back_off/admin/Resource/resourceadmindetails/resourceadmindetails.component';
import { NavManagerComponent } from './front_off/Manager/nav-manager/nav-manager.component';
import { ManagersheduleComponent } from './front_off/Manager/shedule/managershedule/managershedule.component';
import { ManagertaskComponent } from './front_off/Manager/shedule/managertask/managertask.component';
import { AffectresourceComponent } from './front_off/Manager/resource/affectresource/affectresource.component';
import { AffectToolMaterialComponent } from './front_off/Manager/resource/affect-tool-material/affect-tool-material.component';
import { AffectationListComponent } from './front_off/Manager/resource/affectation-list/affectation-list.component';
import { UserManagmentComponent } from './back_off/admin/user-managment/user-managment.component';
import {NgChartsModule} from "ng2-charts";
import { UserRolesComponent } from './back_off/admin/user-roles/user-roles.component';
import { ModelComponent } from './back_off/admin/Resource/model/model.component';
import { MeetingComponent } from './back_off/admin/meeting/meeting.component';
import { ManagerMeetingComponent } from './front_off/Manager/manager-meeting/manager-meeting.component';
import { ToastrModule } from 'ngx-toastr';
import { PostTweetComponent } from './back_off/admin/Product/post-tweet/post-tweet.component';
import {FinancialComponent} from "./back_off/admin/Financial/financial/financial.component";
import {FinancialPaymentsComponent} from "./back_off/admin/Financial/financial-payments/financial-payments.component";
import {ProjectFinancialsComponent} from "./back_off/admin/Financial/project-financials/project-financials.component";
import {ProjectPaymentsComponent} from "./front_off/Client/payment/project-payments/project-payments.component";
import {SuccessComponent} from "./front_off/Client/payment/success/success.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { ProjectResourcesComponent } from './back_off/admin/Financial/project-resources/project-resources.component';
import { ProjectResourcesClientComponent } from './front_off/Client/payment/project-resources-client/project-resources-client.component';
import { WheelRouletteComponent } from './front_off/Client/wheel-roulette/wheel-roulette.component';
import { ShowadminproductsComponent } from './back_off/admin/Product/showadminproducts/showadminproducts.component';
import { AddproductComponent } from './back_off/admin/Product/addproduct/addproduct.component';
import { UpdateproductComponent } from './back_off/admin/Product/updateproduct/updateproduct.component';
import { ShowClientProductComponent } from './front_off/Client/show-client-product/show-client-product.component';
import { ClientProductDetailsComponent } from './front_off/Client/client-product-details/client-product-details.component';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatGridListModule} from "@angular/material/grid-list";
import {AngularMaterialModule} from "./angular-material.module";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {AdminViewComponent} from "./back_off/admin/blog/admin-view/admin-view.component";
import {ViewAllComponent} from "./front_off/Client/blog/view-all/view-all.component";
import {CreatePostComponent} from "./front_off/Client/blog/create-post/create-post.component";
import {ViewPostComponent} from "./front_off/Client/blog/view-post/view-post.component";
import {PostDetailComponent} from "./back_off/admin/blog/post-detail/post-detail.component";
import {EditPostComponent} from "./front_off/Client/blog/edit-post/edit-post.component";
import {DemandeComponent} from "./front_off/Client/demande/demande.component";
import {DemandeListComponent} from "./front_off/Client/demande-list/demande-list.component";
import {AdminDemandeComponent} from "./back_off/admin/admin-demande/admin-demande.component";
import {LivraisonComponent} from "./front_off/Livraison/livraison/livraison.component";
import {CartComponentComponent} from "./front_off/Client/Commande/cart-component/cart-component.component";
import {HistoryOrderComponent} from "./front_off/Client/Commande/history-order/history-order.component";
import {HistoryPayementComponent} from "./front_off/Client/Commande/history-payement/history-payement.component";
import {PostToBlogDialogComponent} from "./back_off/admin/Product/post-to-blog-dialog/post-to-blog-dialog.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

export function kcFactory(kcService:KeycloakService){
  return () => kcService.init();
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    PaymentComponent,
    ProjectComponent,
    SheduleComponent,
    NavclComponent,
    ResourceComponent,
    DocumentComponent,
    EquipmentDetailsComponent,
    NavadminComponent,
    AddresourceComponent,
    ResourcedetailsComponent,
    ShowadminresourceComponent,
    ResourceadmindetailsComponent,
    NavManagerComponent,
    ManagersheduleComponent,
    ManagertaskComponent,
    AffectresourceComponent,
    AffectToolMaterialComponent,
    AffectationListComponent,
    UserManagmentComponent,
    UserRolesComponent,
    ModelComponent,
    MeetingComponent,
    ManagerMeetingComponent,
    PostTweetComponent,

   HistoryOrderComponent,
    HistoryPayementComponent,

    FinancialComponent,
    ProjectFinancialsComponent,
    FinancialPaymentsComponent,
    ProjectPaymentsComponent,
    SuccessComponent,
    ProjectResourcesComponent,
    ProjectResourcesClientComponent,
    WheelRouletteComponent,
    ShowadminproductsComponent,
    AddproductComponent,
    UpdateproductComponent,
    ShowClientProductComponent,
    ClientProductDetailsComponent,
    AdminViewComponent,
    CreatePostComponent,
    ViewAllComponent,
    ViewPostComponent,
    PostDetailComponent,
    CartComponentComponent,
    DemandeComponent,
    DemandeListComponent,
    AdminDemandeComponent,
    LivraisonComponent,

    EditPostComponent,
    PostToBlogDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatToolbarModule,     // Ajouté pour mat-toolbar
    MatButtonModule,      // Ajouté pour les boutons
    MatSnackBarModule,    // Ajouté si vous utilisez MatSnackBar
    MatGridListModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
    }),
    AngularMaterialModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  providers: [HttpClient,
   {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    {
      provide:APP_INITIALIZER,
      deps:[KeycloakService],
      useFactory:kcFactory,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
