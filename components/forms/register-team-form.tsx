"use client";

import { useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react";

import {
  teamRegistrationSchema,
  TeamRegistrationFormValues,
} from "@/lib/validations/team-schema";
import { registerTeamAction } from "@/lib/actions/team-registration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MAX_MEMBERS = 4;

const emptyMember = { fullName: "", email: "", universityCode: "", phone: "" };

const defaultValues: TeamRegistrationFormValues = {
  registrationType: "TEAM",
  teamName: "",
  members: [emptyMember],
};

const memberFields = [
  { name: "fullName", label: "Nombre completo", type: "text", autoComplete: "name", placeholder: "Ana Torres Quispe" },
  { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email", placeholder: "ana.torres@uni.pe" },
  { name: "universityCode", label: "Código o universidad", type: "text", autoComplete: "off", placeholder: "20231234A o UNI" },
  { name: "phone", label: "Celular", type: "tel", autoComplete: "tel", placeholder: "987654321" },
] as const;

type ServerFeedback = { success: boolean; message: string; details?: string[] };

export function RegisterTeamForm() {
  const [feedback, setFeedback] = useState<ServerFeedback | null>(null);

  const form = useForm<TeamRegistrationFormValues>({
    resolver: zodResolver(teamRegistrationSchema),
    defaultValues,
    // Valida al salir de cada campo y, desde ahí, en cada cambio (RF-21, RNF-03).
    mode: "onTouched",
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: "members" });

  const registrationType = useWatch({ control, name: "registrationType" });
  const isTeam = registrationType === "TEAM";

  // La regla UNI y el límite de integrantes llegan como error del arreglo completo.
  const membersError = errors.members?.root?.message ?? errors.members?.message;

  function changeRegistrationType(value: TeamRegistrationFormValues["registrationType"]) {
    setValue("registrationType", value, { shouldValidate: false });
    if (value === "INDIVIDUAL") {
      // Una inscripción individual es de una sola persona y no lleva nombre de equipo.
      if (fields.length > 1) remove(fields.slice(1).map((_, index) => index + 1));
      setValue("teamName", "", { shouldValidate: false });
      form.clearErrors("teamName");
    }
  }

  async function onSubmit(values: TeamRegistrationFormValues) {
    setFeedback(null);

    let response: Awaited<ReturnType<typeof registerTeamAction>>;
    try {
      response = await registerTeamAction(values);
    } catch {
      // Falla de red o del servidor antes de que la acción pueda responder.
      setFeedback({
        success: false,
        message: "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
      });
      return;
    }

    if (response.success) {
      setFeedback({ success: true, message: response.message });
      reset(defaultValues);
      return;
    }

    const details = response.errors ? Object.values(response.errors).flat() : undefined;
    setFeedback({ success: false, message: response.message, details });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipo de inscripción</CardTitle>
          <CardDescription>
            Puedes postular solo o con un equipo de hasta {MAX_MEMBERS} integrantes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Controller
            control={control}
            name="registrationType"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={(value) =>
                  changeRegistrationType(value as TeamRegistrationFormValues["registrationType"])
                }
                aria-label="Tipo de inscripción"
                className="grid gap-3 sm:grid-cols-2"
              >
                <TypeOption
                  value="INDIVIDUAL"
                  checked={field.value === "INDIVIDUAL"}
                  icon={<User aria-hidden />}
                  title="Individual"
                  description="Postulo por mi cuenta."
                />
                <TypeOption
                  value="TEAM"
                  checked={field.value === "TEAM"}
                  icon={<Users aria-hidden />}
                  title="En equipo"
                  description={`De 1 a ${MAX_MEMBERS} integrantes.`}
                />
              </RadioGroup>
            )}
          />

          {isTeam && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="teamName">Nombre del equipo</Label>
              <Input
                id="teamName"
                placeholder="Ej. Innovadores UNI"
                aria-invalid={!!errors.teamName}
                aria-describedby={errors.teamName ? "teamName-error" : undefined}
                {...register("teamName")}
              />
              <FieldError id="teamName-error" message={errors.teamName?.message} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isTeam ? `Integrantes (${fields.length} de ${MAX_MEMBERS})` : "Tus datos"}
          </CardTitle>
          <CardDescription>
            Al menos un integrante debe ser de la UNI: con correo @uni.pe o @uni.edu.pe, o
            indicando su código o universidad UNI.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {fields.map((member, index) => (
            <fieldset
              key={member.id}
              className="flex flex-col gap-4 rounded-lg border border-border p-4"
            >
              <legend className="sr-only">
                {isTeam ? `Integrante ${index + 1}` : "Participante"}
              </legend>
              <div className="flex items-center justify-between gap-2">
                <span aria-hidden className="text-sm font-semibold">
                  {isTeam ? `Integrante ${index + 1}` : "Participante"}
                </span>
                {isTeam && fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    aria-label={`Quitar al integrante ${index + 1}`}
                  >
                    <Trash2 aria-hidden />
                    Quitar
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {memberFields.map((input) => {
                  const id = `members-${index}-${input.name}`;
                  const message = errors.members?.[index]?.[input.name]?.message;
                  return (
                    <div key={input.name} className="flex flex-col gap-2">
                      <Label htmlFor={id}>{input.label}</Label>
                      <Input
                        id={id}
                        type={input.type}
                        autoComplete={input.autoComplete}
                        placeholder={input.placeholder}
                        aria-invalid={!!message}
                        aria-describedby={message ? `${id}-error` : undefined}
                        {...register(`members.${index}.${input.name}`)}
                      />
                      <FieldError id={`${id}-error`} message={message} />
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {membersError && (
            <Alert variant="destructive">
              <CircleAlert aria-hidden />
              <AlertTitle>Revisa los integrantes</AlertTitle>
              <AlertDescription>{membersError}</AlertDescription>
            </Alert>
          )}

          {isTeam && (
            <Button
              type="button"
              variant="outline"
              className="self-start"
              onClick={() => append(emptyMember, { shouldFocus: true })}
              disabled={fields.length >= MAX_MEMBERS}
            >
              <Plus aria-hidden />
              {fields.length >= MAX_MEMBERS
                ? `Máximo ${MAX_MEMBERS} integrantes`
                : "Agregar integrante"}
            </Button>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-4">
          {feedback && (
            <Alert variant={feedback.success ? "default" : "destructive"} role="status">
              {feedback.success ? <CircleCheck aria-hidden /> : <CircleAlert aria-hidden />}
              <AlertTitle>{feedback.success ? "Inscripción enviada" : "No se pudo enviar"}</AlertTitle>
              <AlertDescription>
                <p>{feedback.message}</p>
                {feedback.details && feedback.details.length > 0 && (
                  <ul className="mt-1 list-disc pl-4">
                    {feedback.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="sm:self-end">
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin" aria-hidden />
                Enviando…
              </>
            ) : (
              "Enviar inscripción"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

function TypeOption({
  value,
  checked,
  icon,
  title,
  description,
}: {
  value: TeamRegistrationFormValues["registrationType"];
  checked: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 leading-normal transition-colors hover:bg-muted ${
        checked ? "border-primary bg-muted" : "border-border"
      }`}
    >
      <RadioGroupItem value={value} className="mt-0.5" />
      <span className="flex flex-col gap-1">
        <span className="flex items-center gap-2 font-semibold [&_svg]:size-4">
          {icon}
          {title}
        </span>
        <span className="text-sm font-normal text-muted-foreground">{description}</span>
      </span>
    </Label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}
