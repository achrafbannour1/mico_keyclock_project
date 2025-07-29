package esprit.livraison.Services;

import esprit.livraison.Repository.LivraisonRepo;
import esprit.livraison.entity.Livraison;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@AllArgsConstructor
@Service
public class livraisonserv implements ILivraisonServ {

    private LivraisonRepo livraisonRepo;


    public Livraison createLivraison(Livraison livraison) {
        return livraisonRepo.save(livraison);
    }

    public List<Livraison> getAllLivraisons() {
        return livraisonRepo.findAll();
    }



    public Optional<Livraison> getLivraisonyById(Long id) {
        return livraisonRepo.findById(id);
    }

    public Livraison updateLivraison(Long id, Livraison liv) {
        Optional<Livraison> existingLivraisonOpt = livraisonRepo.findById(id);
        if (existingLivraisonOpt.isPresent()) {
            Livraison existingLivraison = existingLivraisonOpt.get();
            existingLivraison.setOrderId(liv.getOrderId());
            existingLivraison.setAdresse(liv.getAdresse());
            existingLivraison.setTransporteur(liv.getTransporteur());
            existingLivraison.setStatut(liv.getStatut());
            existingLivraison.setDatePrevue(liv.getDatePrevue());
            existingLivraison.setCommentaire(liv.getCommentaire());
            return livraisonRepo.save(existingLivraison);
        } else {
            throw new RuntimeException("Livraison non trouvée pour l'ID : " + id);
        }
    }



    public void deleteLivraison(Long id) {
        livraisonRepo.deleteById(id);
    }
    public Livraison addCommentaire(Long id, String commentaire) {
        Optional<Livraison> livraisonOpt = livraisonRepo.findById(id);
        if (livraisonOpt.isPresent()) {
            Livraison livraison = livraisonOpt.get();
            livraison.setCommentaire(commentaire);
            return livraisonRepo.save(livraison);
        } else {
            throw new RuntimeException("Livraison non trouvée pour l'ID : " + id);
        }
    }
}
