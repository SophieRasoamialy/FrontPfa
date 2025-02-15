"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  id_enseignant: number;
}

const EditModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  id_enseignant,
}) => {
  const [nomProf, setNomProf] = useState("");
  const [prenomProf, setPrenomProf] = useState("");

  const handleEnregistrer = async () => {
    try {
      // Envoi des données vers l'API pour créer un nouvel enseignant
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/enseignants/${id_enseignant}`,
        {
          nom_enseignant: nomProf,
          prenom_enseignant: prenomProf,
        }
      );

      if (response.status === 200) {
        setNomProf("");
        setPrenomProf("");
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
      console.error("Erreur lors de la création du nouvel enseignant:", error);
      // Gérer les erreurs ici (par exemple, afficher un message à l'utilisateur)
    }
  };

  useEffect(() => {
    fetchEnseignants();
  }, []);

  async function fetchEnseignants() {
    if (id_enseignant !== 0) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/enseignants/${id_enseignant}`
        );

        if (response.status === 200) {
          const data = response.data;
          console.log("data");
          console.log(data);
          setNomProf(data.nom_enseignant);
          setPrenomProf(data.prenom_enseignant);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des matières:", error);
      }
    }
  }
  const handlematiereChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNomProf(event.target.value);
  };

  const handleprofChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrenomProf(event.target.value);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-xl">
        <h3 className="text-2xl font-bold mb-4">Modification de enseignant</h3>
        <div>
          <form className=" rounded-lg ">
            <div className="mb-4">
              <label
                htmlFor="matiere"
                className="block text-sm font-medium text-gray-900"
              >
                Nom
              </label>
              <input
                type="text"
                id="matiere"
                name="matiere"
                value={nomProf}
                onChange={handlematiereChange}
                className="block w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Ex. Laurant"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="prof"
                className="block text-sm font-medium text-gray-900"
              >
                Prenom
              </label>
              <input
                type="text"
                id="prof"
                name="prof"
                value={prenomProf}
                onChange={handleprofChange}
                className="block w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Ex. Dupont"
              />
            </div>
          </form>
        </div>
        <div className="flex gap-2 mt-4 ">
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
            Mettre a jour
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditModal;
