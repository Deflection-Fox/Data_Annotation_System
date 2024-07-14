class conversationTreeNode {
    // 构造函数
    constructor(tagged_sample_id, create_time, prompts, response, ranking, parent = null, children = []) {
        this.tagged_sample_id = tagged_sample_id;
        this.create_time = create_time;
        this.prompts = prompts;
        this.response = response;
        this.ranking = ranking;
        this.parent = parent;
        this.children = children;
    }

    // 添加子节点
    addChild(childNode) {
        childNode.parent = this;
        this.children.push(childNode);
    }

    // 获取子节点
    getChildren() {
        return this.children;
    }

    // 移除子节点
    removeChild(childNode) {
        this.children = this.children.filter(child => child !== childNode);
        childNode.parent = null;
    }

    // 打印节点信息
    printNode() {
        console.log(`ID: ${this.tagged_sample_id}, Prompts: ${this.prompts}, Response: ${this.response}`);
    }
}

export default conversationTreeNode;
