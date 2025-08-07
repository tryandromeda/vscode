# Zed Andromeda Extension

A [Zed](https://zed.dev) extension for the [Andromeda](https://github.com/tryandromeda/andromeda) JavaScript and TypeScript runtime.

## Features

- **Enhanced JavaScript/TypeScript Support**: Advanced linting, auto-completion, and formatting
- **Web API Integration**: Built-in support for Canvas, Crypto, and other web APIs
- **Auto-fix Code Actions**: Automatically fix common issues
- **Real-time Diagnostics**: Get instant feedback as you type
- **Hover Documentation**: Rich documentation on hover
- **Smart Completions**: Context-aware code completion

## Installation

1. Open Zed
2. Open the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. Run `zed: extensions`
4. Search for "Andromeda"
5. Click "Install"

## Configuration

To use the Andromeda Language Server with JavaScript and TypeScript files, add the following to your Zed settings:

```json
{
  "lsp": {
    "andromeda": {
      "settings": {
        "andromeda": {
          "enable": true,
          "run": "onType",
          "format": {
            "enable": true
          },
          "codeAction": {
            "autoFix": {
              "enable": true
            }
          },
          "completion": {
            "enable": true
          },
          "hover": {
            "enable": true
          }
        }
      }
    }
  },
  "languages": {
    "JavaScript": {
      "language_servers": [
        "andromeda",
        "!typescript-language-server",
        "!vtsls",
        "!eslint"
      ],
      "formatter": "language_server"
    },
    "TypeScript": {
      "language_servers": [
        "andromeda",
        "!typescript-language-server", 
        "!vtsls",
        "!eslint"
      ],
      "formatter": "language_server"
    }
  }
}
```

## Language Server

This extension uses the Andromeda Language Server, which provides:

- Advanced static analysis for JavaScript and TypeScript
- Web API specific completions and validations
- Performance-focused linting rules
- Modern ECMAScript feature support

## Requirements

The extension will automatically download and install the Andromeda binary when first used. If you prefer to use a system-installed version, ensure `andromeda` is available in your PATH.

To install Andromeda manually, visit: <https://github.com/tryandromeda/andromeda#installation>

## Development

To develop this extension locally:

1. Clone this repository
2. Install Rust via [rustup](https://rustup.rs/)
3. Open Zed and go to `zed: extensions`
4. Click "Install Dev Extension" and select this directory

## Support

For issues and feature requests, please visit:

- Extension issues: <https://github.com/tryandromeda/vscode/issues>
- Andromeda core issues: <https://github.com/tryandromeda/andromeda/issues>

## License

This extension is licensed under the Apache 2.0 License.
