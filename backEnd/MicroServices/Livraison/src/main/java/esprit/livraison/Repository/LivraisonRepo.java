package esprit.livraison.Repository;

import esprit.livraison.entity.Livraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivraisonRepo extends JpaRepository<Livraison, Long> {
}
