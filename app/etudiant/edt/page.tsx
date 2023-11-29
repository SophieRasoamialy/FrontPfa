'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { startOfWeek, endOfWeek, addDays, differenceInMinutes, parseISO  } from 'date-fns';

interface EdtPageProps {
    id: string | undefined; // Ou le type approprié de votre ID
  }
  

  const EdtPage: React.FC<EdtPageProps> = ({ id }) =>  {
    const [edts, setEdts] = useState([]);
    const [niveau, setNiveau] = useState('');
    const dateSelectionnee =new Date();
    const [currentDate, setCurrentDate] = useState(dateSelectionnee);
    const [startOfWeekDate, setStartOfWeekDate] = useState(new Date());
    const [endOfWeekDate, setEndOfWeekDate] = useState(new Date());

    useEffect(() => {
      
      if (currentDate) {
        const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 pour lundi
        const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 1 }); // 1 pour lundi
        fetchNiveaux(startOfWeekDate, endOfWeekDate);
        setStartOfWeekDate(startOfWeekDate);
        setEndOfWeekDate(endOfWeekDate);
      }

    }, [currentDate]);

    const fetchNiveaux = async (date1: Date, date2: Date) => {
      try {
        const response = await axios.get(`http://localhost:3001/api/etudiants/${id}`);
        console.log("Niveaux reçus :", response.data.id_niveau);
        setNiveau(response.data.id_niveau);
        getEdts(response.data.id_niveau, date1, date2);
      } catch (error) {
        console.error('Erreur lors de la récupération des niveaux', error);
      }
    };

    const getEdts = async(niveau: string, date1: Date, date2: Date) => {
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

    const findNearestClass = () => {
      const now = new Date();
      const nearestClass = edts.reduce<{
        edt: any; // ajustez ce type en fonction de la structure de vos données edt
        difference: number;
      } | null>((nearest, edt) => {
        const classDate = parseISO(edt.date + ' ' + edt.heure);
        const difference = differenceInMinutes(classDate, now);
    
        if (difference > 0 && (nearest === null || difference < nearest.difference)) {
          return { edt, difference };
        } else {
          return nearest;
        }
        
      }, null); 
      return nearestClass;
    };
    

  // Utilisez la fonction pour obtenir le cours le plus proche
  const nearestClass = findNearestClass();

  const days = Math.floor(nearestClass?.difference / (24 * 60));
  const hours = Math.floor((nearestClass?.difference % (24 * 60)) / 60);
  const minutes = nearestClass?.difference % 60;


    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
      };

       // Fonction pour afficher la semaine précédente
       const showPreviousWeek = () => {
        const previousWeek = addDays(startOfWeekDate, -7);
        setCurrentDate(previousWeek);
        setStartOfWeekDate(previousWeek);
        setEndOfWeekDate(endOfWeek(previousWeek, { weekStartsOn: 1 }));
        getEdts(niveau, previousWeek, endOfWeek(previousWeek, { weekStartsOn: 1 }));
        };

        // Fonction pour afficher la semaine suivante
        const showNextWeek = () => {
        const nextWeek = addDays(startOfWeekDate, 7);
        setCurrentDate(nextWeek);
        setStartOfWeekDate(nextWeek);
        setEndOfWeekDate(endOfWeek(nextWeek, { weekStartsOn: 1 }));
        
        getEdts(niveau, nextWeek, endOfWeek(nextWeek, { weekStartsOn: 1 }));
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
        <div>
          <h3 className='text-center m-5 font-bold text-base'>Emploie du temps M1 GB</h3>
        </div>
        <div className=" container mx-auto  w-5/6">
          <div className="wrapper bg-white bg-opacity-70 rounded-2xl shadow w-full">
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
    <div>
      {nearestClass && (
        <div className="max-w-sm p-6 mx-auto my-5 bg-white border bg-opacity-70 border-gray-200 rounded-3xl shadow hover:bg-gray-100">
          <p className="font-normal text-gray-700">
          Prochain cours dans : {nearestClass?.difference !== undefined ? (
          <span className="text-lime-600">
            {days > 0 ? `${days} jour${days > 1 ? 's' : ''} ` : ''}
            {hours > 0 ? `${hours} heure${hours > 1 ? 's' : ''} ` : ''}
            {minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}
          </span>
        ) : 'N/A'} <br />
            Cours : {nearestClass.edt.matiere !== undefined ? <span className="text-lime-600">{nearestClass.edt.matiere}</span> : 'N/A'}<br />
            Prof : {nearestClass.edt.nom_enseignant !== undefined ? <span className="text-lime-600">{`${nearestClass.edt.nom_enseignant} ${nearestClass.edt.prenom_enseignant}`}</span> : 'N/A'}
          </p>
        </div>
      )}
    </div>

  </div>
    );
}

export default EdtPage;