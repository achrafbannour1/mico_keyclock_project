package esprit.livraison.Services;

import esprit.livraison.entity.Livraison;

import java.util.List;
import java.util.Optional;

public interface ILivraisonServ {
    Livraison createLivraison(Livraison liv);
    List<Livraison> getAllLivraisons();
    Optional<Livraison> getLivraisonyById(Long id);
    Livraison updateLivraison(Long id, Livraison liv);
    void deleteLivraison(Long id);

}
