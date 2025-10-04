/**
 * Utilidades compartidas para lógica relacionada con bosques
 * Evita duplicación de código en componentes
 */

/**
 * Obtiene el color de salud del bosque (texto y fondo)
 * @param health - Porcentaje de salud del bosque (0-100)
 * @returns className de Tailwind para color de texto
 */
export function getHealthColor(health?: number): string {
  if (!health) return 'text-gray-500';
  if (health >= 70) return 'text-green-600';
  if (health >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Obtiene el color de fondo para salud del bosque
 * @param health - Porcentaje de salud del bosque (0-100)
 * @returns className de Tailwind para color de fondo
 */
export function getHealthBgColor(health?: number): string {
  if (!health) return 'bg-gray-100';
  if (health >= 70) return 'bg-green-100';
  if (health >= 50) return 'bg-yellow-100';
  return 'bg-red-100';
}

/**
 * Obtiene clases completas para badges de salud (texto, fondo y borde)
 * @param health - Porcentaje de salud del bosque (0-100)
 * @returns className de Tailwind combinadas
 */
export function getHealthBadgeClasses(health?: number): string {
  if (!health) return 'text-gray-600 bg-gray-50 border-gray-200';
  if (health >= 70) return 'text-green-600 bg-green-50 border-green-200';
  if (health >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
}

/**
 * Obtiene el label de estado de salud
 * @param health - Porcentaje de salud del bosque (0-100)
 * @returns Texto descriptivo del estado
 */
export function getHealthLabel(health?: number): string {
  if (!health) return 'Desconocido';
  if (health >= 70) return 'Saludable';
  if (health >= 50) return 'Moderado';
  return 'Crítico';
}

/**
 * Obtiene el color de salud para barras de progreso
 * @param health - Porcentaje de salud del bosque (0-100)
 * @returns className de Tailwind para background
 */
export function getHealthProgressColor(health?: number): string {
  if (!health) return 'bg-gray-500';
  if (health >= 70) return 'bg-green-500';
  if (health >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

/**
 * Tipos de nivel de guardián
 */
export type GuardianLevel = 'Sembrador' | 'Protector' | 'Guardián' | 'Líder Ancestral';

/**
 * Obtiene el color del nivel de guardián
 * @param level - Nivel del guardián
 * @returns className de Tailwind para gradient
 */
export function getLevelColor(level: string): string {
  switch (level) {
    case 'Sembrador':
      return 'from-green-50 to-emerald-50 border-green-200';
    case 'Protector':
      return 'from-amber-50 to-yellow-50 border-amber-200';
    case 'Guardián':
      return 'from-purple-50 to-pink-50 border-purple-200';
    case 'Líder Ancestral':
      return 'from-blue-50 to-indigo-50 border-blue-200';
    default:
      return 'from-gray-50 to-slate-50 border-gray-200';
  }
}

/**
 * Obtiene el emoji del nivel de guardián
 * @param level - Nivel del guardián
 * @returns Emoji representativo
 */
export function getLevelEmoji(level: string): string {
  switch (level) {
    case 'Sembrador':
      return '🌱';
    case 'Protector':
      return '🌳';
    case 'Guardián':
      return '🦅';
    case 'Líder Ancestral':
      return '🏆';
    default:
      return '🌿';
  }
}

/**
 * Calcula días desde una fecha de adopción
 * @param adoptionDate - Fecha de adopción en formato ISO
 * @returns Número de días desde la adopción
 */
export function getDaysSinceAdoption(adoptionDate: string): number {
  const now = new Date().getTime();
  const adoption = new Date(adoptionDate).getTime();
  return Math.floor((now - adoption) / (1000 * 60 * 60 * 24));
}

/**
 * Formatea una fecha a locale español
 * @param dateString - Fecha en formato ISO
 * @returns Fecha formateada
 */
export function formatDateES(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
