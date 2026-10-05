export interface Testimonial {
  name: string;
  category: string;
  stars: number;
  text: string;
  photo?: string;
}

// TROCAR POR DEPOIMENTOS REAIS (copiar avaliações positivas do Google).
// A seção exibe os cards automaticamente quando este array tiver itens.
// Exemplo:
// { name: "Nome do aluno", category: "Carro (B)", stars: 5, text: "Texto da avaliação" },
export const TESTIMONIALS: Testimonial[] = [];
