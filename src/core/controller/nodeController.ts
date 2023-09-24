import { VueService as VueService } from "../service/vueService";
import * as vscode from 'vscode'
import ScssService from "../service/scssService";
export default class NodeController {
    private editor: vscode.TextEditor
    private vueService: VueService
    private scssService: ScssService
    constructor(editor: vscode.TextEditor) {
        this.editor = editor
        const document = editor.document
        const selection = new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length)
        )
        const text = document.getText(selection)
        this.vueService = new VueService(text) //whole text
        const styleCode = this.vueService.styleCode
        this.scssService = new ScssService(styleCode) //just scss text
    }

    /**
     * Find locations based on [styleLoc] and insert it into proper location.
     */
    public generate() {
        //todo not implement
        const code = this.scssService.node2RuleCode(this.vueService.templateNode!)
        const styleLoc = this.vueService.styleLoc
        if (this.editor) {
            this.editor.edit((editBuilder) => {
                const position = new vscode.Position(styleLoc.line as number - 1, styleLoc.column as number - 1);
                editBuilder.insert(position, `\n${code}\n`)
            })
        }
    }
}