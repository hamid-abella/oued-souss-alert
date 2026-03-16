/*
Fonction utilitaire pour calculer un indice de risque
Basé sur niveau eau et seuil critique
*/

exports.calculateFloodRisk = (niveau, seuil)=>{

  const ratio = niveau / seuil;

  if(ratio < 0.5)
    return "faible";

  if(ratio < 0.8)
    return "modere";

  return "critique";

};



/*
Formater date pour dashboard
*/

exports.formatDate = (date)=>{

  return new Date(date).toISOString();

};