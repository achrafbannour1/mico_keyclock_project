package esprit.demandegestion.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private TypeDemande typeDemande;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date_demande;
    private LocalDate date_traitement;
}
