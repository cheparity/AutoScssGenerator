import { ClassTreeNode, Position } from '../node/classTreeNode'
import * as vueCompiler from '@vue/compiler-core'
import VueTreeNode from '../node/impl/vueTreeNode'


export class VueService {
    private text: string
    lang: string | null = null

    constructor(text: string) {
        this.text = text
    }

    get templateNode(): ClassTreeNode {
        const res = vueCompiler.baseParse(this.text)
        const templateNode = res.children.find((node) => (node as vueCompiler.BaseElementNode).tag === 'template') as unknown as vueCompiler.BaseElementNode
        //todo not walk nodes yet
        return new VueTreeNode(templateNode.children[0] as vueCompiler.BaseElementNode)
    }

    get styleNode(): vueCompiler.BaseElementNode | null {
        const node = vueCompiler.baseParse(this.text).children.find((node) => (node as unknown as vueCompiler.BaseElementNode).tag === 'style') as unknown as vueCompiler.BaseElementNode
        // return new PostscssTreeNode(node)
        return node
    }

    get styleCode(): string {
        if (this.styleNode) {
            const langProp = this.styleNode.props.find((prop) => prop.name === 'lang') as unknown as vueCompiler.AttributeNode
            if (langProp?.value?.content) {
                this.lang = (langProp?.value?.content as string)
            }
            if (this.styleNode.children.length === 0) {
                return ''
            }
            const scssCode = (this.styleNode.children[0] as vueCompiler.TextNode).content as unknown as string
            return scssCode
        }
        return ''
    }

    get styleLoc(): Position {
        if (this.styleNode) {
            const line = this.styleNode.loc.end.line
            const column = this.styleNode.loc.end.column - 8
            return {
                line: line,
                column: column
            }
        }
        return {
            line: -1,
            column: -1
        }
    }

}

