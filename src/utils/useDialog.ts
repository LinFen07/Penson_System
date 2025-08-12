// composables/useDialog.ts
import { ref, type Ref } from 'vue'

export function useDraggable(dialogRef: Ref<HTMLElement | undefined>, handleRef: Ref<HTMLElement | undefined>) {
  const position = ref({ x: 100, y: 100 })
  let dragging = false
  let start = { x: 0, y: 0 }

  const onMouseDown = (e: MouseEvent) => {
    dragging = true
    start = { x: e.clientX - position.value.x, y: e.clientY - position.value.y }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return
    position.value = { x: e.clientX - start.x, y: e.clientY - start.y }
  }

  const onMouseUp = () => {
    dragging = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  handleRef.value?.addEventListener('mousedown', onMouseDown)

  return { position }
}

export function useResizable(dialogRef: Ref<HTMLElement | undefined>, handleRef: Ref<HTMLElement | undefined>) {
  const size = ref({ width: 600, height: 400 })
  let resizing = false
  let start = { x: 0, y: 0 }

  const onMouseDown = (e: MouseEvent) => {
    resizing = true
    start = { x: e.clientX, y: e.clientY }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!resizing) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    size.value.width = Math.max(300, size.value.width + dx)
    size.value.height = Math.max(200, size.value.height + dy)
    start = { x: e.clientX, y: e.clientY }
  }

  const onMouseUp = () => {
    resizing = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  handleRef.value?.addEventListener('mousedown', onMouseDown)

  return { size }
}