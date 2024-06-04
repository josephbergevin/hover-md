// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hover-md" is now active!');
	vscode.window.showInformationMessage('Hover MD is active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('hover-md.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Hover MD!');
	});

	context.subscriptions.push(disposable);

	// Hover Provider
	const hoverProvider = vscode.languages.registerHoverProvider('markdown', {
		provideHover(document, position, token) {
			const range = document.getWordRangeAtPosition(position, /\[.*?\]\((.*?)\)/);
			if (!range) {
				console.warn('No range found');
				return;
			}

			const text = document.getText(range);
			const match = /\[.*?\]\((.*?)\)/.exec(text);
			if (!match) {
				console.warn(`No match found for '${text}'`);
				return;
			}

			const filePath = match[1];
			const fullPath = path.resolve(path.dirname(document.uri.fsPath), filePath);

			if (!fs.existsSync(fullPath)) {
				console.error(`File not found: ${fullPath}`);
				return;
			}

			console.log(`Reading file: ${fullPath}`);
			const fileContent = fs.readFileSync(fullPath, 'utf-8');
			console.log(`File content: ${fileContent}`);
			const markdownContent = new vscode.MarkdownString();
			markdownContent.appendCodeblock(fileContent, path.extname(fullPath).substring(1));

			return new vscode.Hover(markdownContent);
		}
	});

	context.subscriptions.push(hoverProvider);
}

// This method is called when your extension is deactivated
export function deactivate() { }
