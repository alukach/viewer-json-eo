import React, { useState, useEffect, useCallback } from 'react'
import { JSONTree } from 'react-json-tree'
import { useMedia } from 'react-use'
import './index.css'

// Color themes for JSONTree - matching system light/dark modes
const lightTheme = {
  scheme: 'light',
  base00: '#ffffff', // Background
  base01: '#f5f5f5',
  base02: '#e0e0e0',
  base03: '#999999', // Comments
  base04: '#666666',
  base05: '#333333',
  base06: '#1a1a1a',
  base07: '#000000', // Foreground
  base08: '#d73737', // Red - null, undefined
  base09: '#d78700', // Orange - numbers
  base0A: '#b58900', // Yellow
  base0B: '#50a14f', // Green - strings
  base0C: '#0184bc', // Cyan - regex
  base0D: '#4078f2', // Blue - functions, property names
  base0E: '#a626a4', // Purple - keywords
  base0F: '#986801', // Brown
}

const darkTheme = {
  scheme: 'dark',
  base00: '#1e1e1e', // Background - matching page background
  base01: '#2d2d2d',
  base02: '#3d3d3d',
  base03: '#666666', // Comments
  base04: '#999999',
  base05: '#cccccc',
  base06: '#e0e0e0',
  base07: '#ffffff', // Foreground
  base08: '#f48771', // Red - null, undefined
  base09: '#fc9867', // Orange - numbers
  base0A: '#ffd866', // Yellow
  base0B: '#a9dc76', // Green - strings
  base0C: '#78dce8', // Cyan - regex
  base0D: '#7fc8f8', // Blue - functions, property names
  base0E: '#ab9df2', // Purple - keywords
  base0F: '#ff6188', // Brown
}

type AppState =
  | { type: 'no-url' }
  | { type: 'loading'; url: string }
  | { type: 'error'; url: string; error: string }
  | { type: 'success'; url: string; data: any; jsonText: string }

// OpenEO Viewer Component using Web Component
const OpenEOViewer: React.FC<{ url: string }> = ({ url }) => {
  const stacRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      node.setAttribute('url', url)
    }
  }, [url])

  return <openeo-stac ref={stacRef} style={{ display: 'block', height: '100%' }} />
}

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'openeo-stac': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

const App: React.FC = () => {
  const prefersDark = useMedia('(prefers-color-scheme: dark)')
  const [userTheme, setUserTheme] = useState<'light' | 'dark' | undefined>(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'light' || saved === 'dark' ? saved : undefined
  })
  const [state, setState] = useState<AppState>({ type: 'no-url' })
  const [activeTab, setActiveTab] = useState<'json' | 'raw' | 'openeo'>('json')
  const [filterText, setFilterText] = useState('')
  const [shouldExpandAll, setShouldExpandAll] = useState(true)
  const [isPrettyPrinted, setIsPrettyPrinted] = useState(true)

  const theme = userTheme ?? (prefersDark ? 'dark' : 'light')
  const jsonTheme = theme === 'dark' ? darkTheme : lightTheme

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.setProperty('color-scheme', theme)
  }, [theme])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const jsonUrl = urlParams.get('url')

    if (!jsonUrl) {
      setState({ type: 'no-url' })
      return
    }

    setState({ type: 'loading', url: jsonUrl })

    fetch(jsonUrl)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const text = await response.text()
        const data = JSON.parse(text)
        setState({ type: 'success', url: jsonUrl, data, jsonText: text })
      })
      .catch((error) => {
        setState({
          type: 'error',
          url: jsonUrl,
          error: error instanceof Error ? error.message : String(error),
        })
      })
  }, [])

  const handleThemeChange = (newTheme: string) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setUserTheme(newTheme)
      localStorage.setItem('theme', newTheme)
    } else {
      setUserTheme(undefined)
      localStorage.removeItem('theme')
    }
  }

  const handleSave = () => {
    if (state.type !== 'success') return

    const blob = new Blob([state.jsonText], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    let filename = decodeURIComponent(state.url).split('/').pop() || 'download'
    if (!/\.json$/.test(filename)) {
      filename += '.json'
    }

    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    if (state.type !== 'success') return

    try {
      await navigator.clipboard.writeText(state.jsonText)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCollapseAll = () => {
    setShouldExpandAll(false)
  }

  const handleExpandAll = () => {
    setShouldExpandAll(true)
  }

  const handlePrettyPrint = () => {
    setIsPrettyPrinted(!isPrettyPrinted)
  }

  const shouldExpandNodeInitially = useCallback(() => {
    return shouldExpandAll
  }, [shouldExpandAll])

  const getRawJsonDisplay = () => {
    if (state.type !== 'success') return ''
    if (isPrettyPrinted) {
      return JSON.stringify(state.data, null, 2)
    }
    return state.jsonText
  }

  if (state.type === 'no-url') {
    return (
      <div className="message-container">
        <h1>JSON Viewer</h1>
        <p>
          Please provide a JSON URL using the <code>url</code> query parameter.
        </p>
        <p>
          <strong>Example:</strong>
        </p>
        <code className="example-code">
          ?url=https://api.github.com/users/octocat
        </code>
      </div>
    )
  }

  if (state.type === 'loading') {
    return (
      <div className="message-container loading">
        <p className="loading-text">Loading JSON from:</p>
        <p className="loading-url">{state.url}</p>
      </div>
    )
  }

  if (state.type === 'error') {
    return (
      <div className="message-container error">
        <h1>Error Loading JSON</h1>
        <p>
          <strong>URL:</strong>
        </p>
        <p className="error-url">{state.url}</p>
        <p>
          <strong>Error:</strong>
        </p>
        <p className="error-message">{state.error}</p>
        <p>
          <strong>Please check that:</strong>
        </p>
        <ul>
          <li>The URL is correct and accessible</li>
          <li>The URL returns valid JSON</li>
          <li>CORS is enabled on the server (if fetching from a different domain)</li>
        </ul>
      </div>
    )
  }

  return (
    <div className="json-viewer-app">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          JSON
        </button>
        <button
          className={`tab ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          Raw Data
        </button>
        <button
          className={`tab ${activeTab === 'openeo' ? 'active' : ''}`}
          onClick={() => setActiveTab('openeo')}
        >
          OpenEO
        </button>
        <div className="tab-spacer"></div>
        <div className="header-right">
          <label htmlFor="theme-select">Theme:</label>
          <select
            id="theme-select"
            value={userTheme ?? 'system'}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            <option value="system">system</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCopy}>Copy</button>
          {activeTab === 'json' ? (
            <>
              <button onClick={handleCollapseAll}>Collapse All</button>
              <button onClick={handleExpandAll}>Expand All</button>
            </>
          ) : (
            <button onClick={handlePrettyPrint}>
              {isPrettyPrinted ? 'Minify' : 'Pretty Print'}
            </button>
          )}
        </div>
        {activeTab === 'json' && (
          <input
            type="text"
            className="filter-input"
            placeholder="Filter JSON"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        )}
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'json' && (
          <div className="json-content">
            <JSONTree
              key={shouldExpandAll ? 'expanded' : 'collapsed'}
              data={state.data}
              theme={jsonTheme}
              invertTheme={false}
              shouldExpandNodeInitially={shouldExpandNodeInitially}
              hideRoot={true}
            />
          </div>
        )}
        {activeTab === 'raw' && (
          <div className="raw-content">
            <pre>{getRawJsonDisplay()}</pre>
          </div>
        )}
        {activeTab === 'openeo' && state.type === 'success' && (
          <OpenEOViewer url={state.url} />
        )}
      </div>
    </div>
  )
}

export default App
