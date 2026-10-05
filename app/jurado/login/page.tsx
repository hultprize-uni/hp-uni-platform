import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { JuryLoginForm } from "@/components/jurado/jury-login-form";

export const metadata: Metadata = {
  title: "Iniciar sesion",
};

export default function JuryLoginPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-brand-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 65% at 50% 0%, black 35%, transparent 82%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-8 h-80 w-80 rounded-full bg-brand-pink/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-cyan/15 blur-[120px]"
      />

      <div className="relative mx-auto grid min-h-dvh w-full max-w-[1440px] lg:grid-cols-[1fr_1px_0.88fr]">
        <section className="flex min-h-[42vh] flex-col justify-between px-6 pb-10 pt-7 sm:px-10 sm:pb-12 sm:pt-9 lg:min-h-dvh lg:px-16 lg:pb-14 lg:pt-10 xl:px-24">
          <Link
            href="/"
            aria-label="Hult Prize at UNI, pagina principal"
            className="inline-flex w-fit rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-4 focus-visible:ring-offset-brand-ink"
          >
            <BrandLogo />
          </Link>

          <div className="max-w-xl py-12 lg:py-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-pink/30 bg-brand-pink/10 px-3 py-1.5 text-xs font-semibold uppercase text-brand-pink-3">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              Evaluacion privada
            </div>
            <h1 className="max-w-lg text-balance text-4xl font-bold leading-[1.06] text-white sm:text-5xl lg:text-6xl">
              Panel de jurado
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/65">
              Accede a tus equipos asignados y registra sus evaluaciones en un solo lugar.
            </p>
          </div>

          <p className="text-xs text-white/45">
            Plataforma de evaluacion - Hult Prize at UNI
          </p>
        </section>

        <div aria-hidden="true" className="hidden bg-white/10 lg:block" />

        <section className="flex items-center border-t border-white/10 px-6 py-12 sm:px-10 lg:border-t-0 lg:px-12 xl:px-20">
          <div className="mx-auto w-full max-w-[410px] rounded-2xl border border-white/10 bg-[#201d2e]/80 p-6 backdrop-blur-md sm:p-8">
            <div className="mb-9">
              <p className="mb-3 text-xs font-semibold uppercase text-brand-pink-3">
                Acceso privado
              </p>
              <h2 className="text-2xl font-bold text-white">Inicia sesion</h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Usa el correo y la contrasena asignados por el equipo organizador.
              </p>
            </div>

            <JuryLoginForm />

            <p className="mt-8 text-sm text-white/55">
              Necesitas ayuda? Contacta al equipo organizador.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
