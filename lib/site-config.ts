/**
 * Contenido pensado como editable/dinámico (futuro CMS - HU-7).
 * Los valores no confirmados por negocio se dejan como placeholders {{...}}.
 */

// Fecha de cierre de inscripciones — placeholder editable {{FECHA_CIERRE}}
// Se usa una fecha futura de marcador para que el countdown funcione en preview.
export const REGISTRATION_CLOSE_ISO = '2026-03-31T23:59:00-05:00'
export const REGISTRATION_CLOSE_LABEL = '{{FECHA_CIERRE}}'

export const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre el Reto', href: '#sobre-el-reto' },
  { label: 'Cronograma', href: '#cronograma' },
  { label: 'Matchmaking', href: '#matchmaking' },
  { label: 'FAQ', href: '#faq' },
] as const

export const ROUTES = {
  registro: '/registro',
  login: '/login',
  matchmaking: '/registro?flow=matchmaking',
  portalEntregables: '/portal',
  accesoJurado: '/login?role=jurado',
  accesoAdmin: '/login?role=admin',
}

// Etapas globales de Hult Prize (lenguaje propio UNICode)
export const GLOBAL_STAGES = [
  {
    key: 'qualifiers',
    tag: 'Etapa 01',
    title: 'Qualifiers',
    body: 'Compiten los campus de todo el mundo. Aquí tu equipo entra al torneo y valida su idea frente a la comunidad UNI.',
  },
  {
    key: 'nationals',
    tag: 'Etapa 02',
    title: 'Nationals',
    body: 'Los mejores equipos del país se enfrentan. La solución debe demostrar tracción, no solo un buen pitch.',
  },
  {
    key: 'incubadora',
    tag: 'Etapa 03',
    title: 'Incubadora Digital',
    body: 'Programa intensivo remoto para convertir el prototipo en un modelo operable y medible.',
  },
  {
    key: 'aceleradora',
    tag: 'Etapa 04',
    title: 'Aceleradora Global',
    body: 'Un verano de aceleración presencial con mentores de clase mundial y acceso a capital.',
  },
  {
    key: 'final',
    tag: 'Etapa 05',
    title: 'Final Global',
    body: 'La ronda final por el premio de impacto. El escenario donde la ingeniería peruana compite de igual a igual.',
  },
] as const

// Cronograma local HP at UNI (fechas públicas = placeholders {{FASE_X_FECHA}})
export const LOCAL_PHASES = [
  {
    key: 'fase-1',
    phase: 'Fase 1',
    title: 'Convocar e Inscribir',
    date: '{{FASE_1_FECHA}}',
    body: 'Se abre la convocatoria oficial. Los equipos se registran en la plataforma y confirman a sus integrantes.',
  },
  {
    key: 'fase-2',
    phase: 'Fase 2',
    title: 'Bootcamps y Mentores',
    date: '{{FASE_2_FECHA}}',
    body: 'Sesiones de formación, mentoría técnica y de negocio para dar forma a cada propuesta.',
  },
  {
    key: 'fase-3',
    phase: 'Fase 3',
    title: 'Entrega de Pitches y Evaluación',
    date: '{{FASE_3_FECHA}}',
    body: 'Los equipos suben sus entregables a la plataforma y el jurado evalúa mediante rúbricas.',
  },
  {
    key: 'fase-4',
    phase: 'Fase 4',
    title: 'Gran Final On-Campus UNI',
    date: '{{FASE_4_FECHA}}',
    body: 'La final presencial en el campus de la UNI. Se define al equipo que representará a la casa de estudios.',
  },
] as const

export const FAQ_ITEMS = [
  {
    q: '¿En qué formatos subo mis entregables?',
    a: 'A través del Portal de Participantes podrás subir documentos en PDF y DOCX, además de enlaces a tu pitch en video. El jurado califica cada entregable con rúbricas dentro de la misma plataforma.',
  },
  {
    q: '¿Cuál es la fecha límite de inscripción?',
    a: 'El cierre de inscripciones está programado para {{FECHA_CIERRE}}. El contador de la parte superior se actualiza automáticamente hacia esa fecha.',
  },
  {
    q: '¿Tendré acompañamiento de mentores?',
    a: 'Sí. Durante la fase de Bootcamps y Mentores tu equipo recibirá acompañamiento técnico y de negocio para robustecer la propuesta antes de la evaluación.',
  },
  {
    q: '¿Quién conforma el jurado?',
    a: 'El jurado se anunciará oficialmente próximamente ({{JURADO}}). Estará integrado por perfiles de ingeniería, academia, industria e inversión de impacto.',
  },
  {
    q: '¿Necesito una idea terminada para inscribirme?',
    a: 'No. Puedes inscribirte con una hipótesis de problema. Las fases de formación existen precisamente para convertir esa hipótesis en una solución escalable.',
  },
] as const
