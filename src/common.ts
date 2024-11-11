export const HANDLER = 'HANDLER'
export const LISTENER = 'LISTENER'
export function formatName(...args: string[]) {
  return `__TIPC__${args.join(':')}`
}

export function getHandlerName(name: string) {
  return formatName(HANDLER, name)
}

export function geListenerName(name: string, methodName: string) {
  return formatName(LISTENER, name, methodName)
}

export const Method = Object
