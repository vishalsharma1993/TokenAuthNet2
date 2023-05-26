import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { WeatherClient } from "src/app/clients/weather.client";
import { Employee } from "src/app/models/employee.models";
import { AuthenticationService } from "src/app/services/authentication.service";
import { EmployeeService } from "src/app/services/employee.service";

@Component({
  selector: "app-employeelist",

  templateUrl: "./employeelist.component.html",

  styleUrls: ["./employeelist.component.css"],
})
export class EmployeelistComponent implements OnInit {
  employee: Employee[];
  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService
  ) {}
  ngOnInit(): void {
    this.getEmployeeList();
  }
  deleteEmp(employeeId: number) {
    this.employeeService.getDeleteById(employeeId).subscribe({
      next: (resp) => {
        this.getEmployeeList();
        this.toastr.success("Delete Records Successfully.", "Success");
      },
    });
  }
  getEmployeeList() {
    this.employeeService.getEmployeeList().subscribe({
      next: (data) => {
        this.employee = data;
      },
    });
  }
}
