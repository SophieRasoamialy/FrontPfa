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
                                if (heureEdt >= startHour && heureEdt < endHour) {
                                return (
                                <div key={edt.id_edt} className="text-left">
                                    <div className="text-sm font-bold">{edt.matiere} {edt.id_edt}</div>
                                    <div className="text-xs"> Prof: {edt.nom_enseignant} {edt.prenom_enseignant}</div>
                                    <div className="text-xs"> Salle: {edt.num_salle}</div>
                                    <p>heure edt{edt.heure} maintenant {heureMinuteActuelle}</p>
                                    <div className="text-xs">
                                        {edt.date < dateFormate ? (
                                        <div>
                                            { edt.isPresent.present ? (
                                            <span className="text-green-500"> présent</span>
                                            ) : (
                                            <span className="text-red-500"> absent</span>
                                            )}
                                        </div>
                                        ) : (edt.date == dateFormate) ? (
                                        <div>
                                            {(edt.heure < heureMinuteActuelle && edt.heure_fin > heureMinuteActuelle) ? (
                                            <div>
                                                { edt.isEntranceOnly.entranceOnly ? (
                                                <button  type="button" onClick={handlePointageClick} className=" items-center justify-center text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300  rounded-lg text-xs px-2 py-2 mx-auto ">
                                                Pointer(sortie)
                                                </button>
                                                ) : (
                                                <button  type="button" onClick={handlePointageClick} className="  items-center justify-center text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300 rounded-lg text-xs px-2 py-2 mx-auto ">
                                                Pointer(entrée)
                                                </button>
                                                )}
                                            </div>
                                            ): (edt.heure > heureMinuteActuelle) ? (
                                            <div>
                                                <button  type="button" className=" opacity-50 items-center justify-center cursor-not-allowed flex text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300  rounded-lg text-xs px-2 py-2 mx-auto " disabled>
                                                Pointer(entrée)
                                                </button>
                                            </div>
                                            ): (edt.heure_fin < heureMinuteActuelle) ? (
                                            <div>
                                                { edt.isPresent.present ? (
                                                <span className="text-green-500"> présent</span>
                                                ) : (
                                                <span className="text-red-500"> absent</span>
                                                )}
                                            </div>
                                            )}
                                        </div>
                                        ) : (
                                        <button  type="button" className=" opacity-50 items-center justify-center cursor-not-allowed flex text-gray-900 bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-300  rounded-lg text-xs px-2 py-2 mx-auto " disabled>
                                        Pointer(entrée)
                                        </button>
                                        )}
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