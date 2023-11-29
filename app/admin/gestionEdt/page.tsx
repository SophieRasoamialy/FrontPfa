'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, PencilIcon, XMarkIcon } from "@heroicons/react/20/solid";
import AjoutModal from "./modal/ajoutModal";
import EditModal from './modal/editModal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { startOfWeek, endOfWeek, addDays  } from 'date-fns';

export default function EdtPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [niveaux, setNiveaux] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState('none');
    const [edts, setEdts] = useState([]);
    const [edtId, setEdtId] = useState(0);
    
    const dateSelectionnee =new Date();
    const [currentDate, setCurrentDate] = useState(dateSelectionnee);
    const [startOfWeekDate, setStartOfWeekDate] = useState(new Date());
    const [endOfWeekDate, setEndOfWeekDate] = useState(new Date());

    useEffect(() => {
      console.log("Fetching niveaux...");
      fetchNiveaux();
      if (currentDate) {
        const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 pour lundi
        const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 1 }); // 1 pour lundi
    
        setStartOfWeekDate(startOfWeekDate);
        setEndOfWeekDate(endOfWeekDate);
      }
    }, [currentDate]);

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
    getEdt(selectedValue, startOfWeekDate, endOfWeekDate);
  }
};


  const getEdt = async(niveau: string, date1: Date, date2: Date) => {
    try {
      const formattedDate1 = formatDate(date1);
      const formattedDate2 = formatDate(date2);
      
        const response = await fetch(`http://localhost:3001/api/edt/${niveau}?date1=${formattedDate1}&date2=${formattedDate2}`);
        if (response.ok) {
          const data = await response.json();
         
          setEdts(data);
        } else {
          console.error('Erreur lors de la récupération des emploies du temps');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des emploies deu temps:', error);
      }
  }

  const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
  };

  const refreshEdt = async () => {
    try {
      const formattedDate1 = formatDate(startOfWeekDate);
      const formattedDate2 = formatDate(endOfWeekDate);
        const response = await fetch(`http://localhost:3001/api/edt/${selectedNiveau}?date1=${formattedDate1}&date2=${formattedDate2}`);
        if (response.ok) {
          const data = await response.json();
          
          setEdts(data);
        } else {
          console.error('Erreur lors de la récupération des emploies du temps');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des emploies deu temps:', error);
      }
  };

  const  handleDeleteEdt= (id: any) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cette emploie du temps ?',
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
          await axios.delete(`http://localhost:3001/api/edt/${id}`);
  
          // Rafraîchir la liste des matières après la suppression
          refreshEdt();
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'emploie du temps:', error);
        }
      }
    });
  };

  const filterEdtsForCurrentWeek = () => {
    // Obtenez le début et la fin de la semaine pour la date sélectionnée
    const { debutSemaine, finSemaine } = getDebutFinSemaine(currentDate);
  
    // Filtrez les éléments de l'emploi du temps en fonction de la date
    const filteredEdts = edts.filter((edt) => {
      const dateEdt = new Date(edt.date);
      return dateEdt >= debutSemaine && dateEdt <= finSemaine;
    });
  };
    const openModal = () => {
        setIsModalOpen(true);
        
      };
    
      const closeModal = () => {
        refreshEdt();
        setIsModalOpen(false);
      };
    
      const openEditModal = (edtId: number) => {
        setIsEditModalOpen(true);
        setEdtId(edtId);
      }
    
      const closeEditModal = () => {
        refreshEdt();
        setIsEditModalOpen(false);
      }

        // Fonction pour afficher la semaine précédente
        const showPreviousWeek = () => {
        const previousWeek = addDays(startOfWeekDate, -7);
        setCurrentDate(previousWeek);
        setStartOfWeekDate(previousWeek);
        setEndOfWeekDate(endOfWeek(previousWeek, { weekStartsOn: 1 }));
        getEdt(selectedNiveau, previousWeek, endOfWeek(previousWeek, { weekStartsOn: 1 }));
        };

        // Fonction pour afficher la semaine suivante
        const showNextWeek = () => {
        const nextWeek = addDays(startOfWeekDate, 7);
        setCurrentDate(nextWeek);
        setStartOfWeekDate(nextWeek);
        setEndOfWeekDate(endOfWeek(nextWeek, { weekStartsOn: 1 }));
        
        getEdt(selectedNiveau, nextWeek, endOfWeek(nextWeek, { weekStartsOn: 1 }));
        };

        // Fonction pour obtenir le début et la fin de la semaine
        function getDebutFinSemaine(date: Date) {
            const debutSemaine = new Date(date);
            debutSemaine.setDate(debutSemaine.getDate() - debutSemaine.getDay() + 1); // Lundi
    
            const finSemaine = new Date(date);
            finSemaine.setDate(debutSemaine.getDate() + 6); // Samedi
    
            return { debutSemaine, finSemaine };
            }
    
            // Obtenez le début et la fin de la semaine pour la date sélectionnée
            const { debutSemaine, finSemaine } = getDebutFinSemaine(currentDate);
    
            // Affichage des dates dans le format souhaité pour la semaine
            const debutSemaineFormat = debutSemaine.toLocaleDateString('fr-FR', { month: 'long', day: 'numeric' });
            const finSemaineFormat = finSemaine.toLocaleDateString('fr-FR', { month: 'long', day: 'numeric' });
            
    return(
      <div className='w-full'>
       
        <div className=" w-full flex mb-5">
            
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
            <div className="w-2/3 mx-auto font-bold">
                <h3>Emploie du temps pour M1 </h3>
            </div>

          </div>
          <button onClick={openModal} type="button" className=" flex text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5 float-right">
            <PlusIcon className='w-5 h-5'/>Ajouter
        </button> 
        <AjoutModal isOpen={isModalOpen} onClose={closeModal} />
        { edtId !== 0 && (<EditModal isOpen={isEditModalOpen} onClose={closeEditModal} edtId={edtId}  />)}
        <div className=" container mx-auto  w-5/6">
          <div className="wrapper bg-white  rounded-2xl shadow w-full">
            <div className="header flex justify-between border-b p-2">
            <span className="text-lg font-bold text-teal-500">
            Semaine du {debutSemaineFormat} - {finSemaineFormat}, {debutSemaine.getFullYear()}
            </span>
              <div className="buttons">
                <button className="p-1" onClick={showPreviousWeek}>
                  <ChevronLeftIcon className="w-6 h-6 text-gray-500"  />
                </button>
                <button className="p-1"  onClick={showNextWeek} >
                  <ChevronRightIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
              <tr>
                {['Heure', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <th
                    key={index}
                    className="p-2 text-teal-500 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs"
                    >
                    <span className="xl:block lg:block md:block sm:block hidden">
                        {day}
                    </span>
                    <span className="xl:hidden lg:hidden md:hidden sm:hidden block">
                        {day}
                    </span>
                    </th>
                ))}
                </tr>
              </thead>
              <tbody>

              {[
                '7:30 - 9:00',
                '9:00 - 10:30',
                '10:30 - 12:00',
                '13:00 - 14:30',
                '14:30 - 16:00',
                '17:30 - 19:00',
              ].map((hourRange, index) => (
                <React.Fragment key={index}>
                  <tr className="text-center h-20">
                    <td className="border-r p-2 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10">
                      <div className="text-left">
                        <div className="text-sm ">{hourRange}</div>
                      </div>
                    </td>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, dayIndex) => (
                      <td key={dayIndex} className="border-r p-2 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10">
                        {edts.map((edt) => {
                          const dateEdt = new Date(edt.date);
                          const jourSemaineEdt = dateEdt.getDay();

                          if (
                            (day === 'Mon' && jourSemaineEdt === 1) ||
                            (day === 'Tue' && jourSemaineEdt === 2) ||
                            (day === 'Wed' && jourSemaineEdt === 3) ||
                            (day === 'Thu' && jourSemaineEdt === 4) ||
                            (day === 'Fri' && jourSemaineEdt === 5)
                          ) {
                            const hourRangeArray = hourRange.split(' - ');
                            const startHour = parseInt(hourRangeArray[0].split(':')[0]);
                            const endHour = parseInt(hourRangeArray[1].split(':')[0]);
                            const heureEdt = parseInt(edt.heure.split(':')[0]);

                            if (heureEdt >= startHour && heureEdt < endHour) {
                              return (
                                <div key={edt.id_edt} className="text-left">
                                  
                                  <div className="text-sm font-bold">{edt.matiere} {edt.id_edt}</div>
                                  <div className="text-xs"> Prof: {edt.nom_enseignant} {edt.prenom_enseignant}</div>
                                  <div className="text-xs"> Salle: {edt.num_salle}</div>
                                  <div className='flex gap-2'>
                                    <button type='button' className="font-medium text-blue-600 hover:text-blue-800" 
                                        onClick={() => openEditModal(edt.id_edt)}>
                                          <PencilIcon  className='w-4 h-4 text-blue-500'/>
                                    </button>
                                    
                                    <button type='button' className="font-medium text-red-600 hover:text-red-800" 
                                      onClick={() => handleDeleteEdt(edt.id_edt)} >
                                      <XMarkIcon  className='w-5 h-5 text-red-600'/>
                                    </button>
                                    
                                  </div>
                                </div>
                              );
                            }
                          }

                          return null;
                        })}
                      </td>
                    ))}
                  </tr>
                  {index < 5 && <tr className="h-1 bg-gray-500"></tr>}
                </React.Fragment>
              ))}

                
                
                </tbody>
            </table>
          </div>
    </div>
   

  </div>
    );
}