import React, { useCallback } from 'react'

interface OpenEOViewerProps {
  url: string
}

export const OpenEOViewer: React.FC<OpenEOViewerProps> = ({ url }) => {
  const stacRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      node.setAttribute('url', url)
    }
  }, [url])

  return <openeo-stac ref={stacRef} style={{ display: 'block', height: '100%' }} />
}
