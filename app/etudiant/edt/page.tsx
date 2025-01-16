 
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import Swal from 'sweetalert2';
import { startOfWeek, endOfWeek, addDays, differenceInMinutes, parseISO, format  } from 'date-fns';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import Modal from 'react-modal'; 
import Image from 'next/image';
 

interface EdtPageProps {
    id: string | undefined; // Ou le type approprié de votre ID
  }
  interface Edt {
    id_edt: number;
    date: string;
    heure: string;
    matiere: string;
    nom_enseignant: string;
    prenom_enseignant: string;
    num_salle: string;
    isPresent: boolean;
    present: boolean;
    id_matiere: number;
    id_niveau: number;
  }
  
  const EdtPage: React.FC<EdtPageProps> = ({ id }) =>  {
    const [edts, setEdts] = useState<Edt[]>([]);
    const [niveau, setNiveau] = useState('');
    const [niveaulbl, setNiveaulbl] = useState('');
    const dateSelectionnee =new Date();
    const [currentDate, setCurrentDate] = useState(dateSelectionnee);
    const [startOfWeekDate, setStartOfWeekDate] = useState(new Date());
    const [endOfWeekDate, setEndOfWeekDate] = useState(new Date());
    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isModalOpenEntree, setIsModalOpenEntree] = useState(false);
    const [isModalOpenSortie, setIsModalOpenSortie] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idEdt, setIdEdt] = useState(0);

    const openModalEntree = (id_edt:number) => {
      setIdEdt(id_edt);
      setIsModalOpenEntree(true);
    };
  
    const closeModalEntree = () => {
      setIsModalOpenEntree(false);
    };

    const openModalSortie = (id_edt:number) => {
      setIdEdt(id_edt);
      setIsModalOpenSortie(true);
    };
  
    const closeModalSortie = () => {
      setIsModalOpenSortie(false);
    };
 
    useEffect(() => {
      
      if (currentDate) {

        const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 pour lundi
        const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 1 }); // 1 pour lundi
        fetchNiveaux(startOfWeekDate, endOfWeekDate);
        setStartOfWeekDate(startOfWeekDate);
        setEndOfWeekDate(endOfWeekDate);
       // fetchEdts(startOfWeekDate, endOfWeekDate);
      }
     
 
    }, [currentDate]);

   

    const fetchNiveaux = async (date1: Date, date2: Date) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/etudiants/${id}`);
        setNiveau(response.data.id_niveau);

        const response2 = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/niveaux/${response.data.id_niveau}`);
        setNiveaulbl(response2.data.niveau);
        getEdts(response.data.id_niveau, date1, date2);
      } catch (error) {
        console.error('Erreur lors de la récupération des niveaux', error);
      }
    };

    const getEdts = async (niveau: string, date1: Date, date2: Date) => {
      try {
        const formattedDate1 = formatDate(date1);
        const formattedDate2 = formatDate(date2);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/edt/etudiant/${niveau}?date1=${formattedDate1}&date2=${formattedDate2}&id_etudiant=${id}`);

        if (response.status === 200) {
          setEdts(response.data);
        } else {
          console.error('Erreur lors de la récupération des emplois du temps');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des emplois du temps:', error);
      }
    };

    const handlePointageEntreeClick = async () => {
      setLoading(true);
      const maintenant = new Date();
      const pointage_entree = format(maintenant, "yyyy-MM-dd HH:mm:ss");
      const faceMatch = await compareFaces();
      if (faceMatch)
      { 
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/pointages`, {
            id_edt: idEdt,
            id_etudiant: id,
            pointage_entre: pointage_entree,
          });
          if (response.status === 200 || response.status === 201) {
            closeModalEntree();
            setLoading(false);
            setCapturedImage(null);
            Swal.fire('Succès', 'Merci de faire votre pointage.\n N\'oublier pas de faire le pointage avant de sortir apre le cours', 'success');
            getEdts(niveau, startOfWeekDate, endOfWeekDate);
          } else {
            closeModalEntree();
            setLoading(false);
            setCapturedImage(null);
            Swal.fire('Erreur', 'Erreur lors de l\'enregistrement des données', 'error');
            
          }
          return response.data;
        } catch (error) {
          closeModalEntree();
          setLoading(false);
          setCapturedImage(null);
          console.error('Erreur lors de la création ou de la mise à jour du pointage', error);
          throw error;
        }
      }
      else{
        closeModalEntree();
          setLoading(false);
          setCapturedImage(null);
          Swal.fire('Erreur', 'Erreur lors de la comparaison des visages', 'error');
      }
    }

    const compareFaces = async (): Promise<boolean> => {
      try {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          setCapturedImage(imageSrc);
          let photoPath = "";
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/etudiants/${id}/photo`);
            const data = await response.json();
            if (response.ok) {
              photoPath = data.photoPath;
            } else {
              console.error('Erreur lors de la récupération du chemin de la photo de l\'étudiant', data.message);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du chemin de la photo de l\'étudiant', error);
          }

          // Charger l'image existante à comparer
          const image1 = await faceapi.fetchImage(photoPath)
          console.log("photopath =>", photoPath)
          // Convertir l'image capturée en blob
          const blob = await fetch(imageSrc).then((res) => res.blob());
          const image2 = await faceapi.bufferToImage(blob);
          await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
          await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
          await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
          await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');

         const face2 = await faceapi.detectSingleFace(image2).withFaceLandmarks().withFaceDescriptor();
         const face1 = await faceapi.detectSingleFace(image1).withFaceLandmarks().withFaceDescriptor();
          console.log("face2 => ", face2);
          console.log("face1 => ",face1);
           // Comparer les descripteurs de visage
            const distance = faceapi.euclideanDistance(face1!.descriptor, face2!.descriptor);

            if (distance < 0.6) {
              console.log("mitovy");
              return true;
            } else {
              console.log("tsy mitovy");
              return false
            }
                }
              } catch (error) {
                console.error('Erreur lors de la comparaison des visages:', error);
                return false;
              }
            
              return false;
            };

    const handlePointageSortieClick = async () => {
      setLoading(true);
      const maintenant = new Date();
      // Formatez la date et l'heure actuelles
      const pointage_sortie = format(maintenant, "yyyy-MM-dd HH:mm:ss");
      const faceMatch = await compareFaces();
      if (faceMatch)
      { 
      try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/pointages`, {
          id_edt: idEdt,
          id_etudiant: id,
          pointage_sortie: pointage_sortie,
        });
        if (response.status === 200 || response.status === 201){
          closeModalSortie();
          setLoading(false);
          setCapturedImage(null);
          Swal.fire('Succès', 'Merci de faire votre pointage.', 'success');
          getEdts(niveau, startOfWeekDate, endOfWeekDate);
        } else {
          closeModalSortie();
          setLoading(false);
          setCapturedImage(null);
          Swal.fire('Erreur', 'Erreur lors de l\'enregistrement des données', 'error');
          
        }
        return response.data;
      } catch (error) {
        closeModalSortie();
          setLoading(false);
          setCapturedImage(null);
        console.error('Erreur lors de la création ou de la mise à jour du pointage', error);
        throw error;
      }
    }
    }
 

    const findNearestClass = () => {
      const now = new Date();
      //console.log("edts"+edts);
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

      const dateFormate = formatDate(dateSelectionnee);

      const maintenant = new Date();
      const heureActuelle = maintenant.getHours();
      const minuteActuelle = maintenant.getMinutes();
      const secondeActuelle = maintenant.getSeconds();

      // Pour obtenir une chaîne au format "HH:MM"
      const heureMinuteActuelle = `${heureActuelle.toString().padStart(2, '0')}:${minuteActuelle.toString().padStart(2, '0')}:${secondeActuelle.toString().padStart(2, '0')}`;



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
            
            const parseTime = (timeString: string) => {
              if (timeString) {
                const [hours, minutes, seconds] = timeString.split(':');
                return new Date(0, 0, 0, Number(hours), Number(minutes), Number(seconds));
              } else {
                // Gérer le cas où la chaîne est null ou undefined
                console.error("La chaîne de temps est null ou undefined.");
                return null; // Ou renvoyez une valeur par défaut, selon votre logique
              }
            };
return(
  <div className='w-full bg-gradient-to-br from-teal-100 to-white p-5'>
      <div>
        <h3 className='text-center m-5 font-bold text-2xl text-teal-600'>Emploie du temps {niveaulbl}</h3>
    </div>
    <div className=" container mx-auto  w-5/6">
        <div className="wrapper bg-white bg-opacity-70 rounded-2xl shadow w-full">
            <div className="header flex justify-between border-b p-2">
                <span className="text-lg font-bold text-teal-600">
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
            <table className="w-full table-auto">
               <thead>
                    <tr className="bg-teal-200">
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
                    '16:00 - 17:30',
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
                                 {edts.map( (edt) => {
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
                                    const edtHeure = parseTime(edt.heure);
                                    const edtHeureFin = parseTime(edt.heure_fin);
                                    const formattedTime = parseTime(heureMinuteActuelle);
                                    if (heureEdt >= startHour && heureEdt < endHour) {
                                      return (
                                        <div key={edt.id_edt} className="text-left">
                                          <div className="text-sm font-bold">{edt.matiere} {edt.id_edt}</div>
                                          <div className="text-xs"> Prof: {edt.nom_enseignant} {edt.prenom_enseignant}</div>
                                          <div className="text-xs"> Salle: {edt.num_salle}</div>
                                          <div className="text-xs">
                                            { edt.date < dateFormate ? (
                                              <div>
                                                { edt.isPresent.present ? (
                                                <span className="text-green-500"> présent</span>
                                                ) : (
                                                <span className="text-red-500"> absent</span>
                                                )}
                                              </div>
                                            ): edt.date == dateFormate? (
                                              <div>
                                                {(edtHeure.getTime() < formattedTime.getTime() && edtHeureFin.getTime() > formattedTime.getTime()) ?
                                                  (
                                                    <div>
                                                      { edt.isEntranceOnly.entranceOnly ? (
                                                      <button  type="button" onClick={()=>openModalSortie(edt.id_edt)} className=" items-center justify-center text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300  rounded-lg text-xs px-2 py-2 mx-auto ">
                                                      Pointage(sortie)
                                                      </button>
                                                      ) : (
                                                        <div>
                                                        { edt.isPresent.present ? (
                                                        <span className="text-green-500"> présent</span>
                                                        ) : (
                                                          <button  type="button" onClick={()=>openModalEntree(edt.id_edt)} className="  items-center justify-center text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 rounded-lg text-xs px-2 py-2 mx-auto ">
                                                          Pointage(entrée)
                                                          </button>
                                                        )}
                                                      </div>
                                                      )}
                                                  </div>
                                                  ): edtHeure.getTime() > formattedTime.getTime() ? (
                                                    <div>
                                                        <button  type="button" className=" opacity-50 items-center justify-center cursor-not-allowed flex text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300  rounded-lg text-xs px-2 py-2 mx-auto " disabled>
                                                        Pointage(entrée)
                                                        </button>
                                                    </div>
                                                  ) : edtHeure.getTime() < formattedTime.getTime() ? (
                                                    <div>
                                                      { edt.isPresent.present ? (
                                                      <span className="text-green-500"> présent</span>
                                                      ) : (
                                                      <span className="text-red-500"> absent</span>
                                                      )}
                                                    </div>
                                                  ):(
                                                    <button  type="button" className=" opacity-50 items-center justify-center cursor-not-allowed flex text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300  rounded-lg text-xs px-2 py-2 mx-auto " disabled>
                                                      Pointage(entrée)
                                                    </button>
                                                  )
                                                }
                                              </div>
                                            ) : (
                                              <button  type="button" className=" opacity-50 items-center justify-center  cursor-not-allowed  flex text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300  rounded-lg text-xs px-2 py-2 mx-auto " disabled>
                                                Pointage(entrée)
                                              </button>
                                            ) }
                                          </div>
                                        </div>
                                      );
                                    }
                                  }
                                 })}
                              </td>
                            ))}
                        </tr>
                      </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    </div>
    <div>
        {nearestClass && (
        <div className="max-w-sm p-6 mx-auto my-5 bg-white border bg-opacity-70 border-gray-200 rounded-3xl shadow hover:bg-gray-100">
            <p className="font-normal text-gray-900">
                Prochain cours dans : {nearestClass?.difference !== undefined ? (
                <span className="text-gray-900 font-bold">
                {days > 0 ? `${days} jour${days > 1 ? 's' : ''} ` : ''}
                {hours > 0 ? `${hours} heure${hours > 1 ? 's' : ''} ` : ''}
                {minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}
                </span>
                ) : 'N/A'} <br />
                Cours : {nearestClass.edt.matiere !== undefined ? <span className="text-gray-900 font-bold">{nearestClass.edt.matiere}</span> : 'N/A'}<br />
                Prof : {nearestClass.edt.nom_enseignant !== undefined ? <span className="text-gray-900 font-bold">{`${nearestClass.edt.nom_enseignant} ${nearestClass.edt.prenom_enseignant}`}</span> : 'N/A'}
            </p>
        </div>
        )}
    </div>

    {/*modal 1*/}
    <Modal
  isOpen={isModalOpenEntree}
  onRequestClose={closeModalEntree}
  contentLabel="Reconnaissance faciale"
  ariaHideApp={false}
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      padding: '20px',
    },
  }}
