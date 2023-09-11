import * as vscode from 'vscode';
import { ClassTreeNode } from './classTree';
import { baseParse, BaseElementNode, ElementNode, NodeTypes, AttributeNode, RootNode } from '@vue/compiler-core';

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
        const res = baseParse(text);
        const templateNode = res.children.find((node) => (node as unknown as BaseElementNode).tag === 'template') as unknown as BaseElementNode;
        this.walkNodes(templateNode.children[0] as unknown as BaseElementNode);
    }

    private parseStyle2ScssTree(text: string) {
        const res = baseParse(text);
        const styleNode = res.children.find((node) => (node as unknown as BaseElementNode).tag === 'style') as unknown as BaseElementNode;
        console.log('styleNode is ', styleNode);

        const langProp = styleNode.props.find((prop) => prop.name === 'lang') as unknown as AttributeNode;
        const lang = (langProp?.value?.content as unknown as string) || StyleLang.css;
        console.log('lang is ', lang);

        //todo 分析语法树

    }

    private walkNodes(node: BaseElementNode, father: ClassTreeNode | null = null) {
        console.log('========' + node.tag + '==in==========');
        console.log('node is ', node);
        //get the class attribute, then get the class name
        const classProp = node.props.find((prop) => prop.name === 'class') as unknown as AttributeNode;
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
            if (child.type === NodeTypes.ELEMENT) {
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

