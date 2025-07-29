package esprit.demandegestion.restController;

import esprit.demandegestion.entity.Demande;
import esprit.demandegestion.repository.DemandeRepository;
import esprit.demandegestion.services.DemandeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/demandes")

public class DemandeRestController {

    private final DemandeService demandeService;
    private final DemandeRepository demandeRepository;

    // Injection par constructeur
    @Autowired
    public DemandeRestController(DemandeService demandeService, DemandeRepository demandeRepository) {
        this.demandeService = demandeService;
        this.demandeRepository = demandeRepository;
    }

    // Create
    @PostMapping
    public ResponseEntity<Demande> createDemande(@Valid @RequestBody Demande demande) {
        Demande createdDemande = demandeService.createDemande(demande);
        return new ResponseEntity<>(createdDemande, HttpStatus.CREATED);
    }

    // Read all
    @GetMapping
    public ResponseEntity<List<Demande>> getAllDemandes() {
        List<Demande> demandes = demandeService.getAllDemandes();
        return new ResponseEntity<>(demandes, HttpStatus.OK);
    }

    // Read one
    @GetMapping("/{id}")
    public ResponseEntity<Demande> getDemandeById(@PathVariable Long id) {
        Demande demande = demandeService.getDemandeById(id);
        return demande != null ?
                new ResponseEntity<>(demande, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Demande> updateDemande(@PathVariable Long id, @Valid @RequestBody Demande demande) {
        Demande existingDemande = demandeService.getDemandeById(id);
        if (existingDemande != null) {
            demande.setId(id);
            Demande updatedDemande = demandeService.updateDemande(demande);
            return new ResponseEntity<>(updatedDemande, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemande(@PathVariable Long id) {
        Demande existingDemande = demandeService.getDemandeById(id);
        if (existingDemande != null) {
            demandeService.deleteDemande(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // ✅ Statistiques par type de demande
    @GetMapping("/stats/type")
    public ResponseEntity<Map<String, Long>> getDemandesParType() {
        Map<String, Long> stats = demandeRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        d -> d.getTypeDemande() != null ? d.getTypeDemande().name() : "NON_SPÉCIFIÉ",
                        Collectors.counting()
                ));
        return ResponseEntity.ok(stats);
    }
}
