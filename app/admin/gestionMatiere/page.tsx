'use client';
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import AjoutModal from './modal/ajout';
import EditModal from './modal/edit';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Matiere {
    id_matiere: number;
    matiere: string;
    nom_enseignant: string;
    prenom_enseignant: string;
}

interface Niveau {
    id_niveau: number;
    niveau: string;
}

const ListMatiere: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [niveaux, setNiveaux] = useState<Niveau[]>([]);
    const [selectedNiveau, setSelectedNiveau] = useState('none');
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [matiereId, setMatiereId] = useState(0);


    useEffect(() => {
      console.log("Fetching niveaux...");
      fetchNiveaux();
    }, []);

  const fetchNiveaux = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/niveaux`);
      console.log("Niveaux reçus :", response.data);
      setNiveaux(response.data);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des niveaux', error);
    }
  };

  const handleNiveauChange = async (event: { target: { value: any; }; }) => {
    const selectedValue = event.target.value;

    if (selectedValue !== 'none') {
      setSelectedNiveau(selectedValue);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/matieres/niveau/${selectedValue}`);
        if (response.ok) {
          const data = await response.json();
          setMatieres(data);
        } else {
          console.error('Erreur lors de la récupération des matières');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des matières:', error);
      }
    }
  };

  const refreshMatieres = async () => {
    try {
      // Requête pour récupérer à nouveau les matières
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/matieres/niveau/${selectedNiveau}`);
      if (response.ok) {
        const data = await response.json();
        setMatieres(data);
      } else {
        console.error('Erreur lors de la récupération des matières');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error);
    }
  };

  const handleDeleteMatiere = (id: any) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cette matière ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Faites votre appel à l'API pour supprimer le matière avec l'ID
          await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/matieres/${id}`);
  
          // Rafraîchir la liste des matières après la suppression
          refreshMatieres();
        } catch (error) {
          console.error('Erreur lors de la suppression de la matière:', error);
        }
      }
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
    
  };

  const closeModal = () => {
    refreshMatieres();
    setIsModalOpen(false);
  };

  const openEditModal = (matiereId: number) => {
    setIsEditModalOpen(true);
    setMatiereId(matiereId);
  }

  const closeEditModal = () => {
    refreshMatieres();
    setIsEditModalOpen(false);
  }

    return (
      <div className="relative mx-auto overflow-x-auto shadow-md sm:rounded-lg">
        <div className='bg-white '>
        <div className="flex items-center justify-between py-4 px-5 bg-white">
          <div>
            
          <select
            id="niveaux"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={handleNiveauChange}
            value={selectedNiveau}
          >
            <option value="none">Choisir un niveau</option>
            {niveaux.map((niveau, index) => (
              <option key={niveau.id_niveau} value={niveau.id_niveau}>
                {niveau.niveau}
              </option>
            ))}
          </select>


          </div>
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
        <EditModal isOpen={isEditModalOpen} onClose={closeEditModal} id_matiere={matiereId} />
        </div>
        <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                
                <th scope="col" className="px-6 py-3">
                   Matiere
                </th>
                <th scope="col" className="px-6 py-3">
                    Professeur responsable
                </th>
                
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
                </tr>
            </thead>
            <tbody>
            {matieres.map((matiere) => (
                <tr key={matiere.id_matiere} className="bg-white border-b hover:bg-gray-50">
                
                <td className=" px-6 py-4">
                {matiere.matiere}
                </td>
                <td className="px-6 py-4">
                {matiere.nom_enseignant} {matiere.prenom_enseignant}
                </td>
                <td className=" flex px-6 py-4 gap-2">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-800" 
                    onClick={() => openEditModal(matiere.id_matiere)}>
                        <PencilIcon className='w-5 h-5'/>
                    </a>
                    <a href="#" className="font-medium text-red-600 hover:text-red-800" 
                    onClick={() => handleDeleteMatiere(matiere.id_matiere)} >
                        <TrashIcon className='w-5 h-5'/>
                    </a>
                </td>
                </tr>
                ))}
            </tbody>
            </table>
      </div>
    );
  };
  
  export default ListMatiere;
  