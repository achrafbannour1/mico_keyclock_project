package esprit.livraison.Controller;

import esprit.livraison.Services.livraisonserv;
import esprit.livraison.entity.Livraison;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/Livraison")
public class LivraisonController {

    private livraisonserv service;

    @PostMapping
    public Livraison create(@RequestBody Livraison l) {
        return service.createLivraison(l);
    }

    @GetMapping
    public List<Livraison> getAll() {
        return service.getAllLivraisons();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livraison> getById(@PathVariable Long id) {
        return service.getLivraisonyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Livraison update(@PathVariable Long id, @RequestBody Livraison liv) {
        return service.updateLivraison(id, liv);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteLivraison(id);
        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/{id}/commentaire")
    public ResponseEntity<Livraison> addCommentaire(@PathVariable Long id, @RequestBody String commentaire) {
        Livraison updatedLivraison = service.addCommentaire(id, commentaire);
        return ResponseEntity.ok(updatedLivraison);
    }
}
