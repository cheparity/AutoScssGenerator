import { BaseElementNode, AttributeNode } from '@vue/compiler-core'
import { AbstractClassTreeNode } from './abstractClassTreeNode'

export default class VueTreeNode extends AbstractClassTreeNode {
    constructor(node: BaseElementNode) {
        const classProp = node.props.find((prop) => prop.name === 'class') as unknown as AttributeNode
        const name = classProp.name
        super(name)
    }
}