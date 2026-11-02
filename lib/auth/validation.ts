export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export type FieldErrors = { email?: string; password?: string };

export function validateLogin(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email) errors.email = "Ingresa tu correo electrónico.";
  else if (email.length > 254 || !EMAIL_PATTERN.test(email))
    errors.email = "Ingresa un correo electrónico válido.";
  if (!password) errors.password = "Ingresa tu contraseña.";
  else if (password.length > 1024) errors.password = "La contraseña es demasiado larga.";
  return errors;
}

export function loginErrorMessage(error: { status?: number; name?: string; code?: string }): string {
  if (error.status === 429) return "Demasiados intentos. Espera un momento y vuelve a intentar.";
  if (error.name === "AuthRetryableFetchError" || !error.status || error.status >= 500)
    return "No pudimos conectar con el servicio. Revisa tu conexión e inténtalo de nuevo.";
  return "Correo o contraseña incorrectos.";
}
