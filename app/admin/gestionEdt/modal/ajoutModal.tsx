'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Niveau {
    id_niveau: number;
    niveau: string;
}
interface Matiere {
    id_matiere: number;
    matiere: string;
}
interface Salle {
    num_salle: number;
}

const AjoutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [salle, setSalle] = useState('');
    const [listSalle, setListSalle] = useState<Salle[]>([]);
    const [selectedMatiere, setSelectedMatiere] = useState('');
    const [listMatiere, setListMatiere] = useState<Matiere[]>([]);
    const [selectedNiveau, setSelectedNiveau] = useState('');
    const [niveaux, setNiveaux] = useState<Niveau[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [heureDeb, setHeureDeb] = useState('');
    const [heureFin, setHeureFin] = useState('');

    useEffect(() => {
        fetchNiveaux();
        fetchSalle();
    }, []);

    const fetchNiveaux = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/niveaux`);
            setNiveaux(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des niveaux', error);
        }
    };

    const fetchSalle = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/salles`);
            setListSalle(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des salles', error);
        }
    };

    const fetchMatiere = async (niveau: number) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/matieres/niveau/${niveau}`);
            setListMatiere(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des matieres', error);
        }
    };

    const handleEnregistrer = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/edt`, {
                date: selectedDate,
                heure: heureDeb,
                heure_fin: heureFin,
                id_niveau: selectedNiveau,
                id_matiere: selectedMatiere,
                id_salle: salle,
            });

            if (response.status === 200) {
                Swal.fire('Succès', 'Données enregistrées avec succès', 'success');
                onClose();
            } else {
                Swal.fire('Erreur', 'Erreur lors de l\'enregistrement des données', 'error');
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error);
        }
    };

    const handleNiveauChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if (selectedValue !== 'none') {
            setSelectedNiveau(selectedValue);
            fetchMatiere(parseInt(selectedValue));
        }
    };

    const handleSalleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSalle(event.target.value);
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    const handleHeureDeb = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHeureDeb(event.target.value);
    };

    const handleHeureFin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHeureFin(event.target.value);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-xl">
                <h3 className="text-2xl font-bold mb-4">Emploie du temps</h3>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            id="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Heures</label>
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={heureDeb}
                                onChange={handleHeureDeb}
                                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="time"
                                value={heureFin}
                                onChange={handleHeureFin}
                                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="niveau" className="block text-sm font-medium text-gray-700">Niveau</label>
                        <select
                            id="niveau"
                            value={selectedNiveau}
                            onChange={handleNiveauChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="none">Choisir un niveau</option>
                            {niveaux.map((niveau) => (
                                <option key={niveau.id_niveau} value={niveau.id_niveau}>
                                    {niveau.niveau}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedNiveau && (
                        <div>
                            <label htmlFor="matiere" className="block text-sm font-medium text-gray-700">Matière</label>
                            <select
                                id="matiere"
                                value={selectedMatiere}
                                onChange={(e) => setSelectedMatiere(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="none">Choisir une matière</option>
                                {listMatiere.map((matiere) => (
                                    <option key={matiere.id_matiere} value={matiere.id_matiere}>
                                        {matiere.matiere}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="salle" className="block text-sm font-medium text-gray-700">Salle</label>
                        <select
                            id="salle"
                            value={salle}
                            onChange={handleSalleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="none">Choisir une salle</option>
                            {listSalle.map((s) => (
                                <option key={s.num_salle} value={s.num_salle}>
                                    {s.num_salle}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="inline-block px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleEnregistrer}
                        type="button"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-teal-300 to-lime-300 text-black rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-teal-400 hover:to-lime-400 transition-all duration-300"
                    >
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AjoutModal;
