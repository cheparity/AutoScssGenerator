import { OverviewRulerLane } from "vscode"
import { AbstractClassTreeNode } from "./abstractClassTreeNode"
import * as postcss from 'postcss'

export default class PostscssTreeNode<T extends postcss.Node = postcss.ChildNode> extends AbstractClassTreeNode {
    constructor(node: T) {
        const name: string = node?.source?.input.css || ""
        super(name)
    }
}