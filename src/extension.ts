import * as fs from "fs";
import process from "node:process";
import * as vscode from "vscode";
import {
  Executable,
  ExecutableOptions,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;
let outputChannel: vscode.OutputChannel | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log("🚀 Andromeda extension activation started");

  // Create output channel early and show activation message
  outputChannel = vscode.window.createOutputChannel(
    "Andromeda Language Server",
  );
  outputChannel.clear();
  outputChannel.appendLine("🚀 Andromeda extension activation started");
  outputChannel.appendLine(`Extension ID: ${context.extension.id}`);
  outputChannel.appendLine(
    `Extension version: ${context.extension.packageJSON.version}`,
  );
  outputChannel.appendLine(`VS Code version: ${vscode.version}`);
  outputChannel.appendLine(`Activation time: ${new Date().toISOString()}`);
  outputChannel.appendLine(
    `Workspace folders: ${vscode.workspace.workspaceFolders?.length || 0}`,
  );

  try {
    outputChannel.appendLine("Registering commands...");
    registerCommands(context);
    outputChannel.appendLine("Commands registered successfully");
    outputChannel.appendLine("Setting extension context...");
    vscode.commands.executeCommand("setContext", "andromeda.enabled", true);
    outputChannel.appendLine("Extension context set");

    // Show a prominent success message
    vscode.window
      .showInformationMessage(
        'Andromeda Language Server is now active! Check Command Palette (Ctrl+Shift+P) for "Andromeda" commands.',
        "Show Commands",
        "Show Output",
      )
      .then((selection) => {
        if (selection === "Show Commands") {
          vscode.commands.executeCommand(
            "workbench.action.showCommands",
            "Andromeda",
          );
        } else if (selection === "Show Output") {
          outputChannel?.show();
        }
      });

    // Start the language server (less critical for command visibility)
    outputChannel.appendLine("Starting language server...");
    startLanguageServer(context);

    outputChannel.appendLine("Andromeda extension fully activated!");
    outputChannel.show(); // Force show the output to help with debugging
  } catch (error) {
    const errorMsg = `Extension activation failed: ${error}`;
    console.error(errorMsg);
    outputChannel.appendLine(errorMsg);
    outputChannel.show();
    vscode.window.showErrorMessage(
      `Andromeda extension failed to activate: ${error}`,
    );
  }
}

export function deactivate(): Thenable<void> | undefined {
  if (outputChannel) {
    outputChannel.appendLine("Andromeda extension deactivated");
    outputChannel.dispose();
    outputChannel = undefined;
  }

  if (!client) {
    return undefined;
  }
  return client.stop();
}

function getExecutablePath(): string {
  const config = vscode.workspace.getConfiguration("andromeda");
  const configuredPath = config.get<string>("executablePath", "");
  return configuredPath || "andromeda";
}

