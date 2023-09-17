import { freemem } from "os"
import { ClassTreeNode } from "./classTreeNode"
import { Node, ChildNode, AnyNode, Rule } from 'postcss'

export default class PostscssTreeNode implements ClassTreeNode {
    private _children: PostscssTreeNode[] = []
    private _node: Rule

    constructor(node: AnyNode) {
        this._node = node as Rule
        this.children
        this.className
    }
    get className(): string {
        return (this._node as Rule).selector
    }
    get children(): ClassTreeNode[] {
        if (this._children.length === 0) {
            //init children
            if (this._node?.nodes === null || !Array.isArray(this._node.nodes) || this._node.nodes.length <= 0) {
                return this._children
            }
            for (var child of this._node.nodes) {
                this._children.push(new PostscssTreeNode(child as unknown as Rule))
            }
        }
        return this._children
    }

    walkTree(behavior: (node: ClassTreeNode) => void): void {
        behavior(this)
        for (var child of this.children) {
            child.walkTree(behavior)
        }
    }

}