"use client"

import { useEffect } from "react"

export function ResizeObserverFix() {
  useEffect(() => {
    // Suppress ResizeObserver loop error - this is a known browser issue
    // that occurs when resize observations can't be delivered in a single frame
    const originalResizeObserver = window.ResizeObserver

    window.ResizeObserver = class extends originalResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        super((entries, observer) => {
          requestAnimationFrame(() => {
            callback(entries, observer)
          })
        })
      }
    }

    return () => {
      window.ResizeObserver = originalResizeObserver
    }
  }, [])

  return null
}
