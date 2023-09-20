import { BaseElementNode, AttributeNode } from '@vue/compiler-core'
import { ClassTreeNode } from './classTreeNode'

export default class VueTreeNode implements ClassTreeNode {
    private node_: BaseElementNode
    private children_: VueTreeNode[] = []

    constructor(node: BaseElementNode) {
        this.node_ = node
    }

    get children() {
        if (this.children_.length === 0) {
            //then init children
            if (this.node_?.children === null || !Array.isArray(this.node_.children) || this.node_.children.length <= 0) {
                return this.children_
            }
            for (var child of this.node_.children) {
                this.children_.push(new VueTreeNode(child as unknown as BaseElementNode))
            }
        }
        return this.children_
    }

    get name() {
        //todo lack of #id's situation
        for (var prop of this.node_.props) {
            prop = (prop as AttributeNode)
            if (prop.name === 'class') {
                return `.${prop.value?.content}`
            } else if (prop.name === 'id') {
                return `#${prop.value?.content}`
            }
        }
        console.log("no name or id found!")
        return ''
    }

    walkTree(behavior: (node: ClassTreeNode, childNode: ClassTreeNode) => void): void {
        for (var child of this.children) {
            behavior(this, child)
            child.walkTree(behavior)
        }
    }



}