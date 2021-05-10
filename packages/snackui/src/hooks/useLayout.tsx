import { useRef, useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle } from 'react-native'

import { isWeb, useIsomorphicLayoutEffect } from '../platform'
import { debounce } from './useDebounce'

export const useLayout = (props: { onLayout?: (rect: LayoutRectangle) => void } = {}) => {
  const [layout, setLayout] = useState<LayoutRectangle | null>(null)

  if (!isWeb) {
    return {
      layout,
      onLayout: (e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout),
    }
  }

  const ref = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    let hasUpdatedOnce = false

    const updateImmediate = (rect) => {
      setLayout((prev) => {
        let next
        if (!prev) {
          next = rect
        } else {
          const width = Math.max(1, Math.round(rect.width))
          const height = Math.max(1, Math.round(rect.height))
          // don't set new layout state unless the layout has actually changed
          if (width !== prev.width || height !== prev.height) {
            next = { width, height }
          }
        }
        if (next) {
          props.onLayout?.(next)
          return next
        }
        return prev
      })
    }
    const updateDbc = debounce(updateImmediate, 0, true)
    const update = (a) => {
      if (!a.width && !a.height) {
        return
      }
      // clearTimeout(tm)
      if (!hasUpdatedOnce) {
        hasUpdatedOnce = true
        updateImmediate(a)
        return
      }
      updateDbc(a)
    }

    const ro = new ResizeObserver(([{ contentRect }] = []) => {
      update(contentRect)
    })
    ro.observe(node)

    const io = new IntersectionObserver(([{ boundingClientRect }]) => {
      update(boundingClientRect)
    })
    io.observe(node)

    // let tm = setTimeout(() => {
    //   // if hasnt fired by now, send first one
    //   console.log(node)
    //   update(node.getBoundingClientRect())
    // })

    return () => {
      // clearTimeout(tm)
      updateDbc.cancel()
      ro.disconnect()
      io.disconnect()
    }
  }, [ref])

  return {
    layout,
    ref,
  }
}