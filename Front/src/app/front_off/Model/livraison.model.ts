export interface Livraison {
  id?: number;
  orderId: number;
  adresse: string;
  transporteur: string;
  statut: 'EN_ATTENTE' | 'EXPEDIEE' | 'EN_COURS_DE_LIVRAISON' | 'LIVREE' | 'ANNULEE';
  dateLivraisonPrevue: string;
}