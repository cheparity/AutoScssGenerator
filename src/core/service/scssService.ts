import * as postcss from 'postcss';
import { ClassTreeNode } from '../node/classTreeNode'
import * as postscss from 'postcss-scss';
import CssTreeNode from '../node/impl/cssTreeNode';

export default class ScssService {
    source: string
    private root: postcss.Root
    private cssForest_: ClassTreeNode[] = []

    constructor(text: string) {
        this.source = text
        this.root = postscss.parse(this.source)
    }

    get cssForest(): ClassTreeNode[] {
        this.cssForest_ = []
        for (var child of this.root.nodes) {
            this.cssForest_.push(new CssTreeNode(child))
        }
        return this.cssForest_
    }

    /**
     * Generate css rule code: string from given fatherNode.
     * @param node The node of the fatherRule.
     * @returns The code generated.
     */
    public node2RuleCode(node: ClassTreeNode): string {
        //todo has
        const rule = this.node2Rule(postcss.rule({ selector: node.name }), node)
        return postscss.parse(rule).source?.input.css as string
    }

    private node2Rule(fatherRule: postcss.Rule, fatherNode: ClassTreeNode): postcss.Rule {
        for (var child of fatherNode.children) {
            const rule = postcss.rule({ selector: child.name })
            fatherRule.append(rule)
            this.node2Rule(rule, child)
        }
        return fatherRule
    }

}