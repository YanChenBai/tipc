/// <reference types="./env.d.ts" />

import { invoke, listener } from '@byc/tipc'

const TAG_NAME = 'hover'

export function useHover() {
  let prevElement: HTMLDivElement | null = null
  const offFns: Array<() => void> = []

  function check(pos: { x: number, y: number }) {
    const pointElement = document.elementFromPoint(pos.x, pos.y)

    if (!pointElement) {
      return
    }

    const target = pointElement.closest(`.${TAG_NAME}`) as HTMLDivElement

    if (target?.getAttribute(TAG_NAME))
      return

    if (!target) {
      prevElement?.removeAttribute(TAG_NAME)
      return
    }

    prevElement?.removeAttribute(TAG_NAME)

    prevElement = target
    target.setAttribute(TAG_NAME, 'true')
  }

  invoke.window.getMousePosInWindow()
    .then((pos) => {
      if (pos)
        check(pos)
    })

  const moveOff = listener.window.onMove(event => check(event))

  const onLeaveOff = listener.window.onLeave(() => {
    prevElement?.removeAttribute(TAG_NAME)
  })

  offFns.push(moveOff, onLeaveOff)

  return () => offFns.forEach(fn => fn())
}
