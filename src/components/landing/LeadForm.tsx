import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, maskPhone } from "@/lib/whatsapp";
import { captureAttribution, trackEvent } from "@/lib/track";
import { DEFAULT_WA_MESSAGE } from "@/config/contact";
import { cn } from "@/lib/utils";

export const CATEGORIES = [
  "Carro (B)",
  "Moto (A)",
  "Carro e Moto (A+B)",
  "Adição de categoria",
  "Reabilitação",
] as const;

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(80),
  telefone: z
    .string()
    .refine((v) => v.replace(/\D/g, "").length === 11, "Informe DDD + 9 dígitos"),
  email: z.string().trim().email("E-mail inválido").max(120).optional().or(z.literal("")),
  categoria: z.enum(CATEGORIES, { errorMap: () => ({ message: "Escolha uma categoria" }) }),
  mensagem: z.string().max(500).optional(),
  lgpd: z.boolean().optional(),
  website: z.string().optional(), // honeypot
});

type FormData = z.infer<typeof schema>;

const field =
  "mt-1 block h-12 w-full rounded-xl border border-input bg-card px-3 text-base text-foreground placeholder:text-muted-foreground focus:border-ring";
const labelCls = "text-sm font-medium text-foreground";
const errCls = "mt-1 text-sm text-destructive";

export function LeadForm({ full = false, origin }: { full?: boolean; origin: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waUrl, setWaUrl] = useState(buildWhatsAppLink(DEFAULT_WA_MESSAGE));
  const [attempts, setAttempts] = useState(0);

  const ext = full
    ? schema.refine((d) => d.lgpd === true, { path: ["lgpd"], message: "Você precisa concordar para continuar" })
    : schema;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(ext) as never });

  const onSubmit = async (data: FormData) => {
    if (data.website) return; // bot
    if (attempts >= 5) {
      setStatus("error");
      return;
    }
    setAttempts((a) => a + 1);
    setStatus("loading");
    try {
      const attr = captureAttribution();
      const msg =
        `Olá! Meu nome é ${data.nome} e tenho interesse em ${data.categoria}.` +
        (data.mensagem ? ` ${data.mensagem}` : "") +
        ` Meu WhatsApp: ${data.telefone}.`;
      const url = buildWhatsAppLink(msg);
      setWaUrl(url);
      trackEvent("form_submit", { origin, categoria: data.categoria, ...attr });
      setStatus("success");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-card p-6 text-center shadow-soft" role="status">
        <CheckCircle2 className="mx-auto size-12 text-whatsapp" aria-hidden />
        <p className="mt-3 text-lg font-bold text-primary">Recebemos seu contato!</p>
        <p className="mt-1 text-muted-foreground">
          Abrimos o WhatsApp com sua mensagem. Se não abriu, toque abaixo.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex h-12 items-center gap-2 rounded-2xl bg-whatsapp px-6 font-semibold text-whatsapp-foreground"
        >
          <MessageCircle className="size-5" aria-hidden /> Abrir WhatsApp
        </a>
      </div>
    );
  }

  const id = (n: string) => `${origin}-${n}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="hidden" aria-hidden>
        <label>
          Não preencha <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>
      <div>
        <label htmlFor={id("nome")} className={labelCls}>Nome</label>
        <input id={id("nome")} autoComplete="name" className={field} placeholder="Seu nome" {...register("nome")} />
        {errors.nome && <p className={errCls}>{errors.nome.message}</p>}
      </div>
      <div>
        <label htmlFor={id("tel")} className={labelCls}>WhatsApp</label>
        <input
          id={id("tel")}
          inputMode="tel"
          autoComplete="tel"
          className={field}
          placeholder="(11) 91234-5678"
          {...register("telefone", {
            onChange: (e) => setValue("telefone", maskPhone(e.target.value)),
          })}
        />
        {errors.telefone && <p className={errCls}>{errors.telefone.message}</p>}
      </div>
      {full && (
        <div>
          <label htmlFor={id("email")} className={labelCls}>E-mail (opcional)</label>
          <input id={id("email")} type="email" autoComplete="email" className={field} {...register("email")} />
          {errors.email && <p className={errCls}>{errors.email.message}</p>}
        </div>
      )}
      <div>
        <label htmlFor={id("cat")} className={labelCls}>Categoria desejada</label>
        <select id={id("cat")} className={field} defaultValue="" {...register("categoria")}>
          <option value="" disabled>Selecione</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.categoria && <p className={errCls}>{errors.categoria.message}</p>}
      </div>
      {full && (
        <>
          <div>
            <label htmlFor={id("msg")} className={labelCls}>Mensagem (opcional)</label>
            <textarea id={id("msg")} rows={3} className={cn(field, "h-auto py-2")} {...register("mensagem")} />
          </div>
          <div>
            <label className="flex items-start gap-3 text-sm text-foreground">
              <input type="checkbox" className="mt-0.5 size-5 accent-primary" {...register("lgpd")} />
              <span>
                Concordo com o contato e com a{" "}
                <a href="/privacidade" className="font-medium text-primary underline">Política de Privacidade</a>.
              </span>
            </label>
            {errors.lgpd && <p className={errCls}>{errors.lgpd.message}</p>}
          </div>
        </>
      )}
      {status === "error" && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          Não foi possível enviar agora.{" "}
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            Fale direto no WhatsApp
          </a>
          .
        </div>
      )}
      <Button type="submit" variant="highlight" size="lg" className="w-full" disabled={status === "loading"}>
        {status === "loading" && <Loader2 className="animate-spin" aria-hidden />}
        Receber contato
      </Button>
      {!full && (
        <p className="text-center text-xs text-muted-foreground">
          Ao enviar, você concorda com nossa{" "}
          <a href="/privacidade" className="underline">Política de Privacidade</a>.
        </p>
      )}
    </form>
  );
}
