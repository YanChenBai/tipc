import { listener } from '@byc/tipc'

const TAG_NAME = 'drag'

export function useHover() {
  let prevElement: HTMLDivElement | null = null
  const offFns: Array<() => void> = []

  const moveOff = listener.window.onMove((event) => {
    const pointElement = document.elementFromPoint(event.x, event.y)

    if (!pointElement) {
      return
    }

    const target = pointElement.closest('.drag') as HTMLDivElement

    if (target?.getAttribute(TAG_NAME))
      return

    if (!target) {
      prevElement?.removeAttribute(TAG_NAME)
      return
    }

    prevElement?.removeAttribute(TAG_NAME)

    prevElement = target
    target.setAttribute(TAG_NAME, 'true')
  })

  const onLeaveOff = listener.window.onLeave(() => {
    prevElement?.removeAttribute(TAG_NAME)
  })

  offFns.push(moveOff, onLeaveOff)

  return () => offFns.forEach(fn => fn())
}
