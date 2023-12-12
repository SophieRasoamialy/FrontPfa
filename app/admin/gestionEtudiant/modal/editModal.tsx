'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    id_etudiant:number;
  }
  
  const EditModal: React.FC<ModalProps> = ({ isOpen, onClose, id_etudiant }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [niveaux, setNiveaux] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState('none');
    const [studentPhoto, setStudentPhoto] = useState<File | null>(null);

    
    // Fonction pour envoyer les données au backend
  const handleEnregistrer = async () => {
    try {
      const formData = new FormData();
      formData.append('nom_etudiant', firstName);
      formData.append('prenom_etudiant', lastName);
      formData.append('id_niveau', selectedNiveau);

      if (studentPhoto) {
        const fileName = `images/${studentPhoto.name}`;
        formData.append('photo_etudiant', studentPhoto, fileName);
      }

    const response = await axios.put(`http://localhost:3001/api/etudiants/${id_etudiant}`, formData);


      if (response.status === 200) {
        // Gérer la réponse si nécessaire
        Swal.fire('Succès', 'Données enregistrées avec succès', 'success');
        onClose();
      } else {
        Swal.fire('Erreur', 'Erreur lors de l\'enregistrement des données', 'error');
        
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    }
  };
    
    useEffect(() => {
      fetchNiveaux();
      fetchEtudiants();
    }, []);

    async function fetchEtudiants() {
      console.log(id_etudiant);
      if(id_etudiant !== 0){
          try {
              const response = await axios.get(`http://localhost:3001/api/etudiants/${id_etudiant}`);
        
              if (response.status === 200) {
                const data = response.data;
                console.log("data");
                console.log(data);
                setFirstName(data.nom_etudiant);
                setLastName(data.prenom_etudiant);
                setSelectedNiveau(data.id_niveau); 
              }
            } catch (error) {
              console.error('Erreur lors de la récupération des matières:', error);
            }
      }
    }
  
    const fetchNiveaux = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/niveaux');
        console.log("Niveaux reçus :", response.data);
        setNiveaux(response.data);
        
      } catch (error) {
        console.error('Erreur lors de la récupération des niveaux', error);
      }
    };

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFirstName(event.target.value);
    };
  
    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLastName(event.target.value);
    };

    const handleNiveauChange = async (event: { target: { value: any; }; }) => {
      setSelectedNiveau(event.target.value);
    };
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Nouveau Etudiant</h3>
           <div>
           <form className=" rounded-lg ">
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={handleFirstNameChange}
                className="block w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter first name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={handleLastNameChange}
                className="block w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter last name"
              />
            </div>
            <div className="mb-4">
            <label htmlFor="studentPhoto" className="block text-sm font-medium text-gray-900">
              Student Photo
            </label>
            <input
              type="file"
              id="studentPhoto"
              name="studentPhoto"
              onChange={(e) => setStudentPhoto(e.target.files?.[0] || null)}
              className="block w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
            <div className='mb-4' >
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
          </form>
          </div>
          <div className='flex gap-4 mt-4'>
            <button onClick={onClose} className="font-medium text-sm bg-red-500 text-white px-4 py-2 rounded-lg">
              Close
            </button>
            <button onClick={handleEnregistrer} type="button" className=" flex text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-4 py-2 float-right">
                Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  };
export default EditModal;