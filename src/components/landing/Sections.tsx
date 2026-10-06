import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  BadgeCheck, Wallet, Landmark, Check, MessageCircle, FileText, BookOpen, ClipboardCheck,
  Car, Award, CalendarClock, MapPin, Bike, RotateCcw, Plus, Phone, Mail, Clock, Instagram,
  Facebook, Navigation, Star, X,
} from "lucide-react";
import heroImg from "@/assets/loira_topo_cnh.png.asset.json";
import carImg from "@/assets/carro_aula_novo.jpg.asset.json";
import motoImg from "@/assets/moto_aula_nova.jpg.asset.json";
import fachadaImg from "@/assets/sede_lapa_nova.jpg.asset.json";
import aulaImg from "@/assets/podium1.webp.asset.json";
import casalImg from "@/assets/casal_cnh.webp.asset.json";
import loiraImg from "@/assets/loira_segrando_cnh.webp.asset.json";
import { CONTACT, DEFAULT_WA_MESSAGE } from "@/config/contact";
import { PLANS, PLAN_GROUPS, MIN_PRICE, formatBRL, type PlanGroup } from "@/data/plans";
import { FAQ } from "@/data/faq";
import { TESTIMONIALS } from "@/data/testimonials";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/track";
import { buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { LeadForm } from "./LeadForm";
import { Reveal, SectionHeading, Stars, WhatsAppButton } from "./shared";

/* 5.1 HERO */
export function Hero() {
  return (
    <section id="inicio" className="bg-hero relative overflow-hidden pt-16 text-primary-foreground">
      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-sm font-medium">
            <MapPin className="size-4 text-highlight" aria-hidden /> Autoescola na Lapa · São Paulo
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] md:text-5xl lg:text-[3.4rem]">
            Tire sua CNH na Lapa com planos a partir de{" "}
            <span className="text-highlight">{formatBRL(MIN_PRICE).replace(",00", "")}</span> e atendimento rápido
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/85">
            Primeira habilitação, adição de categoria e reabilitação com instrutores credenciados, aulas flexíveis e
            suporte completo com o Detran-SP.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton message={DEFAULT_WA_MESSAGE} location="hero" size="xl">Quero tirar minha CNH</WhatsAppButton>
            <a href="#planos" className={buttonVariants({ variant: "onDark", size: "xl" })}>Ver planos</a>
          </div>
          <a
            href={CONTACT.googleProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm hover:underline"
          >
            <Stars />
            <strong>{CONTACT.googleRating}</strong> no Google · {CONTACT.googleReviews} avaliações
          </a>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
            {[
              { i: Wallet, t: "Parcelamento facilitado" },
              { i: BadgeCheck, t: "Instrutores credenciados" },
              { i: Landmark, t: "Suporte no Detran" },
            ].map(({ i: I, t }) => (
              <li key={t} className="flex items-center gap-2"><I className="size-5 text-highlight" aria-hidden />{t}</li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative mx-auto hidden h-[300px] w-[300px] sm:block lg:h-[340px] lg:w-[340px]">
            <div className="absolute inset-4 rounded-full bg-highlight" />
            <img
              src={heroImg.url}
              alt="Mulher sorridente segurando sua CNH"
              width={800}
              height={573}
              fetchPriority="high"
              className="absolute bottom-0 left-1/2 h-full w-full -translate-x-1/2 object-contain"
            />
          </div>
          <div className="relative z-10 mx-auto max-w-md rounded-3xl bg-card p-6 text-card-foreground shadow-lift sm:-mt-6">
            <p className="text-xl font-bold text-primary">Receba um orçamento agora</p>
            <p className="mb-4 text-sm text-muted-foreground">Respondemos pelo WhatsApp em horário comercial.</p>
            <LeadForm origin="hero" />
          </div>
        </div>
      </div>
      <div className="road-stripe" aria-hidden />
    </section>
  );
}

/* 5.2 NÚMEROS — somente dados confirmados */
function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setV(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / 1200);
        setV(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export function Stats() {
  // [PREENCHER] anos de mercado, alunos habilitados e % de aprovação — adicionar aqui quando confirmados.
  const items = [
    { node: <Counter to={4.7} decimals={1} />, label: "Nota no Google" },
    { node: <Counter to={CONTACT.googleReviews} />, label: "Avaliações de alunos" },
    { node: <Counter to={15} suffix="+" />, label: "Anos habilitando cidadãos" },
  ];
  return (
    <section aria-label="Números da Autoescola Vital" className="border-b border-border bg-card">
      <div className="container-page grid grid-cols-3 gap-4 py-8 text-center sm:gap-6">
        {items.map((s) => (
          <div key={s.label}>
            <p className="font-display text-2xl font-extrabold text-primary sm:text-3xl md:text-5xl">{s.node}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 5.3 PLANOS */
export function Plans() {
  const [group, setGroup] = useState<PlanGroup>("carro-ou-moto");
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { trackEvent("view_plans"); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const groupLabel = PLAN_GROUPS.find((g) => g.id === group)!.label;

  return (
    <section id="planos" ref={ref} className="py-16 md:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Planos" title="Escolha o plano ideal para você" sub="Preços claros, sem surpresa. Todos incluem veículo para o exame e agendamento." />
        <div role="tablist" aria-label="Tipo de plano" className="mx-auto mb-10 flex w-fit rounded-2xl bg-secondary p-1.5">
          {PLAN_GROUPS.map((g) => (
            <button
              key={g.id}
              role="tab"
              aria-selected={group === g.id}
              onClick={() => setGroup(g.id)}
              className={cn(
                "h-12 rounded-xl px-5 text-sm font-semibold transition-colors sm:px-8 sm:text-base",
                group === g.id ? "bg-primary text-primary-foreground shadow-soft" : "text-primary",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
          {PLANS[group].map((p) => (
            <article
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-card p-7 shadow-soft",
                p.featured ? "border-2 border-highlight shadow-lift md:-translate-y-3" : "border-border",
              )}
            >
              {p.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-highlight px-4 py-1 text-xs font-bold uppercase tracking-wide text-highlight-foreground">
                  Mais escolhido
                </span>
              )}
              <h3 className="text-xl font-bold text-primary">Plano {p.name}</h3>
              <p className="text-sm text-muted-foreground">{groupLabel}</p>
              <p className="mt-5 font-display text-4xl font-extrabold text-foreground">{formatBRL(p.price)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.payment}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-foreground">
                    <Check className="mt-0.5 size-5 shrink-0 text-whatsapp" aria-hidden />{b}
                  </li>
                ))}
              </ul>
              <WhatsAppButton
                message={`Olá! Tenho interesse no plano ${p.name} (${groupLabel}). Pode me passar mais informações?`}
                location={`plano_${p.name.toLowerCase()}`}
                className="mt-7 w-full"
              >
                Quero o plano {p.name}
              </WhatsAppButton>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
          Valores sujeitos a alteração. Taxas do Detran-SP e exames médico e psicológico não incluídos.
        </p>
      </div>
    </section>
  );
}

/* 5.4 COMO FUNCIONA */
export function HowItWorks() {
  // [AJUSTAR conforme as regras atuais do Detran-SP e da nova CNH]
  const steps = [
    { i: MessageCircle, t: "Fale conosco", d: "Chame no WhatsApp e escolha seu plano." },
    { i: FileText, t: "Documentação e exames", d: "Abrimos seu processo e agendamos os exames." },
    { i: BookOpen, t: "Aulas teóricas", d: "Estude com a apostila on-line no seu ritmo." },
    { i: ClipboardCheck, t: "Prova teórica", d: "Você faz a prova no Detran-SP." },
    { i: Car, t: "Aulas práticas", d: "Treine com instrutor credenciado." },
    { i: Award, t: "Prova prática e CNH", d: "Usa nosso veículo no exame e sai habilitado." },
  ];
  return (
    <section id="como-funciona" className="bg-secondary py-16 md:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Passo a passo" title="Como funciona para tirar sua CNH" />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, idx) => (
            <Reveal key={s.t}>
              <li className="flex h-full gap-4 rounded-2xl bg-card p-5 shadow-soft">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-primary"><s.i className="size-4 text-highlight-foreground" aria-hidden />{s.t}</h3>
                  <p className="mt-1 text-muted-foreground">{s.d}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <WhatsAppButton message={DEFAULT_WA_MESSAGE} location="como_funciona" size="xl">Começar meu processo</WhatsAppButton>
        </div>
      </div>
    </section>
  );
}

/* 5.5 DIFERENCIAIS */
export function Benefits() {
  const items = [
    { i: Landmark, t: "Suporte junto ao Detran", d: "Agendamos seus exames e acompanhamos cada etapa do processo." },
    { i: BadgeCheck, t: "Instrutores credenciados", d: "Aulas práticas com profissionais habilitados pelo Detran-SP." },
    { i: Car, t: "Frota de carro e moto", d: "Veículos identificados, revisados e usados também no dia do exame." },
    { i: Wallet, t: "Parcelamento", d: "Condições facilitadas para caber no seu orçamento." },
    { i: CalendarClock, t: "Atendimento aos sábados", d: "Segunda a sexta das 8h às 17h e sábados das 8h às 12h." }, // [CONFIRMAR horários de aula]
    { i: MapPin, t: "Na Lapa", d: "Rua Brigadeiro Gavião Peixoto, 35, perto do comércio e do transporte da região." },
  ];
  return (
    <section id="diferenciais" className="py-16 md:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Por que a Vital" title="Por que escolher a Autoescola Vital" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <Reveal key={b.t}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-highlight/20 text-primary">
                  <b.i className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary">{b.t}</h3>
                <p className="mt-1 text-muted-foreground">{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 5.6 FROTA E ESTRUTURA */
const GALLERY = [
  { src: carImg.url, w: 906, h: 676, alt: "Carro de aula da Autoescola Vital identificado na Lapa", cap: "Carro de aula identificado" },
  { src: motoImg.url, w: 911, h: 682, alt: "Moto de aula da Autoescola Vital para categoria A", cap: "Moto de aula para categoria A" },
  { src: fachadaImg.url, w: 909, h: 677, alt: "Fachada e frota revisada da Autoescola Vital na Rua Brigadeiro Gavião Peixoto, Lapa", cap: "Nossa sede na Lapa" },
  { src: aulaImg.url, w: 1200, h: 551, alt: "Aluna em aula prática de direção com instrutor", cap: "Aula prática com instrutor" },
];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <section id="frota" className="bg-secondary py-16 md:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Estrutura" title="Nossa frota e estrutura" sub="Os mesmos veículos das aulas acompanham você no exame prático." />
        <div className="grid gap-5 sm:grid-cols-2">
          {GALLERY.map((g, i) => (
            <figure key={g.src} className="overflow-hidden rounded-2xl bg-card shadow-soft">
              <button onClick={() => setOpen(i)} className="block w-full" aria-label={`Ampliar foto: ${g.cap}`}>
                <img
                  src={g.src}
                  alt={g.alt}
                  width={g.w}
                  height={g.h}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </button>
              <figcaption className="px-5 py-3 text-sm font-medium text-foreground">{g.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={GALLERY[open]!.cap} className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-deep/90 p-4" onClick={() => setOpen(null)}>
          <button aria-label="Fechar" className="absolute right-4 top-4 inline-flex size-12 items-center justify-center rounded-full bg-card text-primary" onClick={() => setOpen(null)}>
            <X className="size-6" aria-hidden />
          </button>
          <img src={GALLERY[open]!.src} alt={GALLERY[open]!.alt} className="max-h-[85vh] max-w-full rounded-2xl bg-card object-contain" />
        </div>
      )}
    </section>
  );
}

/* 5.7 DEPOIMENTOS */
export function Testimonials() {
  return (
    <section id="depoimentos" className="py-16 md:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Prova social" title="Quem tirou a CNH com a gente aprova" />
        <div className="mx-auto grid max-w-4xl items-center gap-8 rounded-3xl bg-primary p-8 text-primary-foreground shadow-lift md:grid-cols-[auto_1fr] md:p-10">
          <div className="text-center">
            <p className="font-display text-6xl font-extrabold">{CONTACT.googleRating}</p>
            <Stars className="mt-2 [&_svg]:size-6" />
            <p className="mt-2 text-sm text-primary-foreground/80">{CONTACT.googleReviews} avaliações no Google</p>
          </div>
          <div>
            <p className="text-lg">
              Mais de quinhentos alunos já avaliaram a Autoescola Vital no Google. Leia as opiniões de quem passou por aqui antes de decidir.
            </p>
            <a
              href={CONTACT.googleProfile}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "highlight", size: "lg" }), "mt-5")}
            >
              <Star aria-hidden /> Ver todas as avaliações no Google
            </a>
          </div>
        </div>
        {TESTIMONIALS.length > 0 && (
          <div className="-mx-5 mt-10 flex snap-x gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="min-w-[80%] snap-start rounded-2xl border border-border bg-card p-6 shadow-soft md:min-w-0">
                <Stars n={t.stars} />
                <blockquote className="mt-3 text-foreground">“{t.text}”</blockquote>
                <figcaption className="mt-4 text-sm"><strong className="text-primary">{t.name}</strong> · {t.category}</figcaption>
              </figure>
            ))}
          </div>
        )}
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-2">
          <img src={casalImg.url} alt="Casal de alunos comemorando a CNH aprovada" width={538} height={397} loading="lazy" className="mx-auto h-56 w-auto object-contain md:h-72" />
          <img src={loiraImg.url} alt="Aluna feliz segurando a carteira de habilitação" width={800} height={573} loading="lazy" className="mx-auto h-56 w-auto object-contain md:h-72" />
        </div>
      </div>
    </section>
  );
}

/* 5.8 SERVIÇOS */
export function Services() {
  const items = [
    { i: Car, t: "Primeira Habilitação", d: "Carro (B), moto (A) ou os dois juntos. Do cadastro no Detran até a prova prática.", m: "Olá! Quero tirar minha primeira habilitação. Pode me passar informações?" },
    { i: Plus, t: "Adição de Categoria", d: "Já tem CNH de carro ou moto? Inclua a outra categoria com aulas objetivas.", m: "Olá! Quero fazer adição de categoria na minha CNH. Como funciona?" },
    { i: RotateCcw, t: "Reabilitação de CNH", d: "Volte a dirigir com segurança e regularize sua situação com nosso suporte.", m: "Olá! Preciso fazer a reabilitação da minha CNH. Pode me ajudar?" },
  ];
  return (
    <section id="servicos" className="bg-secondary py-16 md:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Serviços" title="Habilitação de carro e moto na Lapa" />
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((s) => (
            <Reveal key={s.t}>
              <article className="flex h-full flex-col rounded-2xl bg-card p-7 shadow-soft">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <s.i className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-xl font-bold text-primary">{s.t}</h3>
                <p className="mt-2 flex-1 text-muted-foreground">{s.d}</p>
                <WhatsAppButton message={s.m} location={`servico_${s.t.split(" ")[0]!.toLowerCase()}`} className="mt-6 w-full">
                  Saber mais
                </WhatsAppButton>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="sr-only"><Bike /> </p>
      </div>
    </section>
  );
}

/* 5.9 FAQ */
export function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="Dúvidas" title="Perguntas frequentes" />
        <Accordion type="single" collapsible className="space-y-3">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`f${i}`} className="rounded-2xl border border-border bg-card px-5 shadow-soft">
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-primary hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-base text-muted-foreground">
                {f.a}{" "}
                <a
                  href={buildWhatsAppLink(`Olá! Tenho uma dúvida: ${f.q}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("click_whatsapp", { location: "faq" })}
                  className="font-semibold text-primary underline"
                >
                  Tirar dúvida no WhatsApp
                </a>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* 5.10 CONTATO */
function LazyMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setShow(true); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-soft">
      {show && (
        <iframe
          title="Mapa: Autoescola Vital, Rua Brigadeiro Gavião Peixoto, 35, Lapa"
          src={CONTACT.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      )}
    </div>
  );
}

export function Contact() {
  const row = "flex items-start gap-3 text-foreground";
  return (
    <section id="contato" className="bg-secondary py-16 md:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Contato" title="Venha nos visitar na Lapa" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <ul className="space-y-4 rounded-2xl bg-card p-6 shadow-soft">
              <li className={row}><MapPin className="mt-0.5 size-5 text-primary" aria-hidden />{CONTACT.addressFull}</li>
              <li className={row}><Clock className="mt-0.5 size-5 text-primary" aria-hidden /><span>{CONTACT.hours.map((h) => <span key={h.label} className="block">{h.label}: {h.value}</span>)}</span></li>
              <li><a className={cn(row, "font-medium hover:underline")} href={CONTACT.phoneHref} onClick={() => trackEvent("click_phone", { location: "contato" })}><Phone className="size-5 text-primary" aria-hidden />{CONTACT.phoneDisplay}</a></li>
              <li><a className={cn(row, "font-medium hover:underline")} href={buildWhatsAppLink(DEFAULT_WA_MESSAGE)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { location: "contato" })}><MessageCircle className="size-5 text-whatsapp" aria-hidden />{CONTACT.whatsappDisplay}</a></li>
              <li><a className={cn(row, "font-medium hover:underline")} href={`mailto:${CONTACT.email}`} onClick={() => trackEvent("click_email", { location: "contato" })}><Mail className="size-5 text-primary" aria-hidden />{CONTACT.email}</a></li>
              <li className="flex gap-3">
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Autoescola Vital" className="inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-primary"><Instagram className="size-5" aria-hidden /></a>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook da Autoescola Vital" className="inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-primary"><Facebook className="size-5" aria-hidden /></a>
              </li>
            </ul>
            <LazyMap />
            <a href={CONTACT.mapsDirections} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: "lg" }), "w-full rounded-2xl")}>
              <Navigation aria-hidden /> Como chegar
            </a>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
            <h3 className="text-2xl font-bold text-primary">Peça seu contato</h3>
            <p className="mb-5 text-muted-foreground">Preencha e continue a conversa pelo WhatsApp.</p>
            <LeadForm full origin="contato" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 5.11 CTA FINAL */
export function FinalCTA() {
  return (
    <section className="bg-hero py-16 text-center text-primary-foreground md:py-20">
      <div className="container-page">
        <h2 className="text-3xl font-extrabold md:text-5xl">Pronto para começar?</h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-primary-foreground/85">
          Fale agora com a Vital e saia com seu plano definido hoje mesmo.
        </p>
        <WhatsAppButton message={DEFAULT_WA_MESSAGE} location="cta_final" size="xl" className="mt-8">
          Chamar no WhatsApp
        </WhatsAppButton>
      </div>
    </section>
  );
}

export { lazy, Suspense };
