"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  id_matiere: number;
}

interface Niveau {
  id_niveau: number;
  niveau: string;
} 

interface Enseignant {
  id_enseignant: number;
  prenom_enseignant: string;
  nom_enseignant: string;
}

const EditModal: React.FC<ModalProps> = ({ isOpen, onClose, id_matiere }) => {
  const [matiere, setMatiere] = useState("");
  const [prof, setProf] = useState("");
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [selectedNiveau, setSelectedNiveau] = useState("none");
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);

  // Fonction pour envoyer les données au backend
  const handleEnregistrer = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/matieres/${id_matiere}`,
        {
          matiere: matiere,
          id_enseignant: prof,
          id_niveau: selectedNiveau,
        }
      );

      if (response.status === 200) {
        // Gérer la réponse si nécessaire
        setMatiere("");
        setSelectedNiveau("");
        Swal.fire("Succès", "Données enregistrées avec succès", "success");
        onClose();
      } else {
        Swal.fire(
          "Erreur",
          "Erreur lors de l'enregistrement des données",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  useEffect(() => {
    fetchNiveaux();
    fetchEnseignants();
    fetchMatiere();
  }, [id_matiere]);

  async function fetchMatiere() {
    if (id_matiere !== 0) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/matieres/${id_matiere}`
        );

        if (response.status === 200) {
          const data = response.data;

          // Mise à jour de l'état local avec les données reçues
          setMatiere(data.matiere);
          setSelectedNiveau(data.id_niveau); // Valeur par défaut pour le niveau
          setProf(data.id_enseignant); // Valeur par défaut pour l'enseignant
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des matières:", error);
      }
    }
  }

  async function fetchEnseignants() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/enseignants`); // Remplacez l'URL par celle de votre backend
      if (response.ok) {
        const data = await response.json();
        setEnseignants(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des enseignants:", error);
    }
  }

  const fetchNiveaux = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/niveaux`);
      console.log("Niveaux reçus :", response.data);
      setNiveaux(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des niveaux", error);
    }
  };

  const handleNiveauChange = async (event: { target: { value: any } }) => {
    const selectedValue = event.target.value;

    if (selectedValue !== "none") {
      setSelectedNiveau(selectedValue);
    }
  };
  const handlematiereChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMatiere(event.target.value);
  };

  const handleprofChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProf(event.target.value);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-xl">
        <h3 className="text-2xl font-bold mb-4">Nouvelle matiere</h3>
        <div>
          <form className=" rounded-lg ">
            <div className="mb-4">
              <label
                htmlFor="matiere"
                className="block text-sm font-medium text-gray-900"
              >
                Matiere
              </label>
              <input
                type="text"
                id="matiere"
                name="matiere"
                value={matiere}
                onChange={handlematiereChange}
                className="block w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Entrer le libelle"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="prof"
                className="block text-sm font-medium text-gray-900"
              >
                Professeur responsable
              </label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleprofChange}
                value={prof}
              >
                <option value="none">Choisir un prof</option>
                {enseignants.map((enseignant) => (
                  <option
                    key={enseignant.id_enseignant}
                    value={enseignant.id_enseignant}
                  >
                    {enseignant.nom_enseignant} {enseignant.prenom_enseignant}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="prof"
                className="block text-sm font-medium text-gray-900"
              >
                Niveau
              </label>
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
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className=" inline-block px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300"
          >
            Close
          </button>
          <button
            onClick={handleEnregistrer}
            type="button"
            className=" inline-block px-8 py-4 bg-gradient-to-r from-teal-300 to-lime-300 text-black rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-teal-400 hover:to-lime-400 transition-all duration-300"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditModal;
