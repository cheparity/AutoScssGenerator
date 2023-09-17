export interface ClassTreeNode {

    get className(): string

    get children(): ClassTreeNode[]

    walkTree(behavior: (node: ClassTreeNode) => void): void;
}