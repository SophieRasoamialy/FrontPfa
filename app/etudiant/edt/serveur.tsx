// ServerComponent.js
'use server';
import axios from 'axios';

const ServerComponent = async (date1:String, date2:String, id:any) => {

  const response1 =  await axios.get(`http://localhost:3001/api/etudiants/${id}`);
  const niveau = response1.data.id_niveau;
  const response =  await axios.get(
    `http://localhost:3001/api/edt/${niveau}?date1=${date1}&date2=${date2}&id_etudiant=${id}`
  );
 
    const data =  response.data;
    return data;
};

export default ServerComponent;
