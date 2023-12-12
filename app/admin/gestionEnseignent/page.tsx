'use client';
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import AjoutModal from './modal/ajout';
import EditModal from './modal/edit';
import axios from 'axios';
import Swal from 'sweetalert2';


const ListProf: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [enseignants, setEnseignants] = useState([]);
    const [enseignantId, setEnseignantId] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        fetchEnseignants(currentPage);
    }, []);

    const fetchEnseignants = async (page: number) => {
      console.log('here');
      try {
        const response = await axios.get(`http://localhost:3001/api/enseignants?page=${page}&limit=${itemsPerPage}`);
        if (response.status === 200) {
          setEnseignants(response.data);
        } else {
          console.error('Erreur lors de la récupération des enseignants');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des enseignants:', error);
      }
    };

    const refreshEnseignants = async () => {
      try {
        // Requête pour récupérer à nouveau les matières
        const response = await fetch(`http://localhost:3001/api/enseignants`);
        if (response.ok) {
          const data = await response.json();
          setEnseignants(data);
        } else {
          console.error('Erreur lors de la récupération des enseignants');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des enseignants:', error);
      }
    };

    const handleDeleteEnseignant = (id: any) => {
      Swal.fire({
        title: 'Êtes-vous sûr de vouloir supprimer cet enseignant ?',
        text: "Cette action est irréversible !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer !'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            
            await axios.delete(`http://localhost:3001/api/enseignants/${id}`);
    
            refreshEnseignants();
          } catch (error) {
            console.error('Erreur lors de la suppression de l\'enseignant:', error);
          }
        }
      });
    };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    refreshEnseignants();
  };

  const openEditModal = (enseignantId: number) => {
    setIsEditModalOpen(true);
    setEnseignantId(enseignantId);
    
  }

  const closeEditModal = () => {
    refreshEnseignants();
    setIsEditModalOpen(false);
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    fetchEnseignants(currentPage + 1); // Ajoutez l'appel pour récupérer les données de la page suivante
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchEnseignants(currentPage - 1); // Ajoutez l'appel pour récupérer les données de la page précédente
    }
  };
  
  

    return (
      <div className="relative mx-auto overflow-x-auto shadow-md sm:rounded-lg">
        <div className='bg-white '>
        <div className="flex items-center justify-between py-4 px-5 bg-white">
          <div></div>
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="text" id="table-search-users" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Chercher ..."/>
          </div>
        </div>
        <button onClick={openModal} type="button" className=" m-2 flex text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5 float-right">
            <PlusIcon className='w-5 h-5'/>Nouveau
        </button> 
        <AjoutModal isOpen={isModalOpen} onClose={closeModal} />
        <EditModal isOpen={isEditModalOpen} onClose={closeEditModal} id_enseignant={enseignantId} />
        </div>
        <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                
                <th scope="col" className="px-6 py-3">
                   Nom et prenom
                </th>
                <th scope="col" className="px-6 py-3">
                    Matiere enseigne
                </th>
                
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
                </tr>
            </thead>
            <tbody>
            {enseignants.map((enseignant) => (
                <tr className="bg-white border-b hover:bg-gray-50" key={enseignant.id_enseignant}>
                
                <td className=" px-6 py-4">
                {enseignant.nom_enseignant}  {enseignant.prenom_enseignant}
                </td>
                <td className="px-6 py-4">
                {enseignant.matiere}
                </td>
                
                <td className=" flex px-6 py-4 gap-2">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-800" 
                    onClick={() => openEditModal(enseignant.id_enseignant)}>
                        <PencilSquareIcon className='w-5 h-5'/>
                    </a>
                    <a href="#" className="font-medium text-red-600 hover:text-red-800" 
                    onClick={() => handleDeleteEnseignant(enseignant.id_enseignant)} >
                        <TrashIcon className='w-5 h-5'/>
                    </a>
                
                </td>
                </tr>
                ))}
            </tbody>
            </table>

            <div className="py-4 flex justify-between items-center">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-gray-200 py-2 px-4 text-gray-700 rounded"
            >
              <ChevronDoubleLeftIcon className='w-5 h-5'/>
            </button>
            <button
              onClick={handleNextPage}
              className="bg-gray-200 py-2 px-4 text-gray-700 rounded"
            >
              <ChevronDoubleRightIcon className='w-5 h-5'/>
            </button>
          </div>
      </div>
    );
  };
  
  export default ListProf;
  