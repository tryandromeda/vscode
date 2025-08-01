import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
    ExecutableOptions,
    Executable
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Andromeda extension is now active');

    // Start the language server
    startLanguageServer(context);

    // Register commands
    registerCommands(context);

    // Set context for when clauses
    vscode.commands.executeCommand('setContext', 'andromeda.enabled', true);
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

function getExecutablePath(): string {
    const config = vscode.workspace.getConfiguration('andromeda');
    const configuredPath = config.get<string>('executablePath', '');
    
    if (configuredPath) {
        return configuredPath;
    }
    
    // Try to find the binary relative to workspace
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        
        // Check if we're in the andromeda project root
        const targetDebugPath = path.join(workspaceRoot, 'target', 'debug', 'andromeda.exe');
        if (fs.existsSync(targetDebugPath)) {
            return targetDebugPath;
        }
        
        // Check if we're in a subdirectory of the andromeda project
        const parentTargetDebugPath = path.join(workspaceRoot, '..', 'target', 'debug', 'andromeda.exe');
        if (fs.existsSync(parentTargetDebugPath)) {
            return parentTargetDebugPath;
        }
        
        // Check multiple levels up to find the project root
        let currentPath = workspaceRoot;
        for (let i = 0; i < 5; i++) {
            const testPath = path.join(currentPath, 'target', 'debug', 'andromeda.exe');
            if (fs.existsSync(testPath)) {
                return testPath;
            }
            const parentPath = path.dirname(currentPath);
            if (parentPath === currentPath) break; // Reached root
            currentPath = parentPath;
        }
    }
    
    // Fall back to checking PATH
    return 'andromeda';
}

function startLanguageServer(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('andromeda');
    
    if (!config.get('enable', true)) {
        console.log('Andromeda language server is disabled');
        return;
    }

    const executablePath = getExecutablePath();
    
    // Check if executable exists before trying to start server
    if (!fs.existsSync(executablePath)) {
        vscode.window.showErrorMessage(
            `Andromeda executable not found at "${executablePath}". ` +
            `Please build the project with 'cargo build' or set 'andromeda.executablePath' in settings.`,
            'Open Settings'
        ).then(selection => {
            if (selection === 'Open Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'andromeda.executablePath');
            }
        });
        return;
    }
    
    // Server executable options
    const executable: Executable = {
        command: executablePath,
        args: ['lsp'],
        options: {
            env: { ...process.env },
            shell: false  // Don't use shell to avoid PATH issues
        } as ExecutableOptions
    };

    console.log(`Starting Andromeda LSP server with executable: ${executablePath}`);

    const serverOptions: ServerOptions = {
        run: executable,
        debug: executable
    };

    // Client options
    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'typescript' },
            { scheme: 'file', pattern: '**/*.{js,jsx,ts,tsx,mjs,cjs}' }
        ],
        synchronize: {
            configurationSection: 'andromeda',
            fileEvents: [
                vscode.workspace.createFileSystemWatcher('**/*.{js,jsx,ts,tsx,mjs,cjs}'),
                vscode.workspace.createFileSystemWatcher('**/andromeda.config.{js,json}')
            ]
        },
        initializationOptions: {
            run: config.get('run', 'onType'),
            configPath: config.get('configPath'),
            unusedDisableDirectives: config.get('unusedDisableDirectives', 'allow'),
            flags: {}
        },
        outputChannelName: 'Andromeda Language Server',
        traceOutputChannel: vscode.window.createOutputChannel('Andromeda Language Server Trace'),
        // Use push-based diagnostics, not pull-based
        diagnosticCollectionName: 'andromeda',
        // Don't register commands automatically - we'll do it manually to avoid conflicts
        middleware: {
            // Disable automatic diagnostic pulls since we use push-based
            provideDiagnostics: undefined
        }
    };

    // Create and start the language client
    client = new LanguageClient(
        'andromedaLanguageServer',
        'Andromeda Language Server',
        serverOptions,
        clientOptions
    );

    // Start the client and server
    client.start().then(() => {
        console.log('Andromeda language server started successfully');
        
        // Show info message on first activation
        const hasShownWelcome = context.globalState.get('andromeda.hasShownWelcome', false);
        if (!hasShownWelcome) {
            vscode.window.showInformationMessage(
                'Andromeda Language Server is now active! It will provide JavaScript and TypeScript linting.',
                'Show Output'
            ).then(selection => {
                if (selection === 'Show Output') {
                    vscode.commands.executeCommand('andromeda.showOutput');
                }
            });
            context.globalState.update('andromeda.hasShownWelcome', true);
        }
    }).catch(error => {
        console.error('Failed to start Andromeda language server:', error);
        const executablePath = getExecutablePath();
        vscode.window.showErrorMessage(
            `Failed to start Andromeda Language Server using "${executablePath}": ${error.message}. ` +
            `Make sure the Andromeda binary is built (run 'cargo build' in the project root) or set 'andromeda.executablePath' in settings.`,
            'Show Output'
        ).then(selection => {
            if (selection === 'Show Output') {
                vscode.commands.executeCommand('andromeda.showOutput');
            }
        });
    });
}

function registerCommands(context: vscode.ExtensionContext) {
    // Restart language server command
    const restartCommand = vscode.commands.registerCommand('andromeda.restart', async () => {
        if (client) {
            await client.stop();
            client = undefined;
        }
        
        vscode.window.showInformationMessage('Restarting Andromeda Language Server...');
        startLanguageServer(context);
    });

    // Show output command
    const showOutputCommand = vscode.commands.registerCommand('andromeda.showOutput', () => {
        if (client) {
            client.outputChannel.show();
        }
    });

    context.subscriptions.push(
        restartCommand,
        showOutputCommand
    );

    // Listen for configuration changes
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('andromeda')) {
            vscode.commands.executeCommand('andromeda.restart');
        }
    });

    context.subscriptions.push(configChangeListener);
}
