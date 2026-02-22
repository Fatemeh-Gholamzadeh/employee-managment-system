"use client";

import { useState } from "react";
import type { Employee, Role } from "../types/employee";
import type { Props } from "@/types/modal";

type Errors = {
  name?: string;
  email?: string;
  githubUrl?: string;
};

export default function AddEmployeeModal({ isOpen, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "frontend" as Role,
    githubUrl: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  if (!isOpen) return null;

  //VALIDATORs
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidGithub = (url: string) =>
    /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(url);

  //SUBMIT
  const handleSubmit = () => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.githubUrl.trim()) {
      newErrors.githubUrl = "GitHub URL is required";
    } else if (!isValidGithub(formData.githubUrl)) {
      newErrors.githubUrl = "Invalid GitHub URL";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newEmployee: Employee = {
      employeeId: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      githubUrl: formData.githubUrl.trim(),
      hireDate: new Date().toISOString().slice(0, 10),
      framework: formData.role === "frontend" ? "React" : undefined,
      language: formData.role === "backend" ? "Node.js" : undefined,
      designTools: formData.role === "designer" ? "Figma" : undefined,
    };

    onSave(newEmployee);
    onClose();

    // reset
    setFormData({
      name: "",
      email: "",
      role: "frontend",
      githubUrl: "",
    });
    setErrors({});
  };

  //CLOSE MODAL
  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      role: "frontend",
      githubUrl: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-orange-50 w-96 rounded-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-orange-400 mb-4">Add Employee</h2>

        {/* NAME */}
        <input
          className={`w-full mb-1 p-2 border rounded text-sm ${
            errors.name ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Name"
          value={formData.name}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ ...formData, name: value });

            if (value.trim().length >= 3) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mb-2">{errors.name}</p>
        )}

        {/* EMAIL */}
        <input
          className={`w-full mb-1 p-2 border rounded text-sm ${
            errors.email ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Email"
          value={formData.email}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ ...formData, email: value });

            if (isValidEmail(value)) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mb-2">{errors.email}</p>
        )}

        {/* ROLE */}
        <select
          className="w-full mb-3 p-2 border border-gray-300 rounded text-sm"
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value as Role })
          }
        >
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="designer">Designer</option>
        </select>

        {/* GITHUB */}
        <input
          className={`w-full mb-1 p-2 border rounded text-sm ${
            errors.githubUrl ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="GitHub URL"
          value={formData.githubUrl}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ ...formData, githubUrl: value });

            if (isValidGithub(value)) {
              setErrors((prev) => ({ ...prev, githubUrl: undefined }));
            }
          }}
        />
        {errors.githubUrl && (
          <p className="text-xs text-red-500 mb-3">{errors.githubUrl}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-orange-400 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
