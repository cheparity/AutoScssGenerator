import { BaseElementNode, AttributeNode } from '@vue/compiler-core'
import { ClassTreeNode } from './classTreeNode'

/**
 * Children: lazy load.
 * Classname: lazy load.
 */
export default class VueTreeNode implements ClassTreeNode {
    private _node: BaseElementNode
    private _children: VueTreeNode[] = []

    constructor(node: BaseElementNode) {
        this._node = node
    }

    get children() {
        if (this._children.length === 0) {
            //then init children
            if (this._node?.children === null || !Array.isArray(this._node.children) || this._node.children.length <= 0) {
                return this._children
            }
            for (var child of this._node.children) {
                this._children.push(new VueTreeNode(child as unknown as BaseElementNode))
            }
        }
        return this._children
    }
    get className() {
        const classProp = this._node.props.find((prop) => prop.name === 'class') as unknown as AttributeNode
        return classProp?.name || ''
    }

    walkTree(behavior: (node: ClassTreeNode) => void): void {
        behavior(this)
        for (var child of this.children) {
            child.walkTree(behavior)
        }
    }

}