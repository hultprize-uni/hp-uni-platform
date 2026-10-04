/**
 * Contenido pensado como editable/dinámico (futuro CMS - HU-7).
 * Los valores no confirmados por negocio se dejan como placeholders {{...}}.
 */

export const REGISTRATION_CLOSE_ISO = '2027-02-08T23:59:59-05:00'
export const REGISTRATION_CLOSE_LABEL = 'Lunes 8 de febrero de 2027 · 23:59'

export const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre el reto', href: '#about' },
  { label: 'Ganadores', href: '#ganadores' },
  { label: 'Cronograma', href: '#cronograma' },
  { label: 'Matchmaking', href: '#matchmaking' },
  { label: 'FAQ', href: '#faq' },
] as const

export const ROUTES = {
  registro: '/registro',
  matchmaking: '/registro?flow=matchmaking',
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

export const LOCAL_PHASES = [
  {
    key: 'fase-1',
    phase: 'Fase 1',
    image: '/fotos/crono-fase1.webp',
    title: 'Convocar e Inscribir',
    dateRange: 'Por confirmar',
    body: 'Presenta tu propuesta y registra a las personas de tu equipo para participar en la edición 2027.',
    details: 'Registra a las personas postulantes y presenta el problema que el equipo quiere abordar. Las bases oficiales definirán los requisitos y las fechas de apertura y cierre.',
  },
  {
    key: 'fase-2',
    phase: 'Fase 2',
    image: '/fotos/crono-fase2.webp',
    title: 'Formación y mentorías',
    dateRange: 'Por confirmar',
    body: 'Fortalece la propuesta con herramientas de emprendimiento, validación y mentoría especializada.',
    details: 'Participa en sesiones de formación y mentoría para validar el problema, contrastar la solución con usuarios y preparar un modelo de emprendimiento sostenible.',
  },
  {
    key: 'fase-3',
    phase: 'Fase 3',
    image: '/fotos/crono-fase3.webp',
    title: 'Presentación y evaluación',
    dateRange: 'Por confirmar',
    body: 'Expón el problema, la solución propuesta y el potencial de impacto de tu emprendimiento.',
    details: 'Entrega la presentación y los materiales solicitados en las bases. El jurado evaluará cada propuesta con los criterios y la rúbrica publicados para la edición.',
  },
  {
    key: 'fase-4',
    phase: 'Fase 4',
    image: '/fotos/crono-fase4.webp',
    title: 'Final en la UNI',
    dateRange: 'Por confirmar',
    body: 'Los equipos finalistas presentan sus propuestas ante el jurado de la sede UNI.',
    details: 'Los equipos finalistas presentan su propuesta en la sede UNI. El formato, la fecha y los criterios de selección se confirmarán en el cronograma oficial.',
  },
] as const

export const WINNERS_2026 = [
  {
    place: '1.er puesto',
    name: 'Nombre por confirmar',
    project: 'Proyecto por confirmar',
    description: 'La descripción oficial del proyecto se añadirá al publicarse los resultados.',
    photo: '/fotos/ganador-1.webp',
    linkedinUrl: '',
  },
  {
    place: '2.º puesto',
    name: 'Nombre por confirmar',
    project: 'Proyecto por confirmar',
    description: 'La descripción oficial del proyecto se añadirá al publicarse los resultados.',
    photo: '/fotos/ganador-2.webp',
    linkedinUrl: '',
  },
  {
    place: '3.er puesto',
    name: 'Nombre por confirmar',
    project: 'Proyecto por confirmar',
    description: 'La descripción oficial del proyecto se añadirá al publicarse los resultados.',
    photo: '/fotos/ganador-3.webp',
    linkedinUrl: '',
  },
] as const

export const BOOTCAMP_MODULES = [
  {
    number: '01',
    title: 'Problema e impacto',
    body: 'Delimita el desafío, identifica a las personas afectadas y define cómo medir el impacto.',
  },
  {
    number: '02',
    title: 'Validación de solución',
    body: 'Contrasta hipótesis con usuarios y convierte hallazgos en una propuesta de valor.',
  },
  {
    number: '03',
    title: 'Modelo de negocio',
    body: 'Diseña una operación sostenible, estima costos y plantea una ruta de crecimiento.',
  },
  {
    number: '04',
    title: 'Pitch y presentación',
    body: 'Comunica evidencia, viabilidad y resultados esperados con claridad ante el jurado.',
  },
] as const

export const CONTACT_CHANNELS = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? '',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? '',
} as const

export const FAQ_ITEMS = [
  {
    q: '¿Cuál es el reto de la edición 2027?',
    a: 'El reto invita a estudiantes a desarrollar emprendimientos sostenibles que respondan a desafíos sociales y ambientales. La convocatoria oficial de 2027 precisará el enfoque y sus criterios.',
  },
  {
    q: '¿Cuál es la fecha límite de inscripción?',
    a: 'La fecha oficial de cierre se anunciará próximamente. El cronograma de esta página se actualizará cuando la organización confirme el calendario.',
  },
  {
    q: '¿Puedo postular si todavía no tengo equipo?',
    a: 'Sí. Puedes registrarte de forma individual y usar el espacio de Matchmaking para encontrar personas con intereses y habilidades complementarias.',
  },
  {
    q: '¿Quiénes pueden participar?',
    a: 'La convocatoria está dirigida a estudiantes que quieran desarrollar una propuesta de emprendimiento de impacto. Los requisitos oficiales se publicarán junto con las bases 2027.',
  },
  {
    q: '¿Necesito una idea terminada para inscribirme?',
    a: 'No necesitas tener una empresa constituida. Puedes empezar con una hipótesis de problema y trabajar la propuesta durante las etapas de la competencia.',
  },
] as const
