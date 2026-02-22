import type { RowDataPacket, OkPacket } from "mysql2";

export interface EmployeeRow extends RowDataPacket {
  employeeId: number;
  name: string;
  email: string;
  hireDate: string;
  role: "frontend" | "backend" | "designer" | null;
  framework?: string | null;
  language?: string | null;
  designTools?: string | null;
  githubUrl?: string | null;
}

export type DBResult = OkPacket;

export interface EmployeePostBody {
  name: string;
  email: string;
  role: "frontend" | "backend" | "designer";
  githubUrl: string;
}

export interface EmployeePutBody {
  role: "frontend" | "backend" | "designer";
}

export interface GithubUrlRow extends RowDataPacket {
  githubUrl: string | null;
}
