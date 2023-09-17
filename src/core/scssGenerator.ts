/* eslint-disable @typescript-eslint/semi */
import * as vscode from 'vscode'
import { ClassTreeNode } from './classTreeNode'
import * as vueCompiler from '@vue/compiler-core'
import * as postscss from 'postcss-scss'
// import * as sass from 'sass' 
import PostscssTreeNode from './postscssClassTreeNode'
import VueTreeNode from './vueTreeNode'
import postcss = require('postcss')

enum StyleLang {
    css = 'css',
    scss = 'scss',
    less = 'less',
    sass = 'sass',
    stylus = 'stylus'
}

export class ScssGenerator {
    private document: vscode.TextDocument
    private htmlTree: ClassTreeNode | null = null
    private scssTree: ClassTreeNode | null = null
    constructor(document: vscode.TextDocument) {
        this.document = document
        const selection = new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(this.document.lineCount - 1, this.document.lineAt(this.document.lineCount - 1).text.length)
        )
        const text = this.document.getText(selection)
        this.parseTemplate2HtmlTree(text)
        const newRule = postcss.rule({ selector: this.htmlTree?.name })
        const r = this.generateScssCode(newRule, this.htmlTree!)
        console.log("generateScssCode res: ")
        console.log(postscss.parse(r).source?.input.css)

        // this.parseStyle2ScssTree(text)
    }
    private parseTemplate2HtmlTree(text: string) {
        // get the whole text of the document
        const res = vueCompiler.baseParse(text)
        const templateNode = res.children.find((node) => (node as unknown as vueCompiler.BaseElementNode).tag === 'template') as unknown as vueCompiler.BaseElementNode
        // this.walkNodes(templateNode.children[0] as unknown as vueCompiler.BaseElementNode)
        //todo not walk nodes yet
        this.htmlTree = new VueTreeNode(templateNode.children[0] as unknown as vueCompiler.BaseElementNode)
    }

    private parseStyle2ScssTree(text: string) {
        const res = vueCompiler.baseParse(text)
        const styleNode = res.children.find((node) => (node as unknown as vueCompiler.BaseElementNode).tag === 'style') as unknown as vueCompiler.BaseElementNode
        console.log('styleNode is ', styleNode)

        const langProp = styleNode.props.find((prop) => prop.name === 'lang') as unknown as vueCompiler.AttributeNode
        const lang = (langProp?.value?.content as unknown as string) || StyleLang.css
        console.log('lang is ', lang)

        //todo 分析语法树
        const scssCode = (styleNode.children[0] as unknown as vueCompiler.TextNode).content as unknown as string

        const root: postcss.Root = postscss.parse(scssCode)
        /**
         * The node data: 
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

    private generateScssCode(fatherRule: postcss.Rule, fatherNode: ClassTreeNode): postcss.Rule {
        for (var child of fatherNode.children) {
            const rule = postcss.rule({ selector: `.${child.name}` })
            fatherRule.append(rule)
            this.generateScssCode(rule, child)
        }
        return fatherRule
    }
}

