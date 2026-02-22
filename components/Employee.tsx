"use client";

import { useEffect, useState } from "react";
import type { Employee, Role } from "../types/employee";
import AddEmployeeModal from "./employeeModal";

export default function Employee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
    };

    loadEmployees();
  }, []);

  //DELETE EMPLOYEE
  const handleDelete = async (id: number) => {
    await fetch(`/api/employees?id=${id}`, { method: "DELETE" });

    setEmployees((prev) => prev.filter((e) => e.employeeId !== id));
  };

  //ADD EMPLOYEE
  const handleAdd = async (employee: Employee) => {
    await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });

    const res = await fetch("/api/employees");
    setEmployees(await res.json());
  };

  //UPDATE EMPLOYEE
  const handleRoleChange = async (id: number, role: Role) => {
    await fetch(`/api/employees?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    const res = await fetch("/api/employees");
    setEmployees(await res.json());
  };

  return (
    <div>
      <div className="w-screen h-screen flex justify-center items-center bg-orange-50">
        <div className="w-11/12 h-5/6 border-3 border-orange-400 rounded-md flex flex-col">
          {/* HEADER */}
          <div className="flex justify-between items-center p-4 border-b border-gray-400">
            <h1 className="text-3xl font-bold text-orange-400">Employees</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-400 text-white text-sm p-3 rounded-md"
            >
              + Add Employee
            </button>
          </div>
          {/* TABLE */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white border-b border-gray-400">
                <tr>
                  <th className="text-md px-2 py-3">ID</th>
                  <th className="text-md px-2 py-3">Name</th>
                  <th className="text-md px-2 py-3">Email</th>
                  <th className="text-md px-2 py-3">Hire Date</th>
                  <th className="text-md px-2 py-3">Role</th>
                  <th className="text-md px-2 py-3">Framework</th>
                  <th className="text-md px-2 py-3">Language</th>
                  <th className="text-md px-2 py-3">Design Tools</th>
                  <th className="text-md px-2 py-3">GitHub</th>
                  <th className="text-md px-2 py-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp.employeeId}
                    className="border-b border-gray-300 last:border-none text-center hover:bg-gray-50"
                  >
                    <td className="text-sm px-2 py-3 ">{emp.employeeId}</td>
                    <td className="text-sm px-2 py-3">{emp.name}</td>
                    <td className="text-sm px-2 py-3">{emp.email}</td>
                    <td className="text-sm px-2 py-3">{emp.hireDate}</td>
                    <td className="text-sm px-2 py-3">
                      <select
                        value={emp.role}
                        onChange={(e) =>
                          handleRoleChange(
                            emp.employeeId,
                            e.target.value as Role
                          )
                        }
                        className="border border-gray-300 rounded px-0.5 py-1 text-sm focus:outline-none"
                      >
                        <option value="frontend">Frontend dev</option>
                        <option value="backend">Backend dev</option>
                        <option value="designer">UI Designer</option>
                      </select>
                    </td>

                    <td className="text-sm px-2 py-3">
                      {emp.role === "frontend" ? emp.framework : "-"}
                    </td>
                    <td className="text-sm px-2 py-3">
                      {emp.role === "backend" ? emp.language : "-"}
                    </td>
                    <td className="text-sm px-2 py-3">
                      {emp.role === "designer" ? emp.designTools : "-"}
                    </td>
                    <td className="text-sm px-2 py-3">
                      <a
                        href={emp.githubUrl}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        {emp.githubUrl}
                      </a>
                    </td>

                    <td className="text-sm px-2 py-3">
                      <button
                        onClick={() => handleDelete(emp.employeeId)}
                        className="border border-gray-300 rounded px-3 py-1 text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* MODAL */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAdd}
      />
    </div>
  );
}
