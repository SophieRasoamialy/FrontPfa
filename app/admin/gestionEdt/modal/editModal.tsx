'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    edtId: number;
  }
  
  const EditModal: React.FC<ModalProps> = ({ isOpen, onClose,edtId }) => {
    const [salle, setSalle] = useState('');
    const [listSalle, setListSalle] = useState([]);
    const [selectedMatiere, setSelectedMatiere] = useState('');
    const [listMatiere, setListMatiere] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(0);
    const [niveaux, setNiveaux] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [heureDeb, setHeureDeb] = useState('');
    const [heureFin, setHeureFin] = useState('');

    useEffect(() => {
      fetchNiveaux();
      fetchSalle();
      fetchEdt();
      
    }, []);

  const  fetchEdt = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/edt/id/${edtId}`);
      setSelectedNiveau(response.data.id_niveau);
      setSelectedMatiere(response.data.id_matiere);
      setSalle(response.data.id_salle);
      setSelectedDate(response.data.date);
      setHeureDeb(response.data.heure);
      setHeureFin(response.data.heure_fin);

      fetchMatiere(response.data.id_niveau);
    } catch (error) {
      console.error('Erreur lors de la récupération des donnees', error);
    }
  };

  const fetchNiveaux = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/niveaux');
      setNiveaux(response.data);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des niveaux', error);
    }
  };

  const fetchSalle= async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/salles');
      setListSalle(response.data);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des salles', error);
    }
  };

  const fetchMatiere= async (niveau:number) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/matieres/niveau/${niveau}`);
      setListMatiere(response.data);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des matieres', error);
    }
  };

  const handleEnregistrer = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/api/edt/${edtId}`, {
        date:selectedDate,
        heure:heureDeb,
        heure_fin:heureFin,
        id_niveau:selectedNiveau,
        id_matiere:selectedMatiere,
        id_salle:salle,
      });

      if (response.status === 200) {
        // Gérer la réponse si nécessaire
        Swal.fire('Succès', 'Données mis a jour avec succès', 'success');
        onClose();
      } else {
        Swal.fire('Erreur', 'Erreur lors de l\'enregistrement des données', 'error');
        
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    }
  }

  const handleMatiereChange = async (event: { target: { value: any; }; }) => {
    const selectedValue = event.target.value;

    if (selectedValue !== 'none') {
      setSelectedMatiere(selectedValue);
    }
  };


    const handleNiveauChange = async (event: { target: { value: any; }; }) => {
      const selectedValue = event.target.value;
  
      if (selectedValue !== 'none') {
        console.log("hihaaaa");
        setSelectedNiveau(selectedValue);
        fetchMatiere(selectedValue);
      }
    };

    const handleSalleChange = async (event: { target: { value: any; }; }) => {
      const selectedValue = event.target.value;
  
      if (selectedValue !== 'none') {
        setSalle(selectedValue);
      }
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedDate(event.target.value);
    };

    const handleHeureDeb = (event:React.ChangeEvent<HTMLInputElement>) => {
      setHeureDeb(event.target.value);
    };

    const handleHeureFin = (event:React.ChangeEvent<HTMLInputElement>) => {
      setHeureFin(event.target.value);
    };
  
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Emploie du temps</h3>
           <div>
           <form className=" rounded-lg ">
            <div className="mb-4">
              <label htmlFor="matiere" className="block text-sm font-medium text-gray-900">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="prof" className="block text-sm font-medium text-gray-900">
                Heure de debut
              </label>
              <input
                type="time"
                value={heureDeb}
                onChange={handleHeureDeb}
              />
              <label htmlFor="prof" className="block text-sm font-medium text-gray-900">
                Heure de sortie
              </label>
              <input
                type="time"
                value={heureFin}
                onChange={handleHeureFin}
              />
            </div>
            <div className="mb-4">
            <label htmlFor="prof" className="block text-sm font-medium text-gray-900">
              Niveau
            </label>
              <select
                  id="niveaux"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onChange={handleNiveauChange}
                  value={selectedNiveau}
                >
                  <option value={0}>Choisir un niveau</option>
                  {niveaux.map((niveau, index) => (
                    <option key={niveau.id_niveau} value={niveau.id_niveau}>
                      {niveau.niveau}
                    </option>
                  ))}
              </select>
            </div>
            { selectedNiveau !== 0 && (
            <div className="mb-4">
              <label htmlFor="prof" className="block text-sm font-medium text-gray-900">
                Matiere
              </label>

              <select
                  id="matieres"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onChange={handleMatiereChange}
                  value={selectedMatiere}
                >
                  <option value="none">Choisir une matiere </option>
                  {listMatiere.map((matiere, index) => (
                    <option key={matiere.id_matiere} value={matiere.id_matiere}>
                      {matiere.matiere}
                    </option>
                  ))}
              </select>
            </div>)}
            
            <div className="mb-4">
              <label htmlFor="prof" className="block text-sm font-medium text-gray-900">
                Salle
              </label>

              <select
                  id="matieres"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onChange={handleSalleChange}
                  value={salle}
                >
                  <option value="none">Choisir un niveau</option>
                  {listSalle.map((salle, index) => (
                    <option key={salle.num_salle} value={salle.num_salle}>
                      {salle.num_salle}
                    </option>
                  ))}
              </select>
            </div>
          </form>
           </div>
          <div className='flex gap-3'>
          <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
            Close
          </button>
          <button onClick={handleEnregistrer} type="button" className=" flex text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5 float-right">
              Enregistrer
          </button> 
          </div>
        </div>
      </div>
    );
  };
export default EditModal;


