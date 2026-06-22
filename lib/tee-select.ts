export function teeOptionIndex(value: string, options: string[]) {
  return options.findIndex((option) => option === value)
}

export function nextTeeOptionIndex(key: string, currentIndex: number, options: string[]) {
  if (options.length === 0) return -1

  switch (key) {
    case "ArrowDown":
      return currentIndex < 0 ? 0 : Math.min(currentIndex + 1, options.length - 1)
    case "ArrowUp":
      return currentIndex < 0 ? options.length - 1 : Math.max(currentIndex - 1, 0)
    case "Home":
      return 0
    case "End":
      return options.length - 1
    default:
      return currentIndex
  }
}
