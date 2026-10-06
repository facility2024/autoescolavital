import { useEffect, useRef, type ReactNode } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/track";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton({
  message,
  location,
  children,
  size = "lg",
  className,
  icon = true,
}: {
  message: string;
  location: string;
  children: ReactNode;
  size?: "default" | "lg" | "xl";
  className?: string;
  icon?: boolean;
}) {
  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("click_whatsapp", { location })}
      className={cn(buttonVariants({ variant: "whatsapp", size }), className)}
    >
      {icon && <MessageCircle aria-hidden />}
      {children}
    </a>
  );
}

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-10 max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-extrabold text-primary md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-lg text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Stars({ n = 5, className }: { n?: number; className?: string }) {
  return (
    <span className={cn("inline-flex text-highlight", className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={cn("size-4", i >= n && "opacity-30")} fill="currentColor">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  );
}
