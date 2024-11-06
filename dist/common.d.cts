declare const GET_WIN_ID_CHANNEL = "TIPC:GET_WIN_ID";
declare const INVOKE_CHANNEL = "TIPC:INVOKE";
declare function formatChannelName(id: number, name: string): string;
declare const TIpcFunc: any;

export { GET_WIN_ID_CHANNEL, INVOKE_CHANNEL, TIpcFunc, formatChannelName };
