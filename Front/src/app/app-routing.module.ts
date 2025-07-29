import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './front_off/Client/home/home.component';

import { PaymentComponent } from './front_off/Client/payment/payment/payment.component';
import { ProjectComponent } from './front_off/Client/project/project/project.component';
import { SheduleComponent } from './front_off/Client/schedule/shedule/shedule.component';
import { ResourceComponent } from './front_off/Manager/resource/resource/resource.component';
import { DocumentComponent } from './front_off/Client/document/document/document.component';
import { EquipmentDetailsComponent } from './front_off/Manager/resource/equipment-details/equipment-details.component';
import { NavadminComponent } from './back_off/admin/navadmin/navadmin.component';
import { AddresourceComponent } from './back_off/admin/Resource/addresource/addresource.component';
import { ResourcedetailsComponent } from './front_off/Manager/resource/resourcedetails/resourcedetails.component';
import { ShowadminresourceComponent } from './back_off/admin/Resource/showadminresource/showadminresource.component';
import { ResourceadmindetailsComponent } from './back_off/admin/Resource/resourceadmindetails/resourceadmindetails.component';
import { ManagersheduleComponent } from './front_off/Manager/shedule/managershedule/managershedule.component';
import { ManagertaskComponent } from './front_off/Manager/shedule/managertask/managertask.component';
import { AffectresourceComponent } from './front_off/Manager/resource/affectresource/affectresource.component';
import { AffectToolMaterialComponent } from './front_off/Manager/resource/affect-tool-material/affect-tool-material.component';
import { AffectationListComponent } from './front_off/Manager/resource/affectation-list/affectation-list.component';
import { adminGuard } from './services/guard/admin.guard';
import { managerGuard } from './services/guard/manager.guard';
import { UserManagmentComponent } from './back_off/admin/user-managment/user-managment.component';
import { UserRolesComponent } from './back_off/admin/user-roles/user-roles.component';
import { ModelComponent } from './back_off/admin/Resource/model/model.component';
import { MeetingComponent } from './back_off/admin/meeting/meeting.component';
import { ManagerMeetingComponent } from './front_off/Manager/manager-meeting/manager-meeting.component';
import { PostTweetComponent } from './back_off/admin/Product/post-tweet/post-tweet.component';
import { FinancialComponent } from './back_off/admin/Financial/financial/financial.component';
import { ProjectFinancialsComponent } from './back_off/admin/Financial/project-financials/project-financials.component';
import { FinancialPaymentsComponent } from './back_off/admin/Financial/financial-payments/financial-payments.component';
import { ProjectPaymentsComponent } from './front_off/Client/payment/project-payments/project-payments.component';
import { SuccessComponent } from './front_off/Client/payment/success/success.component';
import { ProjectResourcesComponent } from './back_off/admin/Financial/project-resources/project-resources.component';
import { ProjectResourcesClientComponent } from './front_off/Client/payment/project-resources-client/project-resources-client.component';
import { WheelRouletteComponent } from './front_off/Client/wheel-roulette/wheel-roulette.component';
import { ShowadminproductsComponent } from './back_off/admin/Product/showadminproducts/showadminproducts.component';
import { AddproductComponent } from './back_off/admin/Product/addproduct/addproduct.component';
import { UpdateproductComponent } from './back_off/admin/Product/updateproduct/updateproduct.component';
import {ShowClientProductComponent} from "./front_off/Client/show-client-product/show-client-product.component";
import {
  ClientProductDetailsComponent
} from "./front_off/Client/client-product-details/client-product-details.component";
import {CreatePostComponent} from "./front_off/Client/blog/create-post/create-post.component";
import {ViewAllComponent} from "./front_off/Client/blog/view-all/view-all.component";
import {ViewPostComponent} from "./front_off/Client/blog/view-post/view-post.component";
import {EditPostComponent} from "./front_off/Client/blog/edit-post/edit-post.component";
import {AdminViewComponent} from "./back_off/admin/blog/admin-view/admin-view.component";
import {PostDetailComponent} from "./back_off/admin/blog/post-detail/post-detail.component";
import {DemandeComponent} from "./front_off/Client/demande/demande.component";
import {DemandeListComponent} from "./front_off/Client/demande-list/demande-list.component";
import {AdminDemandeComponent} from "./back_off/admin/admin-demande/admin-demande.component";
import {LivraisonComponent} from "./front_off/Livraison/livraison/livraison.component";
import {CartComponentComponent} from "./front_off/Client/Commande/cart-component/cart-component.component";
import {HistoryPayementComponent} from "./front_off/Client/Commande/history-payement/history-payement.component";
import {HistoryOrderComponent} from "./front_off/Client/Commande/history-order/history-order.component";

