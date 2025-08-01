# Andromeda VS Code Extension

A VS Code extension that integrates the Andromeda Language Server for JavaScript and TypeScript linting and language support.

## Features

- **Real-time linting** for JavaScript and TypeScript files
- **Auto-fix capabilities** for common issues
- **Configurable diagnostics** - run on type, save, or never
- **Custom configuration** support
- **Multiple file format support** - `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`

## Requirements

- [Andromeda](https://github.com/tryandromeda/andromeda) must be installed and available in your PATH
- VS Code 1.74.0 or higher

## Installation

### From Source

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press F5 to launch a new Extension Development Host window

### Installing Andromeda

Make sure you have Andromeda installed:

```bash
# Install from source (requires Rust)
git clone https://github.com/tryandromeda/andromeda
cd andromeda
cargo install --path cli
```

## Configuration

The extension can be configured through VS Code settings:

```json
{
  "andromeda.enable": true,
  "andromeda.run": "onType",
  "andromeda.configPath": null,
  "andromeda.unusedDisableDirectives": "allow",
  "andromeda.executablePath": "andromeda",
  "andromeda.trace.server": "off"
}
```

### Settings

- `andromeda.enable`: Enable/disable the Andromeda language server
- `andromeda.run`: When to run diagnostics (`onType`, `onSave`, `never`)
- `andromeda.configPath`: Path to custom Andromeda configuration file
- `andromeda.unusedDisableDirectives`: How to handle unused disable directives (`allow`, `warn`, `error`)
- `andromeda.executablePath`: Path to the Andromeda executable (default: `andromeda`)
- `andromeda.trace.server`: Enable LSP communication tracing for debugging

## Commands

The extension provides the following commands:

- **Andromeda: Restart Language Server** - Restart the language server
- **Andromeda: Show Output** - Show the language server output channel
- **Andromeda: Apply Auto Fix** - Apply auto-fixes for the current file
- **Andromeda: Fix All Auto-fixable Problems** - Fix all auto-fixable problems in the current file

## Usage

1. Install the extension and ensure Andromeda is in your PATH
2. Open a JavaScript or TypeScript file
3. The extension will automatically start the language server
4. Diagnostics will appear as you type (or on save, depending on configuration)
5. Use the right-click context menu or Command Palette to access commands

## Supported File Types

- JavaScript (`.js`, `.mjs`, `.cjs`)
- JSX (`.jsx`)
- TypeScript (`.ts`)
- TSX (`.tsx`)

## Troubleshooting

### Language Server Not Starting

1. Ensure Andromeda is installed: `andromeda --version`
2. Check the Output panel: **View** → **Output** → **Andromeda Language Server**
3. Try restarting the language server: **Command Palette** → **Andromeda: Restart Language Server**

### Diagnostics Not Appearing

1. Check your `andromeda.run` setting
2. Ensure the file type is supported
3. Check for any configuration file conflicts

## Development

### Building

```bash
npm install
npm run compile
```

### Debugging

1. Open this folder in VS Code
2. Press F5 to launch Extension Development Host
3. Test the extension in the new window

### Publishing

```bash
npm run vscode:prepublish
vsce package
```

## Contributing

Contributions are welcome! Please see the main [Andromeda repository](https://github.com/tryandromeda/andromeda) for contribution guidelines.

## License

This extension is licensed under the Mozilla Public License 2.0, same as the main Andromeda project.

Visual Studio Code extension for Andromeda 
