export type Role = "frontend" | "backend" | "designer";

export interface EmployeeBase {
  employeeId: number;
  name: string;
  email: string;
  hireDate: string;
  role: Role;
}
export interface FrontendDeveloper extends EmployeeBase {
  role: "frontend";
  framework: string;
  githubUrl: string;
}

export interface BackendDeveloper extends EmployeeBase {
  role: "backend";
  language: string;
  githubUrl: string;
}

export interface UIDesigner extends EmployeeBase {
  role: "designer";
  designTools: string;
  githubUrl: string;
}

export type Employee = {
  employeeId: number;
  name: string;
  email: string;
  hireDate: string;
  role: Role;
  githubUrl: string;
  framework?: string;
  language?: string;
  designTools?: string;
};
