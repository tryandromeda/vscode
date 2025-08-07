# Andromeda VS Code Extension

A VS Code extension that integrates the Andromeda Language Server for comprehensive JavaScript and TypeScript development support.

## ✨ Features

- **🔍 Real-time Diagnostics** - Live error reporting with comprehensive linting rules
- **⚡ Enhanced Auto-completion** - Context-aware completions for:
  - Andromeda APIs (file system, environment, process operations)
  - Web APIs (Canvas, Crypto, Performance, Storage, Timers)
  - Console methods with rich descriptions
  - Database operations (SQLite)
- **🛠️ Code Actions & Quick Fixes** - Auto-fix capabilities for common issues
- **📝 Document Formatting** - Built-in code formatting support
- **💡 Hover Information** - Rich documentation and type information on hover
- **⚙️ Configurable Diagnostics** - Run on type, save, or never
- **📁 Multiple File Format Support** - `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`
- **🎯 Advanced Linting Rules** including:
  - Empty statement detection
  - Variable usage validation  
  - Unreachable code detection
  - Camelcase naming enforcement
  - Console usage warnings
  - Debugger statement detection
  - Type checking for TypeScript
  - And many more...

## 🚀 Requirements

- [Andromeda](https://github.com/tryandromeda/andromeda) v0.1.0-draft14 or higher
- VS Code 1.74.0 or higher

## 📦 Installation

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

# Or install from crates.io (when available)
cargo install --git https://github.com/tryandromeda/andromeda
```

## ⚙️ Configuration

The extension can be configured through VS Code settings:

```json
{
  "andromeda.enable": true,
  "andromeda.run": "onType",
  "andromeda.configPath": null,
  "andromeda.unusedDisableDirectives": "allow",
  "andromeda.executablePath": "andromeda",
  "andromeda.trace.server": "off",
  "andromeda.format.enable": true,
  "andromeda.codeAction.autoFix.enable": true,
  "andromeda.completion.enable": true,
  "andromeda.hover.enable": true
}
```

### Settings Reference

#### Core Settings
- `andromeda.enable`: Enable/disable the Andromeda language server
- `andromeda.run`: When to run diagnostics (`onType`, `onSave`, `never`)
- `andromeda.configPath`: Path to custom Andromeda configuration file
- `andromeda.unusedDisableDirectives`: Handle unused disable directives (`allow`, `warn`, `error`)
- `andromeda.executablePath`: Path to the Andromeda executable (default: `andromeda`)
- `andromeda.trace.server`: Enable LSP communication tracing for debugging

#### Feature Settings
- `andromeda.format.enable`: Enable code formatting (default: `true`)
- `andromeda.codeAction.autoFix.enable`: Enable auto-fix code actions (default: `true`)
- `andromeda.completion.enable`: Enable enhanced completions (default: `true`)
- `andromeda.hover.enable`: Enable hover information (default: `true`)

## 🎮 Commands

Access these commands via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Andromeda: Restart Language Server** - Restart the language server
- **Andromeda: Show Output** - Show the language server output channel
- **Andromeda: Apply Auto Fix** - Apply auto-fixes for the current file
- **Andromeda: Fix All Auto-fixable Problems** - Fix all auto-fixable problems in the current file
- **Andromeda: Format Document** - Format the current document

## 🎯 Usage

1. Install the extension and ensure Andromeda is in your PATH
2. Open a JavaScript or TypeScript file
3. The extension will automatically start the language server
4. Enjoy real-time diagnostics, enhanced completions, and more!

### Code Completion Examples

The extension provides rich completions for various APIs:

```javascript
// Andromeda File System APIs
Andromeda.readTextFileSync|  // 🗎 Reads a text file synchronously
Andromeda.writeFileSync|     // 💾 Writes binary data to a file

// Web APIs
crypto.subtle.digest|        // 🔐 Computes a digest of the given data
performance.now|             // ⏱️ High-precision timing
localStorage.setItem|        // 💾 Stores data in local storage

// Canvas APIs (when working with canvas)
ctx.fillRect|                // 🔳 Draws a filled rectangle
ctx.beginPath|               // 🎯 Begins a new path
```

### Auto-Fix Examples

The extension can automatically fix common issues:

- Convert `var` declarations to `let` or `const`
- Remove unused variables
- Fix camelCase naming issues
- Remove empty statements
- And more...

## 📁 Supported File Types

- **JavaScript**: `.js`, `.mjs`, `.cjs`
- **JSX**: `.jsx`
- **TypeScript**: `.ts`
- **TSX**: `.tsx`

## 🔧 Troubleshooting

### Language Server Not Starting

1. **Check Andromeda installation**: `andromeda --version`
2. **Check the Output panel**: View → Output → "Andromeda Language Server"
3. **Restart the language server**: Command Palette → "Andromeda: Restart Language Server"
4. **Check executable path**: Ensure `andromeda.executablePath` is correctly set

### Diagnostics Not Appearing

1. **Check run mode**: Verify your `andromeda.run` setting
2. **File type support**: Ensure the file type is supported
3. **Configuration conflicts**: Check for conflicting configuration files
4. **Enable diagnostics**: Ensure `andromeda.enable` is set to `true`

### Completions Not Working

1. **Feature enabled**: Check `andromeda.completion.enable` setting
2. **Trigger characters**: Try typing `.` after `Andromeda`, `console`, `crypto`, etc.
3. **Server status**: Check if the language server is running properly

### Formatting Issues

1. **Feature enabled**: Check `andromeda.format.enable` setting
2. **File saved**: Ensure the file is saved before formatting
3. **Syntax errors**: Fix any syntax errors that might prevent formatting

## 🚀 Development

### Building

```bash
npm install
npm run compile
```

### Debugging

1. Open this folder in VS Code
2. Press F5 to launch Extension Development Host
3. Test the extension in the new window
4. Check the Debug Console for any issues

### Testing

```bash
npm run lint      # Check for TypeScript issues
npm run watch     # Watch for changes during development
```

## 📋 What's New in v0.2.0

- ✨ **Enhanced Completions**: Context-aware completions for Andromeda and Web APIs
- 🛠️ **Code Actions**: Auto-fix capabilities with quick fixes for common issues  
- 📝 **Formatting Support**: Built-in document and range formatting
- 💡 **Hover Information**: Rich documentation on hover (when available)
- ⚙️ **Improved Configuration**: More granular control over features
- 🎯 **Better Diagnostics**: Enhanced linting rules with clearer error messages
- 🖱️ **Context Menu Integration**: Right-click to access auto-fix options

## 🤝 Contributing

We welcome contributions! Please see the [main Andromeda repository](https://github.com/tryandromeda/andromeda) for contribution guidelines.

## 📜 License

Mozilla Public License Version 2.0 - see [LICENSE.md](LICENSE.md) for details.

## 🔗 Links

- [Andromeda Runtime](https://github.com/tryandromeda/andromeda)
- [Issues & Bug Reports](https://github.com/tryandromeda/andromeda/issues)
- [Discord Community](https://discord.gg/tgjAnX2Ny3)
