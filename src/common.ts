export const INVOKE_CHANNEL = 'TIPC:INVOKE'
export function formatChannelName(...args: string[]) {
  return `TIPC|${args.join('_')}`
}

export const Method = Object
