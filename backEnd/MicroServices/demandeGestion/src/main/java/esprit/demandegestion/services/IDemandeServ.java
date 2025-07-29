package esprit.demandegestion.services;

import esprit.demandegestion.entity.Demande;

import java.util.List;

public interface IDemandeServ {
    Demande createDemande(Demande demande);
    Demande updateDemande(Demande demande);
    void deleteDemande(Long id);
    Demande getDemandeById(Long id);
    List<Demande> getAllDemandes();
}
