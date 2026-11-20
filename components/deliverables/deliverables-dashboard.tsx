"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { DeliverableCard } from "./deliverable-card";
import {
  uploadDeliverableAction,
  type DeliverableView,
} from "@/lib/actions/deliverables";

interface DeliverablesDashboardProps {
  initialDeliverables: DeliverableView[];
  initialError?: string | null;
}

export function DeliverablesDashboard({
  initialDeliverables,
  initialError,
}: DeliverablesDashboardProps) {
  const [deliverables, setDeliverables] = React.useState<DeliverableView[]>(
    initialDeliverables
  );
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [uploadingKey, setUploadingKey] = React.useState<string | null>(null);
  const [, startTransition] = React.useTransition();

  const handleUpload = async (
    key: string,
    payload: { file?: File; videoUrl?: string }
  ): Promise<{ success: boolean; message: string }> => {
    setFeedback(null);
    setUploadingKey(key);

    const formData = new FormData();
    formData.append("key", key);
    if (payload.file) formData.append("file", payload.file);
    if (payload.videoUrl) formData.append("videoUrl", payload.videoUrl);

    try {
      const res = await uploadDeliverableAction(formData);

      if (res.success && res.data) {
        const updated = res.data;
        startTransition(() => {
          setDeliverables((prev) =>
            prev.map((item) => (item.key === updated.key ? updated : item))
          );
        });
        setFeedback({ type: "success", message: res.message });
        return { success: true, message: res.message };
      } else {
        const msg = res.message || "Error al procesar el entregable.";
        setFeedback({ type: "error", message: msg });
        return { success: false, message: msg };
      }
    } catch {
      const msg = "Error de conexión al enviar el archivo. Inténtalo de nuevo.";
      setFeedback({ type: "error", message: msg });
      return { success: false, message: msg };
    } finally {
      setUploadingKey(null);
    }
  };

  // Si no está registrado en un equipo
  if (initialError?.includes("equipo")) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center sm:p-12">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Users className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight">
          Equipo no vinculado
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {initialError}
        </p>
        <div className="mt-6">
          <Link href="/registro" className={buttonVariants()}>
            Completar inscripción de equipo
          </Link>
        </div>
      </div>
    );
  }

  const uploadedCount = deliverables.filter(
    (d) => d.status === "SUBIDO" || d.status === "RECIBIDO"
  ).length;

  return (
    <div className="space-y-6">
      {/* Banner de progreso de entregas */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-base font-semibold sm:text-lg">
            Progreso de entrega: {uploadedCount} de {deliverables.length} completados
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Asegúrate de completar todos los entregables antes de la fecha límite para asegurar la evaluación del jurado.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-muted sm:w-40">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: deliverables.length
                  ? `${(uploadedCount / deliverables.length) * 100}%`
                  : "0%",
              }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums text-muted-foreground">
            {deliverables.length
              ? Math.round((uploadedCount / deliverables.length) * 100)
              : 0}
            %
          </span>
        </div>
      </div>

      {/* Alertas globales de feedback */}
      {feedback && (
        <Alert
          variant={feedback.type === "error" ? "destructive" : "default"}
          className={
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
              : ""
          }
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          <AlertTitle>
            {feedback.type === "success" ? "Operación exitosa" : "Atención"}
          </AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">
            {feedback.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Grid de Entregables */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deliverables.map((item) => (
          <DeliverableCard
            key={item.key}
            deliverable={item}
            onUpload={handleUpload}
            isUploading={uploadingKey === item.key}
          />
        ))}
      </div>
    </div>
  );
}