const routes: Routes = [
  {
    path: 'client',
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'panier', component: CartComponentComponent },
      { path: 'historyPqayment', component: HistoryPayementComponent },

      { path: 'payment', component: PaymentComponent },
      { path: 'products', component: ShowClientProductComponent },
      { path: 'product-details/:id', component: ClientProductDetailsComponent },
      { path: 'project-payments/:projectId', component: ProjectPaymentsComponent },
      { path: 'project', component: ProjectComponent },
      { path: 'project-resources/:projectName', component: ProjectResourcesClientComponent },
      { path: 'shedule', component: SheduleComponent },
      { path: 'document', component: DocumentComponent },
      { path: 'wheel-roulette', component: WheelRouletteComponent },
      { path: 'user-management', component: UserManagmentComponent },
      { path: 'success', component: SuccessComponent },
      { path: 'cancel', component: ProjectPaymentsComponent },
      {path:'blog/create-post',component:CreatePostComponent},
      {path:'blog/view-all',component:ViewAllComponent},
      {path:'blog/view-post/:id',component:ViewPostComponent},
      { path: 'blog/edit-post/:id', component: EditPostComponent },
      { path: 'demande', component: DemandeComponent },
      { path: 'demandelist', component: DemandeListComponent },
      { path: 'livraison', component: LivraisonComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', component: NavadminComponent },
      { path: 'products', component: ShowadminproductsComponent },
      { path: 'post-tweet', component: PostTweetComponent },
      { path: 'historyOrder', component: HistoryOrderComponent },
      { path: 'updateproduct/:id', component: UpdateproductComponent }, // Fixed path
      { path: 'addproduct', component: AddproductComponent },
      { path: 'resource', component: ShowadminresourceComponent },
      { path: 'resourceDetails/:id', component: ResourceadmindetailsComponent },
      { path: 'addresource', component: AddresourceComponent },
      { path: 'post-tweet', component: PostTweetComponent },
      { path: 'user-management', component: UserManagmentComponent },
      { path: 'user-roles/:userId', component: UserRolesComponent },
      { path: 'model/:brand', component: ModelComponent },
      { path: 'meeting', component: MeetingComponent },
      { path: 'financial', component: FinancialComponent },
      { path: 'project-financials/:projectId', component: ProjectFinancialsComponent },
      { path: 'financial-payments/:financialId', component: FinancialPaymentsComponent },
      { path: 'project-resources/:projectName', component: ProjectResourcesComponent },
      { path: 'blog', component: AdminViewComponent },
      { path: 'demandeadmin', component: AdminDemandeComponent },
      { path: 'post/:id', component: PostDetailComponent },
    ]
  },
  {
    path: 'Manager',
   // canActivate: [managerGuard],
    children: [
      { path: 'schedule', component: ManagersheduleComponent },
      { path: 'task', component: ManagertaskComponent },
      { path: 'resource', component: ResourceComponent },
      { path: 'equipmentDetails/:id', component: EquipmentDetailsComponent },
      { path: 'resourceDetails/:id', component: ResourcedetailsComponent },
      { path: 'affectResource/:id', component: AffectresourceComponent },
      { path: 'affectations', component: AffectationListComponent },
      { path: 'affectToolMaterial/:id', component: AffectToolMaterialComponent },
      { path: 'meeting', component: ManagerMeetingComponent },
    ]
  },
  { path: '', redirectTo: '/client/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/client/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
