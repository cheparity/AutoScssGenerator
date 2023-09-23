import { freemem } from "os"
import { ClassTreeNode } from "../classTreeNode"
import { Node, ChildNode, AnyNode, Rule } from 'postcss'
import { SourceLocation, BaseElementNode } from '@vue/compiler-core';

export default class PostscssTreeNode implements ClassTreeNode {
    private children_: PostscssTreeNode[] = []
    private node_: Rule

    constructor(node: AnyNode) {
        this.node_ = node as Rule
        this.children
        this.name
    }

    get name(): string {
        return (this.node_ as Rule).selector
    }

    get loc(): SourceLocation {
        return (this.node_ as any as BaseElementNode).loc
    }

    get children(): ClassTreeNode[] {
        if (this.children_.length === 0) {
            //init children
            if (this.node_?.nodes === null || !Array.isArray(this.node_.nodes) || this.node_.nodes.length <= 0) {
                return this.children_
            }
            for (var child of this.node_.nodes) {
                this.children_.push(new PostscssTreeNode(child as unknown as Rule))
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