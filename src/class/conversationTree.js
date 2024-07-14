import conversationTreeNode from '@/class/conversationTreeNode';

class conversationTree {
    // 构造函数
    constructor(tree_id, root, depth = 0, max_children = 0) {
        this.tree_id = tree_id;
        this.root = root;
        this.depth = depth;
        this.max_children = max_children;
    }

    // 重置对话树
    reset() {
        this.currentNode = this.root;
    }

    // 遍历对话树（深度优先）
    traverse(node = this.root, callback) {
        callback(node);
        node.getChildren().forEach(child => this.traverse(child, callback));
    }

    // 查找节点
    findNode(tagged_sample_id, node = this.root) {
        if (node.tagged_sample_id === tagged_sample_id) {
            return node;
        }
        for (let child of node.getChildren()) {
            const result = this.findNode(tagged_sample_id, child);
            if (result) return result;
        }
        return null;
    }

    // 添加子节点
    addNode(parentNode, childNode) {
        if (parentNode.getChildren().length < this.max_children || this.max_children === 0) {
            parentNode.addChild(childNode);
        } else {
            console.log('Max children limit reached for this node.');
        }
    }

    // 打印树信息
    printTree() {
        this.traverse(this.root, node => node.printNode());
    }
}

export default conversationTree;
