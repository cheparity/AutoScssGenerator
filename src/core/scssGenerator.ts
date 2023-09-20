/* eslint-disable @typescript-eslint/semi */
import * as vscode from 'vscode'
import { ClassTreeNode } from './classTreeNode'
import * as vueCompiler from '@vue/compiler-core'
import * as postscss from 'postcss-scss'
// import * as sass from 'sass' 
import PostscssTreeNode from './postscssClassTreeNode'
import VueTreeNode from './vueTreeNode'
import postcss = require('postcss')
import { symbolTypeAnnotation } from '@babel/types'

enum StyleLang {
    css = 'css',
    scss = 'scss',
    less = 'less',
    sass = 'sass',
    stylus = 'stylus'
}

export class ScssGenerator {
    private editor: vscode.TextEditor
    private document: vscode.TextDocument
    private templateNode: ClassTreeNode | null = null
    private styleLoc: vueCompiler.SourceLocation | null = null
    constructor(editor: vscode.TextEditor) {
        this.editor = editor
        this.document = editor.document
        const selection = new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(this.document.lineCount - 1, this.document.lineAt(this.document.lineCount - 1).text.length)
        )
        const text = this.document.getText(selection)
        this.parseTrees(text)
        const newRule = postcss.rule({ selector: this.templateNode?.name })
        const html2styleCode = this.parseHtmlRule(newRule, this.templateNode!)
        this.generate(postscss.parse(html2styleCode).source?.input.css as string)
    }

    private parseTrees(text: string) {
        // get the whole text of the document
        const res = vueCompiler.baseParse(text)
        const templateNode = res.children.find((node) => (node as unknown as vueCompiler.BaseElementNode).tag === 'template') as unknown as vueCompiler.BaseElementNode
        const styleNode = res.children.find((node) => (node as unknown as vueCompiler.BaseElementNode).tag === 'style') as unknown as vueCompiler.BaseElementNode
        //todo not walk nodes yet
        this.templateNode = new VueTreeNode(templateNode.children[0] as unknown as vueCompiler.BaseElementNode)
        this.styleLoc = styleNode.loc
        const langProp = styleNode.props.find((prop) => prop.name === 'lang') as unknown as vueCompiler.AttributeNode
        if (langProp?.value?.content !== undefined) {
            const lang = (langProp?.value?.content as unknown as string) || StyleLang.css
            const scssCode = (styleNode.children[0] as unknown as vueCompiler.TextNode).content as unknown as string
            const root: postcss.Root = postscss.parse(scssCode)
        }
        //todo 分析语法树

        /**
         * The style node data: 
         * root: {
         *      nodes: [
         *          node: {
         *              selector: string,
         *              selectors: UNKNOWN,
         *              source.input.css: string (in fact is scss),
         *              type: 'rule' | 'root'
         *          }
         *      ]
         * }
         */
    }

    private parseHtmlRule(fatherRule: postcss.Rule, fatherNode: ClassTreeNode): postcss.Rule {
        for (var child of fatherNode.children) {
            const rule = postcss.rule({ selector: child.name })
            fatherRule.append(rule)
            this.parseHtmlRule(rule, child)
        }
        return fatherRule
    }

    /**
     * Find locations based on [styleLoc] and insert it into proper location.
     * @param code 
     */
    public generate(code: string) {
        //insert
        if (this.editor) {
            this.editor.edit((editBuilder) => {
                const position = new vscode.Position(this.styleLoc?.start.line as number, 0);
                editBuilder.insert(position, `\n${code}\n`)
            })
        }
    }
}

