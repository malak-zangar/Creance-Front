import axios from "axios";
import DetailsFactureForm from "../../components/Modals/Factures/DetailsFactureForm";
import { useEffect, useState } from "react";


const ValidateFacture = () => {
    const [data, setData] = useState([]);

    const fetchData = () => {
        axios
          .get("http://localhost:5555/facture/getByID/")
          .then((response) => {
            setData(
              response.data.map((facture) => ({
                key: facture.id,
                numero: facture.numero,
                date: new Date(facture.date).toLocaleDateString('fr-FR'),
                delai: facture.delai,
                montant: facture.montant,
                montantEncaisse:facture.montantEncaisse,
                actionRecouvrement:facture.actionRecouvrement,
                actif: facture.actif,
                client_id:facture.client_id,
                client : facture.client,
                solde:facture.solde,
                devise:facture.devise,
                echeance:new Date (facture.echeance).toLocaleDateString('fr-FR'),
                retard: facture.retard,
                statut:facture.statut,
                dateFinalisation: facture.dateFinalisation ? new Date(facture.dateFinalisation).toLocaleDateString('fr-FR') : null // Format date
                          }))
            );
    
          })
          .catch((error) => {
            console.error("There was an error fetching the factures!", error);
          });
      };

      useEffect(() => {
        fetchData();
      }, []);
    

<DetailsFactureForm record={record} />
};

export default ValidateFacture;