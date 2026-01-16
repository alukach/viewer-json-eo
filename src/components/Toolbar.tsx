import React from 'react'
import type { TabType } from '../types'

interface ToolbarProps {
  activeTab: TabType
  filterText: string
  onFilterChange: (text: string) => void
  onSave: () => void
  onCopy: () => void
  onCollapseAll: () => void
  onExpandAll: () => void
  isPrettyPrinted: boolean
  onTogglePrettyPrint: () => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTab,
  filterText,
  onFilterChange,
  onSave,
  onCopy,
  onCollapseAll,
  onExpandAll,
  isPrettyPrinted,
  onTogglePrettyPrint
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
    {activeTab === 'json' && (
      <input
        type="text"
        className="filter-input"
        placeholder="Filter JSON"
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
      />
    )}
  </div>
)
