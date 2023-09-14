import * as vscode from 'vscode';
import { ClassTreeNode } from './classTree';
import * as vueCompiler from '@vue/compiler-core';
import * as postcss from 'postcss-scss';
// import * as sass from 'sass';

enum StyleLang {
    css = 'css',
    scss = 'scss',
    less = 'less',
    sass = 'sass',
    stylus = 'stylus'
}

export class ScssGenerator {
    private document: vscode.TextDocument;
    private htmlTree: ClassTreeNode | null = null;
    private scssTree: ClassTreeNode | null = null;
    constructor(document: vscode.TextDocument) {
        this.document = document;
        const selection = new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(this.document.lineCount - 1, this.document.lineAt(this.document.lineCount - 1).text.length)
        );
        const text = this.document.getText(selection);
        this.parseTemplate2HtmlTree(text);
        this.parseStyle2ScssTree(text);
    }
    private parseTemplate2HtmlTree(text: string) {
        // get the whole text of the document
        const res = vueCompiler.baseParse(text);
        const templateNode = res.children.find((node) => (node as unknown as vueCompiler.BaseElementNode).tag === 'template') as unknown as vueCompiler.BaseElementNode;
        this.walkNodes(templateNode.children[0] as unknown as vueCompiler.BaseElementNode);
    }

    private parseStyle2ScssTree(text: string) {
        const res = vueCompiler.baseParse(text);
        const styleNode = res.children.find((node) => (node as unknown as vueCompiler.BaseElementNode).tag === 'style') as unknown as vueCompiler.BaseElementNode;
        console.log('styleNode is ', styleNode);

        const langProp = styleNode.props.find((prop) => prop.name === 'lang') as unknown as vueCompiler.AttributeNode;
        const lang = (langProp?.value?.content as unknown as string) || StyleLang.css;
        console.log('lang is ', lang);

        //todo 分析语法树J
        const scssCode = (styleNode.children[0] as unknown as vueCompiler.TextNode).content as unknown as string;
        scssCode && console.log('styleStr is ', scssCode);

        // const cssCode = sass.compileString(scssCode);
        // console.log("cssCode is: ", cssCode.css);
        // const node = postcss.parse(cssCode.css);
        const root = postcss.parse(scssCode);
        console.log("postcssRes is: ", root);
        console.log("node[]: ", root.nodes);
        console.log("nodes[0]: ", root.nodes[0]);
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



    private walkNodes(node: vueCompiler.BaseElementNode, father: ClassTreeNode | null = null) {
        console.log('========' + node.tag + '==in==========');
        console.log('node is ', node);
        //get the class attribute, then get the class name
        const classProp = node.props.find((prop) => prop.name === 'class') as unknown as vueCompiler.AttributeNode;
        classProp && console.log('classProp is ', classProp);
        const className = classProp?.value?.content as unknown as string;
        const classTreeNode = new ClassTreeNode(className);
        // set the root node
        if (this.htmlTree === null) {
            this.htmlTree = classTreeNode;
        }
        if (father !== null) {
            classTreeNode.setFather(father);
            father.addChild(classTreeNode);
        }
        if (node.children === null || !Array.isArray(node.children) || node.children.length <= 0) {
            return;
        }
        //walk the children
        node.children.forEach((child) => {
            if (child.type === vueCompiler.NodeTypes.ELEMENT) {
                this.walkNodes(child, classTreeNode);
                // this.walkNodes(child);
            }
        });
        console.log('========' + node.tag + '==out==========');
    }

    public peekClassTree() {
        console.log("=====peek class tree:======");
        console.log(this.htmlTree);
    }
}

