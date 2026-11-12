// Contrato de respuesta compartido por todas las Server Actions (Issue #15).
// Vive fuera de los archivos "use server", que solo pueden exportar funciones async.
export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
