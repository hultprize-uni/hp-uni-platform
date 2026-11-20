"use client";

import * as React from "react";
import {
  FileText,
  Video,
  Upload,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  FileCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { DeliverableView } from "@/lib/actions/deliverables";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

interface DeliverableCardProps {
  deliverable: DeliverableView;
  onUpload: (
    key: string,
    payload: { file?: File; videoUrl?: string }
  ) => Promise<{ success: boolean; message: string }>;
  isUploading: boolean;
}

export function DeliverableCard({
  deliverable,
  onUpload,
  isUploading,
}: DeliverableCardProps) {
  const isVideo = deliverable.accepts.includes("LINK");
  const isUploaded = deliverable.status === "SUBIDO" || deliverable.status === "RECIBIDO";

  const [isReplacing, setIsReplacing] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [videoUrl, setVideoUrl] = React.useState(
    isVideo && deliverable.viewUrl ? deliverable.viewUrl : ""
  );
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const showUploadForm = !isUploaded || isReplacing;

  const acceptMimeOrExt = React.useMemo(() => {
    if (isVideo) return "";
    const list: string[] = [];
    if (deliverable.accepts.includes("PDF")) list.push(".pdf");
    if (deliverable.accepts.includes("DOCX")) list.push(".docx");
    return list.join(",");
  }, [deliverable.accepts, isVideo]);

  const handleFileChange = (file: File | undefined) => {
    setLocalError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setLocalError("El archivo supera el límite máximo permitido de 10 MB.");
      setSelectedFile(null);
      return;
    }

    const extension = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
    const allowed = acceptMimeOrExt.split(",");
    if (!allowed.includes(extension)) {
      setLocalError(`Formato no permitido. Solo se acepta ${deliverable.accepts.join(" o ")}.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (isVideo) {
      const trimmed = videoUrl.trim();
      if (!trimmed) {
        setLocalError("Ingresa un enlace de video.");
        return;
      }
      try {
        const parsed = new URL(trimmed);
        if (parsed.protocol !== "https:") {
          setLocalError("El enlace debe ser seguro (https://).");
          return;
        }
        const allowedHosts = [
          "youtube.com",
          "www.youtube.com",
          "m.youtube.com",
          "youtu.be",
          "vimeo.com",
          "www.vimeo.com",
          "drive.google.com",
        ];
        if (!allowedHosts.includes(parsed.hostname.toLowerCase())) {
          setLocalError("El enlace debe ser de YouTube, Vimeo o Google Drive.");
          return;
        }
      } catch {
        setLocalError("Ingresa una URL válida.");
        return;
      }

      const res = await onUpload(deliverable.key, { videoUrl: trimmed });
      if (!res.success) {
        setLocalError(res.message);
      } else {
        setIsReplacing(false);
      }
    } else {
      if (!selectedFile) {
        setLocalError("Selecciona un archivo antes de enviar.");
        return;
      }

      const res = await onUpload(deliverable.key, { file: selectedFile });
      if (!res.success) {
        setLocalError(res.message);
      } else {
        setSelectedFile(null);
        setIsReplacing(false);
      }
    }
  };

  return (
    <Card className="flex flex-col justify-between border-border/80 shadow-sm transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {isVideo ? <Video className="size-5" /> : <FileText className="size-5" />}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{deliverable.title}</CardTitle>
              <CardDescription className="text-xs">
                Acepta:{" "}
                <span className="font-medium text-foreground">
                  {deliverable.accepts.join(", ")}
                </span>
                {!isVideo && " (máx. 10 MB)"}
              </CardDescription>
            </div>
          </div>

          <StatusBadge status={deliverable.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información del archivo/enlace subido si existe */}
        {isUploaded && (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 text-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileCheck className="size-4 shrink-0 text-primary" />
                <span className="truncate font-medium">
                  {isVideo ? "Enlace registrado" : `Archivo ${deliverable.fileType ?? "subido"}`}
                </span>
              </div>
              {deliverable.viewUrl && (
                <a
                  href={deliverable.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                >
                  <span>{isVideo ? "Abrir video" : "Ver archivo"}</span>
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            {deliverable.uploadedAt && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Última actualización:{" "}
                {new Date(deliverable.uploadedAt).toLocaleString("es-PE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>
        )}

        {/* Alerta si el plazo ha concluido */}
        {!deliverable.canReplace && (
          <Alert variant="default" className="border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
            <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-xs">
              El plazo para subir o modificar este entregable ha finalizado.
            </AlertDescription>
          </Alert>
        )}

        {/* Botón para alternar formulario de reemplazo si ya está subido */}
        {isUploaded && deliverable.canReplace && !showUploadForm && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2 border-dashed"
            onClick={() => setIsReplacing(true)}
            disabled={isUploading}
          >
            <RefreshCw className="size-3.5" />
            <span>Reemplazar entrega</span>
          </Button>
        )}

        {/* Formulario de Carga / Reemplazo */}
        {deliverable.canReplace && showUploadForm && (
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {isVideo ? (
              <div className="space-y-1.5">
                <Label htmlFor={`video-${deliverable.key}`} className="text-xs">
                  Enlace del video pitch (YouTube, Vimeo, Drive)
                </Label>
                <Input
                  id={`video-${deliverable.key}`}
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  disabled={isUploading}
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptMimeOrExt}
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                  disabled={isUploading}
                />
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    handleFileChange(e.dataTransfer.files?.[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <Upload className="mb-1.5 size-5 text-muted-foreground" />
                  <p className="text-xs font-medium">
                    {selectedFile ? (
                      <span className="text-primary font-semibold truncate max-w-[200px] inline-block align-middle">
                        {selectedFile.name}
                      </span>
                    ) : (
                      "Haz clic o arrastra tu archivo aquí"
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : `${deliverable.accepts.join(", ")} hasta 10 MB`}
                  </p>
                </div>
              </div>
            )}

            {localError && (
              <p className="text-xs font-medium text-destructive">{localError}</p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Button
                type="submit"
                size="sm"
                className="flex-1 gap-1.5"
                disabled={isUploading || (!isVideo && !selectedFile)}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="size-3.5" />
                    <span>{isUploaded ? "Confirmar reemplazo" : "Subir entregable"}</span>
                  </>
                )}
              </Button>

              {isUploaded && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsReplacing(false);
                    setSelectedFile(null);
                    setLocalError(null);
                  }}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>

      <CardFooter className="border-t bg-muted/20 py-2.5 text-xs text-muted-foreground">
        <span>RF-24 / RF-25 / RF-26</span>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: DeliverableView["status"] }) {
  if (status === "RECIBIDO") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="size-3" />
        <span>Recibido</span>
      </span>
    );
  }

  if (status === "SUBIDO") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:text-sky-300">
        <Clock className="size-3" />
        <span>Subido</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
      <AlertCircle className="size-3" />
      <span>Pendiente</span>
    </span>
  );
}
