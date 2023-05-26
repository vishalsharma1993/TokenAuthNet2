import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Employee } from "../models/employee.models";
import { Observable } from "rxjs";
import { Department } from "../models/department.model";
import { Skill } from "../models/skill.model";
@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  baseApiUrl: string = "https://localhost:7215/api/";
  constructor(private http: HttpClient) {}
  public addEmployee(addEmployeeRequest: Employee): Observable<string> {
    return this.http.post(this.baseApiUrl + "Employee", addEmployeeRequest, {
      responseType: "text",
    });
  }
  public UpdateEmployee(updateEmployeeRequest: Employee): Observable<string> {
    return this.http.post(
      this.baseApiUrl + "Employee/" + updateEmployeeRequest.id,
      updateEmployeeRequest,
      { responseType: "text" }
    );
  }
  public getDepartmentList(): Observable<Department[]> {
    return this.http.get<Department[]>(
      this.baseApiUrl + "Employee/DepartmentList"
    );
  }
  public getSkillList(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.baseApiUrl + "Employee/SkillList");
  }
  public getEmployeeList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseApiUrl + "Employee");
  }
  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(this.baseApiUrl + "Employee/" + id);
  }
  getDeleteById(employeeId: number): Observable<Employee> {
    return this.http.delete<Employee>(
      this.baseApiUrl + "Employee/" + employeeId
    );
  }
}
