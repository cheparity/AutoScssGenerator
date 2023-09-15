export interface ClassTreeNode {
    father: ClassTreeNode | null;
    children: ClassTreeNode[];
    className: string;

    addChild(child: ClassTreeNode): void

    setFather(father: ClassTreeNode): void

    getFather(): ClassTreeNode | null

    getChildren(): ClassTreeNode[]

    getClassName(): string

    isRoot(): boolean

    isLeaf(): boolean

    isBranch(): boolean

    walkTree(behavior: (node: ClassTreeNode) => void): void;

}