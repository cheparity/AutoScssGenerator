export abstract class AbstractClassTreeNode {
    father: AbstractClassTreeNode | null = null;
    children: AbstractClassTreeNode[] = [];
    className: string;
    constructor(className: string) {
        this.className = className;
    }

    addChild(child: AbstractClassTreeNode) {
        this.children.push(child);
    }

    setFather(father: AbstractClassTreeNode) {
        this.father = father;
    }

    getFather(): AbstractClassTreeNode | null {
        return this.father;
    }

    getChildren(): AbstractClassTreeNode[] {
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

    walkTree(behavior: ((node: AbstractClassTreeNode) => void) = () => { }) {
        if (this.children === null || !Array.isArray(this.children) || this.children.length <= 0) {
            return
        }
        //walk the children
        this.children.forEach((child) => {
            behavior(this)
            child.walkTree()
        })
    }

}