import { ClassTreeNode } from "../classTreeNode"
import { Node, Rule } from 'postcss'

export default class CssTreeNode implements ClassTreeNode {
    private node_: Rule
    private children_: CssTreeNode[] = []
    constructor(node: Node) {
        this.node_ = node as Rule
    }

    get node(): any {
        return this.node_
    }

    get name(): string {
        return this.node.selector
    }

    get children(): ClassTreeNode[] {
        if (this.children_.length === 0) {
            //then init children
            if (this.node.nodes === null || !Array.isArray(this.node.nodes) || this.node.nodes.length <= 0) {
                return this.children_
            }
            for (var child of this.node.nodes) {
                this.children_.push(new CssTreeNode(child as Node))
            }
        }
        return this.children_
    }

    walkTree(behavior: (node: ClassTreeNode, childNode: ClassTreeNode) => void): void {
        for (var child of this.children) {
            behavior(this, child)
            child.walkTree(behavior)
        }
    }

} 