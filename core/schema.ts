import type { FnMap } from './type'

export function defineSchema<
  Handlers extends FnMap = FnMap,
  Listeners extends FnMap = FnMap,
>(name: string) {
  return {
    name,
    handlers: {} as Handlers,
    listeners: {} as Listeners,
  }
}
