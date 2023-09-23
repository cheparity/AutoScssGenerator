import { VueParser as VueService } from "../service/vueService";
import * as vscode from 'vscode'
import ScssService from "../service/scssService";
import { Position } from "../node/classTreeNode";
import { constants } from "buffer";
export default class CommandHandler {
    private editor: vscode.TextEditor
    private vue: VueService
    private scss: ScssService
    constructor(editor: vscode.TextEditor) {
        this.editor = editor
        const document = editor.document
        const selection = new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length)
        )
        const text = document.getText(selection)
        this.vue = new VueService(text) //whole text
        const styleCode = this.vue.styleCode
        this.scss = new ScssService(styleCode) //just scss text
    }

    /**
     * Find locations based on [styleLoc] and insert it into proper location.
     */
    public generate() {
        //todo not implement
        const code = this.scss.node2RuleCode(this.vue.templateNode!)
        const styleLoc = this.vue.styleLoc
        if (this.editor) {
            this.editor.edit((editBuilder) => {
                const position = new vscode.Position(styleLoc.line as number, styleLoc.column as number - 1);
                console.log(position)
                editBuilder.insert(position, `\n${code}\n`)
            })
        }
    }
}