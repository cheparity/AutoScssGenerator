export class ClassTreeNode {
    father: ClassTreeNode | null = null;
    children: ClassTreeNode[] = [];
    className: string;
    constructor(className: string) {
        this.className = className;
    }

    addChild(child: ClassTreeNode) {
        this.children.push(child);
    }

    setFather(father: ClassTreeNode) {
        this.father = father;
    }

    getFather(): ClassTreeNode | null {
        return this.father;
    }

    getChildren(): ClassTreeNode[] {
        return this.children;
    }

    getClassName(): string {
        return this.className;
    }

    isRoot(): boolean {
        return this.father === null;
    }

    isLeaf(): boolean {
        return this.children.length === 0;
    }

    isBranch(): boolean {
        return !this.isRoot() && !this.isLeaf();
    }

}