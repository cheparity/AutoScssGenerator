// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { VueService } from './core/service/vueService'
import CommandHandler from './core/controller/nodeController'
import NodeController from './core/controller/nodeController'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "autoscssgenerator" is now active!')

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('autoscssgenerator.helloWorld',
        () => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage('Hello World from AutoScssGenerator!')
        }
    )

    let scssDisposable = vscode.commands.registerCommand('autoscssgenerator.generateScss',
        () => {
            vscode.window.showInformationMessage('Generate Scss from AutoScssGenerator!')
            const editor = vscode.window.activeTextEditor
            if (!editor) {
                console.log('no document is open')
                vscode.window.showInformationMessage('Please open a vue file.')
                return
            }
            const nodeController = new NodeController(editor)
            nodeController.generate()
            nodeController.diff()
        }
    )
    context.subscriptions.push(scssDisposable)
    context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() { }
