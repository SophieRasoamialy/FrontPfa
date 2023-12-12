'use client';
import React from 'react';
import {
  CalendarDaysIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';
export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
    <section  >
        <div className='flex'>
            <aside className="flex flex-col sm:w-64 h-screen sticky px-4 py-8 overflow-y-auto bg-white bg-opacity-70  border-r-0 border-l">
                

                <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    <a className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg" href="#">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                        />
                    </svg>
                    <span className="mx-4 font-medium">Dashboard</span>
                    </a>

                    <a
                    className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    href="/admin/gestionEdt"
                    >
                    <CalendarDaysIcon className="w-5 h-5" />
                    <span className="mx-4 font-medium">Emploi du Temps</span>
                    </a>

                    <a
                    className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    href="/admin/gestionEtudiant"
                    >
                    <AcademicCapIcon className="w-5 h-5" />
                    <span className="mx-4 font-medium">Etudiants</span>
                    </a>

                    <a
                    className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    href="/admin/gestionEnseignent"
                    >
                    <UserGroupIcon className="w-5 h-5" />
                    <span className="mx-4 font-medium">Enseignant</span>
                    </a>

                    <a
                    className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    href="/admin/gestionMatiere"
                    >
                    <BookOpenIcon className="w-5 h-5" />
                    <span className="mx-4 font-medium">Matieres</span>
                    </a>

                    <a
                    className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    href="#"
                    >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span className="mx-4 font-medium">Se déconnecter</span>
                    </a>
                </nav>
                </div>
            </aside>
            <div className='m-10'>
            {children}
            </div>
            </div>
    </section>)
  }