import { OverviewRulerLane } from "vscode"
import { ClassTreeNode } from "./classTreeNode"
import * as postcss from 'postcss'

export default class PostscssTreeNode<PostCssNode extends postcss.Node = postcss.ChildNode> implements ClassTreeNode {
    father: ClassTreeNode | null = null
    children: ClassTreeNode[] = []
    className: string
    constructor(node: PostCssNode) {
        this.className = node?.source?.input.css || ""
    }

    addChild(child: ClassTreeNode): void {
        throw new Error("Method not implemented.")
    }
    setFather(father: ClassTreeNode): void {
        throw new Error("Method not implemented.")
    }
    getFather(): ClassTreeNode | null {
        throw new Error("Method not implemented.")
    }
    getChildren(): ClassTreeNode[] {
        throw new Error("Method not implemented.")
    }
    getClassName(): string {
        throw new Error("Method not implemented.")
    }
    isRoot(): boolean {
        throw new Error("Method not implemented.")
    }
    isLeaf(): boolean {
        throw new Error("Method not implemented.")
    }
    isBranch(): boolean {
        throw new Error("Method not implemented.")
    }
    walkTree(behavior?: (node: ClassTreeNode) => void): void {
        throw new Error("Method not implemented.")
    }

}