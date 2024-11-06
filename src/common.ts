export const GET_WIN_ID_CHANNEL = 'TIPC:GET_WIN_ID'
export const INVOKE_CHANNEL = 'TIPC:INVOKE'
export function formatChannelName(id: number, name: string) {
  return `TIPC:ID[${id}]:NAME[${name}]`
}

export const Method = Object