function startLanguageServer(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("andromeda");

  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel(
      "Andromeda Language Server",
    );
  }

  outputChannel.appendLine("Starting Andromeda Language Server...");

  if (!config.get("enable", true)) {
    console.log("Andromeda language server is disabled");
    outputChannel.appendLine("Language server is disabled in settings");
    vscode.window.showInformationMessage(
      "Andromeda Language Server is disabled. Enable it in settings to use language features.",
    );
    return;
  }

  const executablePath = getExecutablePath();
  outputChannel.appendLine(`Using executable path: ${executablePath}`);

  // Check if Andromeda is available
  const isAbsolutePath = executablePath.includes("/") ||
    executablePath.includes("\\") ||
    executablePath.includes(":");

  // If it's an absolute path, check if file exists
  if (isAbsolutePath && !fs.existsSync(executablePath)) {
    const message =
      `Andromeda executable not found at "${executablePath}". Please install Andromeda or update the path in settings.`;
    outputChannel.appendLine(`ERROR: ${message}`);
    vscode.window
      .showErrorMessage(message, "Install Guide", "Open Settings")
      .then((selection) => {
        if (selection === "Install Guide") {
          vscode.env.openExternal(
            vscode.Uri.parse(
              "https://github.com/tryandromeda/andromeda#installation",
            ),
          );
        } else if (selection === "Open Settings") {
          vscode.commands.executeCommand(
            "workbench.action.openSettings",
            "andromeda.executablePath",
          );
        }
      });
    return;
  }

  if (!isAbsolutePath) {
    console.log(
      `Attempting to start Andromeda LSP server from PATH: ${executablePath}`,
    );
    outputChannel.appendLine(
      `Attempting to start server from PATH: ${executablePath}`,
    );
  }

  const executable: Executable = {
    command: executablePath,
    args: ["lsp"],
    options: {
      env: { ...process.env },
      shell: !isAbsolutePath,
    } as ExecutableOptions,
  };

  console.log(
    `Starting Andromeda LSP server with executable: ${executablePath}`,
  );
  outputChannel.appendLine(
    `Starting LSP server with command: ${executablePath} lsp`,
  );

  const serverOptions: ServerOptions = {
    run: executable,
    debug: executable,
  };

  // Client options
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: "file", language: "javascript" },
      { scheme: "file", language: "typescript" },
      { scheme: "file", pattern: "**/*.{js,jsx,ts,tsx,mjs,cjs}" },
    ],
    synchronize: {
      configurationSection: "andromeda",
      fileEvents: [
        vscode.workspace.createFileSystemWatcher(
          "**/*.{js,jsx,ts,tsx,mjs,cjs}",
        ),
        vscode.workspace.createFileSystemWatcher(
          "**/andromeda.config.{js,json,toml,yaml}",
        ),
        vscode.workspace.createFileSystemWatcher(
          "**/andromeda.{json,toml,yaml}",
        ),
      ],
    },
    initializationOptions: {
      run: config.get("run", "onType"),
      configPath: config.get("configPath"),
      unusedDisableDirectives: config.get("unusedDisableDirectives", "allow"),
      flags: {},
      format: {
        enable: config.get("format.enable", true),
      },
      codeAction: {
        autoFix: {
          enable: config.get("codeAction.autoFix.enable", true),
        },
      },
      completion: {
        enable: config.get("completion.enable", true),
      },
      hover: {
        enable: config.get("hover.enable", true),
      },
    },
    outputChannel: outputChannel,
    traceOutputChannel: vscode.window.createOutputChannel(
      "Andromeda Language Server Trace",
    ),
    diagnosticCollectionName: "andromeda",
    middleware: {
      provideDiagnostics: undefined,
      provideHover: (document, position, token, next) => {
        if (!config.get("hover.enable", true)) {
          return undefined;
        }
        return next(document, position, token);
      },
      provideCompletionItem: (document, position, context, token, next) => {
        if (!config.get("completion.enable", true)) {
          return next(document, position, context, token);
        }
        return next(document, position, context, token);
      },
      provideCodeActions: (document, range, context, token, next) => {
        if (!config.get("codeAction.autoFix.enable", true)) {
          return next(document, range, context, token);
        }
        return next(document, range, context, token);
      },
    },
  };

  client = new LanguageClient(
    "andromedaLanguageServer",
    "Andromeda Language Server",
    serverOptions,
    clientOptions,
  );

  client
    .start()
    .then(() => {
      console.log("Andromeda language server started successfully");
      outputChannel?.appendLine(
        "✓ Andromeda language server started successfully",
      );
      outputChannel?.appendLine(
        "Ready to provide JavaScript and TypeScript language features",
      );

      const hasShownWelcome = context.globalState.get(
        "andromeda.hasShownWelcome",
        false,
      );
      if (!hasShownWelcome) {
        vscode.window
          .showInformationMessage(
            "Andromeda Language Server is now active! It will provide JavaScript and TypeScript linting.",
            "Show Output",
          )
          .then((selection) => {
            if (selection === "Show Output") {
              vscode.commands.executeCommand("andromeda.showOutput");
            }
          });
        context.globalState.update("andromeda.hasShownWelcome", true);
      }
    })
    .catch((error) => {
      console.error("Failed to start Andromeda language server:", error);
      outputChannel?.appendLine(
        `✗ Failed to start language server: ${error.message}`,
      );

      let errorMessage =
        `Failed to start Andromeda Language Server: ${error.message}`;
      let actions: string[] = ["Show Output"];

      if (
        error.message.includes("ENOENT") ||
        error.message.includes("not found")
      ) {
        errorMessage =
          `Andromeda executable not found. Please install Andromeda or check your 'andromeda.executablePath' setting.`;
        actions = ["Install Guide", "Open Settings", "Show Output"];
        outputChannel?.appendLine(
          "Suggestion: Install Andromeda or check executable path setting",
        );
      } else if (error.message.includes("already exists")) {
        errorMessage =
          `Command registration conflict detected. This usually resolves after restarting the extension.`;
        actions = ["Restart Extension", "Show Output"];
        outputChannel?.appendLine(
          "Suggestion: Restart VS Code or the extension",
        );
      }

      vscode.window
        .showErrorMessage(errorMessage, ...actions)
        .then((selection) => {
          switch (selection) {
            case "Install Guide":
              vscode.env.openExternal(
                vscode.Uri.parse(
                  "https://github.com/tryandromeda/andromeda#installation",
                ),
              );
              break;
            case "Open Settings":
              vscode.commands.executeCommand(
                "workbench.action.openSettings",
                "andromeda.executablePath",
              );
              break;
            case "Restart Extension":
              vscode.commands.executeCommand("workbench.action.reloadWindow");
              break;
            case "Show Output":
              vscode.commands.executeCommand("andromeda.showOutput");
              break;
          }
        });
    });
}

