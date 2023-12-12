   const fetchNiveaux = async (date1: Date, date2: Date) => {
      try {
        const response = await axios.get(`http://localhost:3001/api/etudiants/${id}`);
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
          const response = await fetch(`http://localhost:3001/api/edt/${niveau}?date1=${formattedDate1}&date2=${formattedDate2}&id_etudiant=${id}`);
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