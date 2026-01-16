import React from 'react'

export const NoUrlMessage: React.FC = () => (
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

export const LoadingMessage: React.FC<{ url: string }> = ({ url }) => (
  <div className="message-container loading">
    <p className="loading-text">Loading JSON from:</p>
    <p className="loading-url">{url}</p>
  </div>
)

export const ErrorMessage: React.FC<{ url: string; error: string }> = ({ url, error }) => (
  <div className="message-container error">
    <h1>Error Loading JSON</h1>
    <p>
      <strong>URL:</strong>
    </p>
    <p className="error-url">{url}</p>
    <p>
      <strong>Error:</strong>
    </p>
    <p className="error-message">{error}</p>
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