function registerCommands(context: vscode.ExtensionContext) {
  const restartCommand = vscode.commands.registerCommand(
    "andromeda.restart",
    async () => {
      if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel(
          "Andromeda Language Server",
        );
      }

      outputChannel.appendLine("Restarting Andromeda Language Server...");

      if (client) {
        await client.stop();
        client = undefined;
      }

      vscode.window.showInformationMessage(
        "Restarting Andromeda Language Server...",
      );
      startLanguageServer(context);
    },
  );

  const showOutputCommand = vscode.commands.registerCommand(
    "andromeda.showOutput",
    () => {
      if (outputChannel) {
        outputChannel.show();
      } else if (client) {
        client.outputChannel.show();
      } else {
        vscode.window.showInformationMessage(
          "Andromeda Language Server is not running",
        );
      }
    },
  );

  const applyAutoFixCommand = vscode.commands.registerCommand(
    "andromeda.client.applyAutoFix",
    async () => {
      if (!client) {
        vscode.window.showErrorMessage(
          "Andromeda Language Server is not running",
        );
        return;
      }

      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      try {
        const result = await client.sendRequest("workspace/executeCommand", {
          command: "andromeda.applyAutoFix",
          arguments: [activeEditor.document.uri.toString()],
        });

        if (result) {
          vscode.window.showInformationMessage("Auto-fix applied successfully");
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to apply auto-fix: ${error}`);
      }
    },
  );

  const fixAllCommand = vscode.commands.registerCommand(
    "andromeda.client.fixAll",
    async () => {
      if (!client) {
        vscode.window.showErrorMessage(
          "Andromeda Language Server is not running",
        );
        return;
      }

      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      try {
        const result = await client.sendRequest("workspace/executeCommand", {
          command: "andromeda.fixAll",
          arguments: [activeEditor.document.uri.toString()],
        });

        if (result) {
          vscode.window.showInformationMessage(
            "All auto-fixable problems fixed",
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to fix all problems: ${error}`);
      }
    },
  );

  // Format document command
  const formatCommand = vscode.commands.registerCommand(
    "andromeda.format",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }
      try {
        await vscode.commands.executeCommand("editor.action.formatDocument");
        vscode.window.showInformationMessage("Document formatted successfully");
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to format document: ${error}`);
      }
    },
  );

  context.subscriptions.push(
    restartCommand,
    showOutputCommand,
    applyAutoFixCommand,
    fixAllCommand,
    formatCommand,
  );

  const configChangeListener = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (event.affectsConfiguration("andromeda")) {
        vscode.commands.executeCommand("andromeda.restart");
      }
    },
  );

  context.subscriptions.push(configChangeListener);

  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    [
      { scheme: "file", language: "javascript" },
      { scheme: "file", language: "typescript" },
    ],
    {
      provideCodeActions(_document, _range, context, _token) {
        const codeActions: vscode.CodeAction[] = [];

        for (const diagnostic of context.diagnostics) {
          if (diagnostic.source === "andromeda") {
            const autoFixAction = new vscode.CodeAction(
              `Auto-fix: ${diagnostic.message}`,
              vscode.CodeActionKind.QuickFix,
            );
            autoFixAction.command = {
              command: "andromeda.client.applyAutoFix",
              title: "Apply Auto Fix",
            };
            codeActions.push(autoFixAction);
          }
        }

        const fixAllAction = new vscode.CodeAction(
          "Fix all Andromeda problems",
          vscode.CodeActionKind.SourceFixAll,
        );
        fixAllAction.command = {
          command: "andromeda.client.fixAll",
          title: "Fix All Auto-fixable Problems",
        };
        codeActions.push(fixAllAction);

        return codeActions;
      },
    },
  );

  context.subscriptions.push(codeActionProvider);
}