>
  <div className="flex w-full justify-end items-center ">
    <button
      onClick={closeModalEntree}
      className="absolute top-0 right-0 cursor-pointer p-2 text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 text-sm"
    >
      X
    </button>
    <div className="w-full max-w-sm bg-white bg-opacity-70 border border-gray-200 rounded-2xl shadow">
      <div className="p-8 rounded-t-lg">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <div className="relative w-full h-full">
            <Webcam audio={false} ref={webcamRef} className="w-full h-full object-cover rounded-t-lg" />
            <canvas id="faceCanvas" className="absolute top-0 left-0 w-full h-full" />
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        <div className="text-center">
          {loading ? (
            <button
              disabled
              className="py-2.5 px-5 inline-flex font-medium opacity-50 items-center justify-center cursor-not-allowed text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 rounded-lg text-sm mx-auto"
            >
               <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                  </svg>
              Verification en cours...
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePointageEntreeClick}
              className="text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Verifier
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
</Modal>


{/*modal 2 */}
<Modal
  isOpen={isModalOpenSortie}
  onRequestClose={closeModalSortie}
  contentLabel="Reconnaissance faciale"
  ariaHideApp={false}
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      padding: '20px',
    },
  }}
>
  <div className="flex w-full justify-end items-center ">
    <button
      onClick={closeModalSortie}
      className="absolute top-0 right-0 cursor-pointer p-2 text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 text-sm"
    >
      X
    </button>
    <div className="w-full max-w-sm bg-white bg-opacity-70 border border-gray-200 rounded-2xl shadow">
      <div className="p-8 rounded-t-lg">
        {capturedImage ? (
          <Image src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <div className="relative w-full h-full">
            <Webcam audio={false} ref={webcamRef} className="w-full h-full object-cover rounded-t-lg" />
            <canvas id="faceCanvas" className="absolute top-0 left-0 w-full h-full" />
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        <div className="text-center">
          {loading ? (
            <button
              disabled
              className="py-2.5 px-5 inline-flex font-medium opacity-50 items-center justify-center cursor-not-allowed text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 rounded-lg text-sm mx-auto"
            >
               <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                  </svg>
              Verification en cours...
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePointageSortieClick}
              className="text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Verifier
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
</Modal>
  </div>
);
}

export default EdtPage;