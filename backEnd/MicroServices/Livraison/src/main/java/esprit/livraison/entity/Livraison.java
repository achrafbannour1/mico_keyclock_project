package esprit.livraison.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Livraison  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    private String adresse;
    private String transporteur;
    @Enumerated(EnumType.STRING) // Stocke le nom de l'enum (ex. "EN_ATTENTE") en base
    private Statut statut;
     private LocalDate datePrevue;

    @Column(length = 500) // Limite la longueur du commentaire
    private String commentaire; //

    }

