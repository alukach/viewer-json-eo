# JSON Viewer

A clean, modern JSON viewer web application that fetches and displays JSON from any URL. Inspired by Firefox's built-in JSON viewer.

## Features

- 📑 **Tabbed Interface** - Switch between JSON tree view and raw data
- 🎨 **Theme Support** - Light, dark, and system theme options
- 🔍 **Interactive JSON Tree** - Powered by `react-json-tree`
- 💾 **Save/Copy** - Download JSON or copy to clipboard
- 🔽 **Collapse/Expand** - Collapse All and Expand All controls
- 🔎 **Filter JSON** - Search/filter through JSON data (coming soon)
- 🚀 **Fast Build** - Built with Vite for lightning-fast development
- 📱 **Responsive** - Works on desktop and mobile

## Usage

### Development

```bash
pnpm install
pnpm run dev
```

Then navigate to:

```text
http://localhost:5173/?url=https://api.github.com/users/octocat
```

### Production Build

```bash
pnpm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
pnpm run preview
```

## Query Parameters

- `url` (required) - The URL of the JSON file to display

### Examples

```text
http://localhost:5173/?url=https://api.github.com/users/octocat
http://localhost:5173/?url=https://jsonplaceholder.typicode.com/posts/1
```

## Features in Detail

### Tabs
- **JSON** - Interactive tree view with syntax highlighting
- **Raw Data** - Plain text view of the JSON

### Toolbar (JSON Tab)
- **Save** - Download the JSON file
- **Copy** - Copy JSON to clipboard
- **Collapse All** - Collapse all nodes in the tree
- **Expand All** - Expand all nodes in the tree
- **Filter JSON** - Search box for filtering (UI ready, filtering logic coming soon)

### Theme Options
- **system** - Follow system dark/light mode preference
- **light** - Force light theme
- **dark** - Force dark theme

## CORS Note

This application fetches JSON from external URLs. If you encounter CORS errors, the server hosting the JSON must have CORS enabled or you'll need to use a CORS proxy.

## Tech Stack

- React 19
- TypeScript
- Vite
- react-json-tree
- react-use

## License

MIT
