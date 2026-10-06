import { createFileRoute } from "@tanstack/react-router";
import { Header, FloatingWhatsApp, StickyMobileBar, Footer, CookieBanner, ScrollTracker } from "@/components/landing/Chrome";
import { Hero, Stats, Plans, HowItWorks, Benefits, Gallery, Testimonials, Services, FAQSection, Contact, FinalCTA } from "@/components/landing/Sections";
import { CONTACT } from "@/config/contact";
import { FAQ } from "@/data/faq";
import { PLANS } from "@/data/plans";

const title = "Autoescola na Lapa, SP | CNH a partir de R$ 449 | Vital";
const description =
  "Tire sua CNH na Lapa com a Autoescola Vital. Carro, moto, adição de categoria e reabilitação. Planos facilitados. WhatsApp (11) 94828-6616.";

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    name: CONTACT.name,
    url: CONTACT.siteUrl,
    telephone: "+55-11-3832-2200",
    email: CONTACT.email,
    priceRange: "R$ 449 - R$ 1.399",
    address: { "@type": "PostalAddress", streetAddress: CONTACT.street, addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "12:00" },
    ],
    sameAs: [CONTACT.instagram, CONTACT.facebook],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", reviewCount: CONTACT.googleReviews },
    makesOffer: Object.entries(PLANS).flatMap(([g, ps]) =>
      ps.map((p) => ({ "@type": "Offer", name: `Plano ${p.name} (${g})`, price: p.price, priceCurrency: "BRL" })),
    ),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CONTACT.siteUrl }],
    scripts: ld.map((d) => ({ type: "application/ld+json", children: JSON.stringify(d) })),
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-xl focus:bg-card focus:p-3">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Stats />
        <Plans />
        <HowItWorks />
        <Benefits />
        <Gallery />
        <Testimonials />
        <Services />
        <FAQSection />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <StickyMobileBar />
      <CookieBanner />
      <ScrollTracker />
    </>
  );
}
