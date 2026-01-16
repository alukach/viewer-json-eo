import React from 'react'
import type { TabType } from '../types'

interface ToolbarProps {
  activeTab: TabType
  onSave: () => void
  onCopy: () => void
  onCollapseAll: () => void
  onExpandAll: () => void
  isPrettyPrinted: boolean
  onTogglePrettyPrint: () => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTab,
  onSave,
  onCopy,
  onCollapseAll,
  onExpandAll,
  isPrettyPrinted,
  onTogglePrettyPrint,
}) => (
  <div className="toolbar">
    <div className="toolbar-buttons">
      <button onClick={onSave}>Save</button>
      <button onClick={onCopy}>Copy</button>
      {activeTab === 'json' ? (
        <>
          <button onClick={onCollapseAll}>Collapse All</button>
          <button onClick={onExpandAll}>Expand All</button>
        </>
      ) : (
        <button onClick={onTogglePrettyPrint}>
          {isPrettyPrinted ? 'Minify' : 'Pretty Print'}
        </button>
      )}
    </div>
  </div>
)
