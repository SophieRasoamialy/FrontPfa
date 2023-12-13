'use client';
import React, { useState, useEffect } from 'react';
import { PlusIcon, InformationCircleIcon,PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import Swal from 'sweetalert2';
import AjoutModal from './modal/ajoutModal';
import InfoModal from './modal/infoModal';
import EditModal from './modal/editModal';


const ListEtudiant: React.FC = () => {
    const [isAjoutModalOpen, setIsAjoutModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [niveaux, setNiveaux] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState('none');
    const [etudiants, setEtudiants] = useState([]);
    const [etudiantId, setEtudiantId] = useState(0);

  
  useEffect(() => {
    console.log("Fetching niveaux...");
    fetchNiveaux();
  }, []);

  const fetchNiveaux = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/niveaux');
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
        const response = await fetch(`http://localhost:3001/api/etudiants/niveau/${selectedValue}/etudiants`);
        if (response.ok) {
          const data = await response.json();
          setEtudiants(data);
        } else {
          console.error('Erreur lors de la récupération des etudiants');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des etudiants:', error);
      }
    }
  };

  const refreshEtudiants = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/etudiants/niveau/${selectedNiveau}/etudiants`);
      if (response.ok) {
        const data = await response.json();
        setEtudiants(data);
      } else {
        console.error('Erreur lors de la récupération des etudiants');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des etudiants:', error);
    }
  }

  const handleDeleteEtudiant = (id: any) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cet etudiant ?',
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
          await axios.delete(`http://localhost:3001/api/etudiants/${id}`);
  
          // Rafraîchir la liste des matières après la suppression
          refreshEtudiants();
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'etudiant:', error);
        }
      }
    });
  };

  const openAjoutModal = () => {
    setIsAjoutModalOpen(true);
  };

  const closeAjoutModal = () => {
    refreshEtudiants();
    setIsAjoutModalOpen(false);
  };

  const openInfoModal = ( id_etudiant:number) => {
    
    setEtudiantId(id_etudiant);
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  };
  const openEditModal = ( id_etudiant:number) => {
    setEtudiantId(id_etudiant);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    refreshEtudiants();
    setIsEditModalOpen(false);
  };

    return (
      <div className="relative mx-auto flex items-center justify-center overflow-x-auto shadow-md sm:rounded-lg">
        <div>
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
          <label htmlFor="table-search" className="sr-only">Chercher</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="text" id="table-search-users" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Chercher des etudiants" />
          </div>
        </div>
        <button onClick={openAjoutModal} type="button" className=" flex text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 float-right">
            <PlusIcon className='w-5 h-5'/>Nouveau
        </button> 
        <AjoutModal isOpen={isAjoutModalOpen} onClose={closeAjoutModal} />
        {etudiantId !==0 &&(<InfoModal isOpen={isInfoModalOpen} onClose={closeInfoModal}  id_etudiant={etudiantId}/> )}
        {etudiantId !==0 &&(<EditModal isOpen={isEditModalOpen} onClose={closeEditModal} id_etudiant={etudiantId} />)}
        </div>
        <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3">
                    Num matricule
                </th>
                <th scope="col" className="px-6 py-3">
                    Nom et prenom
                </th>
                <th scope="col" className="px-6 py-3">
                    nombre d'absence
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
                </tr>
            </thead>
            <tbody>
              {etudiants.map(etudiant => (
                <tr className="bg-white border-b hover:bg-gray-50" key={etudiant.id_etudiant}>
                <td className=" items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                    
                    <div className="text-base text-center font-semibold">{etudiant.id_etudiant}</div>
                    
                </td>
                <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                    <img className="w-10 h-10 rounded-full" src={`/etudiant/${etudiant.photo_etudiant}`} alt="photo" />
                    <div className="pl-3">
                    <div className="text-base font-semibold">{etudiant.nom_etudiant}  </div>
                    <div className="text-base font-semibold">{etudiant.prenom_etudiant} </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-center">
                   {etudiant.nombre_absences}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div> {etudiant.status}
                    </div>
                </td>
                <td className="px-6 py-4 flex gap-2">
                    <a href="#" className="font-medium text-green-600 hover:text-green-800" onClick={() => openInfoModal(etudiant.id_etudiant)}>
                        <InformationCircleIcon className='w-5 h-5'/>
                    </a>
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-800" onClick={()=> openEditModal(etudiant.id_etudiant)} >
                        <PencilSquareIcon className='w-5 h-5'/>
                    </a>
                    <a href="#" className="font-medium text-red-600 hover:text-red-800" onClick={() => handleDeleteEtudiant(etudiant.id_etudiant)} >
                        <TrashIcon className='w-5 h-5'/>
                    </a>
                </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    );
  };
  
  export default ListEtudiant;
  