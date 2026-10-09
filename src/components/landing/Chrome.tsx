import { useEffect, useState } from "react";
import { MessageCircle, Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import logo from "@/assets/logotipo_novo.jpg.asset.json";
import { CONTACT, DEFAULT_WA_MESSAGE } from "@/config/contact";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { loadTrackers, trackEvent } from "@/lib/track";
import { WhatsAppButton } from "./shared";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#inicio" aria-label="Autoescola Vital - início">
          <img src={logo.url} alt="Logotipo Autoescola Vital" width={400} height={216} className="h-11 w-auto" />
        </a>
        <div className="flex items-center gap-2">
          <a
            href={CONTACT.phoneHref}
            onClick={() => trackEvent("click_phone", { location: "header" })}
            aria-label={`Ligar para ${CONTACT.phoneDisplay}`}
            className="inline-flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary md:hidden"
          >
            <Phone className="size-5" aria-hidden />
          </a>
          <WhatsAppButton message={DEFAULT_WA_MESSAGE} location="header" size="default" className="px-3 sm:px-4">
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </WhatsAppButton>
        </div>
      </div>
    </header>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppLink(DEFAULT_WA_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      onClick={() => trackEvent("click_whatsapp", { location: "flutuante" })}
      className="wa-pulse fixed bottom-20 right-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift md:bottom-6 md:right-6"
    >
      <MessageCircle className="size-7" aria-hidden />
    </a>
  );
}

export function StickyMobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-border bg-card p-2 md:hidden">
      <a
        href={buildWhatsAppLink(DEFAULT_WA_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("click_whatsapp", { location: "barra_mobile" })}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-whatsapp font-semibold text-whatsapp-foreground"
      >
        <MessageCircle className="size-5" aria-hidden /> WhatsApp
      </a>
      <a
        href={CONTACT.phoneHref}
        onClick={() => trackEvent("click_phone", { location: "barra_mobile" })}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-primary-foreground"
      >
        <Phone className="size-5" aria-hidden /> Ligar
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-background pb-24 pt-12 text-foreground md:pb-12">
      <div className="container-page grid gap-8 md:grid-cols-3">
        <div>
          <img src={logo.url} alt="Logotipo Autoescola Vital" width={400} height={216} loading="lazy" className="h-14 w-auto rounded-xl bg-card p-1.5" />
          <p className="mt-4 text-sm text-foreground/80">
            Autoescola na Lapa, São Paulo. Primeira habilitação, adição de categoria e reabilitação de CNH.
          </p>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-2"><MapPin className="size-4 shrink-0" aria-hidden />{CONTACT.addressFull}</li>
          {CONTACT.hours.map((h) => (
            <li key={h.label} className="flex gap-2"><Clock className="size-4 shrink-0" aria-hidden />{h.label}: {h.value}</li>
          ))}
        </ul>
        <ul className="space-y-3 text-sm">
          <li><a className="flex gap-2 hover:underline" href={CONTACT.phoneHref} onClick={() => trackEvent("click_phone", { location: "rodape" })}><Phone className="size-4" aria-hidden />{CONTACT.phoneDisplay}</a></li>
          <li><a className="flex gap-2 hover:underline" href={buildWhatsAppLink(DEFAULT_WA_MESSAGE)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { location: "rodape" })}><MessageCircle className="size-4" aria-hidden />{CONTACT.whatsappDisplay}</a></li>
          <li><a className="flex gap-2 hover:underline" href={`mailto:${CONTACT.email}`} onClick={() => trackEvent("click_email", { location: "rodape" })}><Mail className="size-4" aria-hidden />{CONTACT.email}</a></li>
          <li className="flex gap-3 pt-1">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Autoescola Vital" className="inline-flex size-11 items-center justify-center rounded-xl bg-primary-foreground/10"><Instagram className="size-5" aria-hidden /></a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook da Autoescola Vital" className="inline-flex size-11 items-center justify-center rounded-xl bg-primary-foreground/10"><Facebook className="size-5" aria-hidden /></a>
          </li>
        </ul>
      </div>
      <div className="container-page mt-10 border-t border-foreground/15 pt-6 text-xs text-foreground/70">
        <p>
          © {new Date().getFullYear()} {CONTACT.name}
          {CONTACT.cnpj && ` · CNPJ ${CONTACT.cnpj}`}. Seus dados são usados apenas para retornar seu contato, conforme a LGPD.{" "}
          <a href="/privacidade" className="underline">Política de Privacidade</a>
        </p>
      </div>
    </footer>
  );
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const c = localStorage.getItem("vital_consent");
    if (c === "yes") loadTrackers();
    else if (!c) setShow(true);
  }, []);
  if (!show) return null;
  const decide = (v: "yes" | "no") => {
    localStorage.setItem("vital_consent", v);
    if (v === "yes") loadTrackers();
    setShow(false);
  };
  return (
    <div role="dialog" aria-label="Aviso de cookies" className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-xl rounded-2xl border border-border bg-card p-4 shadow-lift md:bottom-6">
      <p className="text-sm text-foreground">
        Usamos cookies para medir visitas e melhorar o atendimento. Veja a{" "}
        <a href="/privacidade" className="font-medium text-primary underline">Política de Privacidade</a>.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" className="h-10 px-4" onClick={() => decide("yes")}>Aceitar</Button>
        <Button size="sm" variant="outline" className="h-10 px-4" onClick={() => decide("no")}>Recusar</Button>
      </div>
    </div>
  );
}

export function ScrollTracker() {
  useEffect(() => {
    let sent = false;
    const onScroll = () => {
      if (sent) return;
      const h = document.documentElement;
      if ((h.scrollTop + window.innerHeight) / h.scrollHeight >= 0.75) {
        sent = true;
        trackEvent("scroll_75");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
