/* eslint-disable @typescript-eslint/semi */
import * as vscode from 'vscode'
import { ClassTreeNode } from './classTreeNode'
import * as vueCompiler from '@vue/compiler-core'
import * as postscss from 'postcss-scss'
// import * as sass from 'sass' 
import PostscssTreeNode from './postscssClassTreeNode'
import VueTreeNode from './vueTreeNode'

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
        this.parseStyle2ScssTree(text)
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

        const root = postscss.parse(scssCode)
        console.log("postcssRes is: ", root)
        console.log("node[]: ", root.nodes)
        for (var n of root.nodes) {
            var t = new PostscssTreeNode(n)
            console.log("======== node in: ======= ", t.className)
            t.walkTree((node) => {
                console.log('node.classname is: ', node.className)
            })
            console.log("======== node out: ======= ", t.className)
        }

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



    // private walkNodes(node: AbstractClassTreeNode, father: AbstractClassTreeNode | null = null): AbstractClassTreeNode {
    //     console.log('========' + node.className + '==in==========')
    //     console.log('node is ', node)
    //     //get the class attribute, then get the class name
    //     const classProp = node.props.find((prop) => prop.name === 'class') as unknown as vueCompiler.AttributeNode
    //     classProp && console.log('classProp is ', classProp)
    //     const className = classProp?.value?.content as unknown as string
    //     const classTreeNode = new AbstractClassTreeNode(className)
    //     // set the root node
    //     if (this.htmlTree === null) {
    //         this.htmlTree = classTreeNode
    //     }
    //     if (father !== null) {
    //         classTreeNode.setFather(father)
    //         father.addChild(classTreeNode)
    //     }
    //     if (node.children === null || !Array.isArray(node.children) || node.children.length <= 0) {
    //         return
    //     }
    //     //walk the children
    //     node.children.forEach((child) => {
    //         if (child.type === vueCompiler.NodeTypes.ELEMENT) {
    //             this.walkNodes(child, classTreeNode)
    //             // this.walkNodes(child)
    //         }
    //     })
    //     console.log('========' + node.tag + '==out==========')
    // }

    // public peekClassTree() {
    //     console.log("=====peek class tree: Begin======")
    //     console.log("html tree: ", this.htmlTree)
    //     console.log("html children: ", this.htmlTree?.children)
    //     console.log("walk html tree: ")
    //     this.htmlTree?.walkTree((node) => {
    //         console.log("node is: ", node)
    //     })

    //     console.log("scss tree: ", this.scssTree)
    //     console.log("=====peek class tree: End======")

    // }
}

