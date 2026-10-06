import { differenceInCalendarDays, differenceInHours, differenceInMinutes, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function tempoRelativo(iso, agora = new Date()) {
  if (!iso) return 'data desconhecida'
  const data = new Date(iso)
  const minutos = differenceInMinutes(agora, data)

  if (minutos < 1) return 'agora'
  if (minutos < 60) return `há ${minutos} min`
  const horas = differenceInHours(agora, data)
  if (horas < 24) return `há ${horas} h`

  const dias = differenceInCalendarDays(agora, data)
  if (dias <= 1) return 'ontem'
  if (dias < 7) return `${dias} dias`
  return format(data, 'd MMM', { locale: ptBR })
}

export function dataCompleta(iso) {
  return format(new Date(iso), "d MMM yyyy, HH'h'mm", { locale: ptBR })
}
