import { SourceLocation } from '@vue/compiler-core';

export interface ClassTreeNode {

    get name(): string

    get children(): ClassTreeNode[]

    walkTree(behavior: (node: ClassTreeNode, child: ClassTreeNode) => void): void;
}

export interface Locational {
    get loc(): Position
}

export interface Position {
    line: number;
    column: number;
}