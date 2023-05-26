import { RegisterPageComponent } from "./register-page/register-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { AuthGuard } from "./helpers/auth.guard";
import { SecretComponent } from "./secret/secret.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmployeelistComponent } from "./employee/employeelist/employeelist.component";
import { EmployeeAddEditComponent } from "./employee/employee-add-edit/employee-add-edit.component";

const routes: Routes = [
  {
    path: "secret",
    component: SecretComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "",
    component: LoginPageComponent,
  },
  {
    path: "employee",
    component: EmployeeAddEditComponent,
  },
  {
    path: "employee/edit/:id",
    component: EmployeeAddEditComponent,
  },
  {
    path: "employee/delete/:id",
    component: EmployeeAddEditComponent,
  },
  {
    path: "employeelist",
    component: EmployeelistComponent,
  },
  {
    path: "register",
    component: RegisterPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
