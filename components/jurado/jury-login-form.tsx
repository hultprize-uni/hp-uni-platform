"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JuryLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("El acceso estara disponible cuando se conecte la autenticacion del jurado.");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="jury-email" className="text-sm font-medium text-white">
          Correo electronico
        </label>
        <input
          autoComplete="email"
          className="h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white caret-brand-pink outline-none transition-[border-color,box-shadow,background-color] placeholder:text-white/35 hover:border-white/20 hover:bg-white/[0.06] focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/40"
          id="jury-email"
          name="email"
          placeholder="nombre@correo.com"
          required
          type="email"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="jury-password" className="text-sm font-medium text-white">
          Contrasena
        </label>
        <div className="relative">
          <input
            autoComplete="current-password"
            className="h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3.5 pr-12 text-sm text-white caret-brand-pink outline-none transition-[border-color,box-shadow,background-color] placeholder:text-white/35 hover:border-white/20 hover:bg-white/[0.06] focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/40"
            id="jury-password"
            name="password"
            placeholder="Ingresa tu contrasena"
            required
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-white/50 transition-colors hover:text-brand-pink-3 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-pink"
            onClick={() => setShowPassword((visible) => !visible)}
            title={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
            type="button"
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        className="h-11 w-full justify-between bg-brand-pink px-4 text-white hover:bg-brand-pink-2 focus-visible:border-brand-pink-3 focus-visible:ring-brand-pink/45"
        size="lg"
        type="submit"
      >
        <span>Ingresar al panel</span>
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>

      <p aria-live="polite" className="min-h-5 text-sm leading-5 text-brand-pink-3" role="status">
        {notice}
      </p>
    </form>
  );
}
