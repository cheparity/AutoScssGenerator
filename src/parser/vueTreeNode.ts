import { BaseElementNode, AttributeNode } from '@vue/compiler-core'
import { ClassTreeNode } from './classTreeNode'

export default class VueTreeNode implements ClassTreeNode {
    vueNode: BaseElementNode
    father: ClassTreeNode | null = null
    children: ClassTreeNode[] = []
    className: string
    constructor(node: BaseElementNode) {
        this.vueNode = node
        const classProp = node.props.find((prop) => prop.name === 'class') as unknown as AttributeNode
        this.className = classProp.name
    }
    addChild(child: ClassTreeNode): void {
        this.children.push(child)
        child.setFather(this)
    }
    setFather(father: ClassTreeNode): void {
        this.father = father
    }
    getFather(): ClassTreeNode | null {
        throw new Error('Method not implemented.')
    }
    getChildren(): ClassTreeNode[] {
        throw new Error('Method not implemented.')
    }
    getClassName(): string {
        throw new Error('Method not implemented.')
    }
    isRoot(): boolean {
        throw new Error('Method not implemented.')
    }
    isLeaf(): boolean {
        throw new Error('Method not implemented.')
    }
    isBranch(): boolean {
        throw new Error('Method not implemented.')
    }
    walkTree(behavior: (node: ClassTreeNode) => void): void {
        throw new Error('Method not implemented.')
    }
}