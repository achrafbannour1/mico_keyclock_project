package esprit.demandegestion.services;

import esprit.demandegestion.entity.Demande;
import esprit.demandegestion.repository.DemandeRepository;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@AllArgsConstructor
@Service

public class DemandeService implements IDemandeServ {


        private DemandeRepository demandeRepository;


        public Demande createDemande(Demande demande) {
            return demandeRepository.save(demande);
        }


        public Demande updateDemande(Demande demande) {
            return demandeRepository.save(demande);
        }


        public void deleteDemande(Long id) {
            demandeRepository.deleteById(id);
        }


        public Demande getDemandeById(Long id) {
            Optional<Demande> demande = demandeRepository.findById(id);
            return demande.orElse(null);
        }

        @Override
        public List<Demande> getAllDemandes() {
            return demandeRepository.findAll();
        }
    }

