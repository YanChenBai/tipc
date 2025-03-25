interface TipcSchema {
  handlers: {
    [key: string]: (...args: any[]) => any
  }
  listeners: {
    [key: string]: (...args: any[]) => any
  }
}

export const T = <T>() => ({} as T)
export function defineTipc<T extends TipcSchema>(name: string, schema: T) {
  return {
    name,
    schema,
  }
}

export default defineTipc('window', {
  handlers: {
    test: T as () => string,
    getUser: T as () => User,
    name: T as () => '1' | '2',
  },
  listeners: {
    test: T as () => string,
  },
})

enum ValueType {
  String,
  Number,
  Boolean,
  Object,
  Array,
  Function,
  Any,
}

interface User {
  id: number
  name: string
  age: number
  type: ValueType
}

export const windowTipc = defineTipc('window', {
  handlers: {
    test: T as () => string,
    getUser: T as () => User,
    name: T as () => '1' | '2',
  },
  listeners: {
    test: T as () => string,
  },
})
