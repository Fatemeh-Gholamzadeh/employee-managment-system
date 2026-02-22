import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type {
  EmployeeRow,
  DBResult,
  EmployeePostBody,
  EmployeePutBody,
  GithubUrlRow,
} from "@/types/employee-api";

//GET
export async function GETEmployyes() {
  const [rows] = await db.query<EmployeeRow[]>(
    `
    SELECT 
      e.employee_id AS employeeId,
      e.name,
      e.email,
      e.hire_date AS hireDate,
      CASE
        WHEN f.employee_id IS NOT NULL THEN 'frontend'
        WHEN b.employee_id IS NOT NULL THEN 'backend'
        WHEN d.employee_id IS NOT NULL THEN 'designer'
      END AS role,
      f.framework,
      b.language,
      d.design_tools AS designTools,
      COALESCE(f.github_url, b.github_url, d.github_url) AS githubUrl
    FROM Employee e
    LEFT JOIN FrontEndDeveloper f ON e.employee_id = f.employee_id
    LEFT JOIN BackEndDeveloper b ON e.employee_id = b.employee_id
    LEFT JOIN UIDesigner d ON e.employee_id = d.employee_id
  `
  );

  return NextResponse.json(rows as EmployeeRow[]);
}

//POST
export async function POSTEmployye(req: Request) {
  const body: EmployeePostBody = await req.json();
  const { name, email, role, githubUrl } = body;

  //insert employee
  const [result] = await db.query<DBResult>(
    "INSERT INTO Employee (name, hire_date, email) VALUES (?, CURDATE(), ?)",
    [name, email]
  );

  const employeeId = result.insertId;

  if (role === "frontend") {
    await db.query<DBResult>(
      "INSERT INTO FrontEndDeveloper (employee_id, framework, github_url) VALUES (?, 'React', ?)",
      [employeeId, githubUrl]
    );
  } else if (role === "backend") {
    await db.query<DBResult>(
      "INSERT INTO BackEndDeveloper (employee_id, language, github_url) VALUES (?, 'Node.js', ?)",
      [employeeId, githubUrl]
    );
  } else if (role === "designer") {
    await db.query<DBResult>(
      "INSERT INTO UIDesigner (employee_id, design_tools, github_url) VALUES (?, 'Figma', ?)",
      [employeeId, githubUrl]
    );
  }

  return NextResponse.json({ success: true });
}

//DELETE
export async function DELETEEmployye(
  req: Request,
  { params }: { params: { id: string } }
) {
  await db.query<DBResult>("DELETE FROM Employee WHERE employee_id = ?", [
    params.id,
  ]);

  return NextResponse.json({ success: true });
}

//PUT
export async function PUTEmployye(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body: EmployeePutBody = await req.json();
  const employeeId = params.id;

  const [rows] = await db.query<GithubUrlRow[]>(
    `
    SELECT 
      COALESCE(f.github_url, b.github_url, d.github_url) AS githubUrl
    FROM Employee e
    LEFT JOIN FrontEndDeveloper f ON e.employee_id = f.employee_id
    LEFT JOIN BackEndDeveloper b ON e.employee_id = b.employee_id
    LEFT JOIN UIDesigner d ON e.employee_id = d.employee_id
    WHERE e.employee_id = ?
    `,
    [employeeId]
  );

  const githubUrl = rows[0]?.githubUrl ?? null;

  await db.query<DBResult>(
    "DELETE FROM FrontEndDeveloper WHERE employee_id = ?",
    [employeeId]
  );
  await db.query<DBResult>(
    "DELETE FROM BackEndDeveloper WHERE employee_id = ?",
    [employeeId]
  );
  await db.query<DBResult>("DELETE FROM UIDesigner WHERE employee_id = ?", [
    employeeId,
  ]);

  if (body.role === "frontend") {
    await db.query<DBResult>(
      "INSERT INTO FrontEndDeveloper (employee_id, framework, github_url) VALUES (?, 'React', ?)",
      [employeeId, githubUrl]
    );
  } else if (body.role === "backend") {
    await db.query<DBResult>(
      "INSERT INTO BackEndDeveloper (employee_id, language, github_url) VALUES (?, 'Node.js', ?)",
      [employeeId, githubUrl]
    );
  } else if (body.role === "designer") {
    await db.query<DBResult>(
      "INSERT INTO UIDesigner (employee_id, design_tools, github_url) VALUES (?, 'Figma', ?)",
      [employeeId, githubUrl]
    );
  }

  return NextResponse.json({ success: true });
}
