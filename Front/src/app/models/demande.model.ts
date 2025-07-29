export class Demande {
    id?: number;
    typeDemande: 'TECHNIQUE' | 'ADMINISTRATIVE' | 'AUTRE';
    description: string;
    date_demande: string; // format yyyy-MM-dd
    date_traitement?: string;
  
    constructor(
      typeDemande: 'TECHNIQUE' | 'ADMINISTRATIVE' | 'AUTRE',
      description: string,
      date_demande: string,
      date_traitement?: string,
      id?: number
    ) {
      this.typeDemande = typeDemande;
      this.description = description;
      this.date_demande = date_demande;
      this.date_traitement = date_traitement;
      this.id = id;
    }
  }
  