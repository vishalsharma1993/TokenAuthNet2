import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Department } from "src/app/models/department.model";
import { Employee } from "src/app/models/employee.models";
import { Skill } from "src/app/models/skill.model";
import { EmployeeService } from "src/app/services/employee.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-employee-add-edit",
  templateUrl: "./employee-add-edit.component.html",
  styleUrls: ["./employee-add-edit.component.css"],
})
export class EmployeeAddEditComponent implements OnInit {
  employee: Employee;
  department: Department[];
  skill: Skill[];
  profileUrl: any = "";
  progress: number;
  message: string;
  @Output() public onUploadFinished = new EventEmitter();
  picker1: any;
  form: FormGroup = new FormGroup({
    file: new FormGroup(""),
    id: new FormControl(0),
    designation: new FormControl(""),
    name: new FormControl(""),
    email: new FormControl(""),
    joiningDate: new FormControl(""),
    phone: new FormControl(""),
    department: new FormControl(""),
    skill: new FormControl(""),
    education: new FormControl(""),
  });
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private route: Router
  ) {}

  selectedFile: File;
  ngOnInit(): void {
    this.createForm();
    this.router.paramMap.subscribe({
      next: (param) => {
        const id = param.get("id");
        if (id) {
          this.employeeService.getEmployeeById(id).subscribe({
            next: (resp) => {
              this.form.patchValue({
                id: resp.id,
                email: resp.email,
                name: resp.name,
                joiningDate: resp.joiningDate,
                phone: resp.phone,
                department: resp.department,
                skill: resp.skill,
                education: resp.education,
              });
              this.profileUrl = resp.file;
            },
          });
        }
      },
    });
    this.departmentList();
    this.skillList();
  }
  createForm() {
    this.form = this.fb.group({
      id: [0],
      name: ["", Validators.required],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      joiningDate: ["", Validators.required],
      phone: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      department: ["", Validators.required],
      skill: ["", Validators.required],
      education: ["", Validators.required],
    });
  }
  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);
    this.http
      .post("https://localhost:7215/api/Employee/upload", formData, {
        reportProgress: true,
        observe: "events",
      })
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round(100 * event.loaded);
          else if (event.type === HttpEventType.Response) {
            this.message = "Upload success.";
            this.onUploadFinished.emit(event.body);
            this.profileUrl =
              "https://localhost:7215" +
              "/Resources/Images/" +
              fileToUpload.name;
            localStorage.setItem("ImageURL", this.profileUrl);
          }
        },
        error: (err: HttpErrorResponse) => console.log(err),
      });
  };
  onSubmit(): void {
    if (this.form.invalid) {//for testing
      this.toastr.error("Please Enter Required Fields.", "error");
    } else {
      if (this.form.value.id == undefined|| this.form.value.id == 0) {
        this.form.value.file = localStorage.getItem("ImageURL");
        this.employee = this.form.value;
        this.employeeService.addEmployee(this.employee).subscribe({
          next: (data) => {
            this.route.navigate(["employeelist"]);
            this.onReset();

            this.toastr.success("Added Records.", "Success");
          },
          error: (data) => {
            console.warn(data.error);
          },
        });
      } else {
        this.form.value.file = localStorage.getItem("ImageURL");
        this.employee = this.form.value;
        this.employeeService.UpdateEmployee(this.employee).subscribe({
          next: (data) => {
            this.route.navigate(["employeelist"]);
            this.onReset();
            this.toastr.success("Updated Records.", "Success");
          },
          error: (data) => {
            console.warn(data.error);
          },
        });
      }
    }
  }
  departmentList() {
    this.employeeService.getDepartmentList().subscribe({
      next: (data) => {
        this.department = data;
      },
    });
  }
  skillList() {
    this.employeeService.getSkillList().subscribe({
      next: (data) => {
        this.skill = data;
      },
    });
  }
  onReset(): void {
    this.form.reset();
  }
}
