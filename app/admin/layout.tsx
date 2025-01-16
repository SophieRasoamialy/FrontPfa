"use client";
import React from "react";
import {
  CalendarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeLink: string;
}

export default function AdminLayout({ children, activeLink }: AdminLayoutProps) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-teal-100 to-white">
      <div className="flex">
        <aside className="fixed top-0 left-0 w-64 h-screen sticky px-4 py-8 overflow-y-auto bg-white bg-opacity-30 border-r-2 border-gray-200 shadow-lg">
          <div className="flex flex-col justify-between flex-1 mt-6">
            <nav>
              <a
                className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition duration-300 ${
                  activeLink === "dashboard" ? "bg-teal-100" : "hover:bg-teal-100"
                }`}
                href="#"
              >
                <CalendarIcon className="w-5 h-5" />
                <span className="mx-4 font-medium">Dashboard</span>
              </a>

              <a
                className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg ${
                  activeLink === "emploi" ? "bg-teal-100" : "hover:bg-teal-100"
                }`}
                href="/admin/gestionEdt"
              >
                <CalendarIcon className="w-5 h-5" />
                <span className="mx-4 font-medium">Emploi du Temps</span>
              </a>

              <a
                className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg ${
                  activeLink === "etudiants" ? "bg-teal-100" : "hover:bg-teal-100"
                }`}
                href="/admin/gestionEtudiant"
              >
                <AcademicCapIcon className="w-5 h-5" />
                <span className="mx-4 font-medium">Etudiants</span>
              </a>

              <a
                className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg ${
                  activeLink === "enseignants" ? "bg-teal-100" : "hover:bg-teal-100"
                }`}
                href="/admin/gestionEnseignent"
              >
                <UserGroupIcon className="w-5 h-5" />
                <span className="mx-4 font-medium">Enseignants</span>
              </a>

              <a
                className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg ${
                  activeLink === "matieres" ? "bg-teal-100" : "hover:bg-teal-100"
                }`}
                href="/admin/gestionMatiere"
              >
                <BookOpenIcon className="w-5 h-5" />
                <span className="mx-4 font-medium">Matieres</span>
              </a>

              <a
                className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg ${
                  activeLink === "deconnexion" ? "bg-teal-100" : "hover:bg-teal-100"
                }`}
                href="#"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="mx-4 font-medium">Se déconnecter</span>
              </a>
            </nav>
          </div>
        </aside>
        <div className="flex-1  p-5">{children}</div>
      </div>
    </section>
  );
}