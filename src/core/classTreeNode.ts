export interface ClassTreeNode {

    get name(): string

    get children(): ClassTreeNode[]

    walkTree(behavior: (node: ClassTreeNode, child: ClassTreeNode) => void): void;
}