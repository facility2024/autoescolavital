export type PlanGroup = "carro-ou-moto" | "carro-e-moto";

export interface Plan {
  id: string;
  name: "Prata" | "Ouro" | "Diamante";
  price: number;
  payment: string; // [PREENCHER: ex. entrada + parcelas]
  featured?: boolean;
  benefits: string[];
}

export const PLAN_GROUPS: { id: PlanGroup; label: string }[] = [
  { id: "carro-ou-moto", label: "Carro ou Moto" },
  { id: "carro-e-moto", label: "Carro e Moto" },
];

const base = ["Veículos para exame prático", "Apostila on-line", "Agendamento de exames"];

export const PLANS: Record<PlanGroup, Plan[]> = {
  "carro-ou-moto": [
    { id: "prata-1", name: "Prata", price: 449, payment: "Consulte as condições de parcelamento", benefits: ["2 aulas práticas", ...base] },
    { id: "ouro-1", name: "Ouro", price: 699, payment: "Consulte as condições de parcelamento", featured: true, benefits: ["6 aulas práticas", ...base] },
    { id: "diamante-1", name: "Diamante", price: 899, payment: "Consulte as condições de parcelamento", benefits: ["10 aulas práticas", ...base] },
  ],
  "carro-e-moto": [
    { id: "prata-2", name: "Prata", price: 799, payment: "Consulte as condições de parcelamento", benefits: ["2 aulas práticas de carro", "2 aulas práticas de moto", ...base] },
    { id: "ouro-2", name: "Ouro", price: 999, payment: "Consulte as condições de parcelamento", featured: true, benefits: ["6 aulas práticas de carro", "6 aulas práticas de moto", ...base] },
    { id: "diamante-2", name: "Diamante", price: 1399, payment: "Consulte as condições de parcelamento", benefits: ["10 aulas práticas de carro", "10 aulas práticas de moto", ...base] },
  ],
};

export const MIN_PRICE = Math.min(...Object.values(PLANS).flat().map((p) => p.price));

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
