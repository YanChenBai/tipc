export const CommonListenerMethods = {
  tell: Function as (msg: string) => void,

}

export type ICommonListener = typeof CommonListenerMethods
