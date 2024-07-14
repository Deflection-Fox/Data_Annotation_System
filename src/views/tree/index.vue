<template>
  <div class="app-container">
    <div class="status-info">
      <div>树状态机：</div>
      <div>当前所有的样本数量：{{ tagged_sample_num }}</div>
      <div>正常在对话树中的样本数量：{{ correct_sample_num }}</div>
      <div>当前树个数：{{ total_tree_num }} / 树个数上限：{{ max_tree_num }}</div>
      <div>当前树深度：{{ cur_tree_depth }} / 树深度上限：{{ max_tree_depth }}</div>
      <div>最多孩子节点个数：{{ cur_child_num }} / 孩子节点个数上限：{{ max_child_num }}</div>
    </div>
    <div class="input-group">
      <el-input v-model="set_tree_num" placeholder="设置树个数上限：" class="input"></el-input>
      <el-button type="primary" @click="settreenum">提交</el-button>
    </div>
    <div class="input-group">
      <el-input v-model="set_tree_depth" placeholder="设置树深度上限：" class="input"></el-input>
      <el-button type="primary" @click="settreedepth">提交</el-button>
    </div>
    <div class="input-group">
      <el-input v-model="set_child_num" placeholder="设置孩子节点个数上限：" class="input"></el-input>
      <el-button type="primary" @click="setchildnum">提交</el-button>
    </div>
  </div>
</template>

<script>
/*export default class MessageTreeState(SQLModel, table=True){
    goal_tree_size: int = Field(nullable=False)
    max_depth: int = Field(nullable=False)
    max_children_count: int = Field(nullable=False)
    state: str = Field(nullable=False, max_length=128)
}*/
import axios from 'axios'
export default {
  data() {
    return {
      tagged_sample_num: '',
      correct_sample_num:'',
      total_tree_num: '',
      max_tree_depth: '',
      max_child_num: '',
      max_tree_num: '',
      tagged_sample: [],
      set_tree_depth: '',
      set_child_num: '',
      set_tree_num: '',
      cur_tree_depth: '',
      cur_child_num: '',
    }
  },
  mounted() {
    // 在组件加载后调用API获取数据
    axios.get('http://127.0.0.1/list/getsamplecnt').then(res=>{
          this.tagged_sample_num = res.data
      })
      axios.get('http://127.0.0.1/list/gettreecnt').then(res=>{
          this.total_tree_num = res.data
      })
      axios.get('http://127.0.0.1/list/getcorrectcnt').then(res=>{
          this.correct_sample_num = res.data
      })
      axios.get('http://127.0.0.1/list/getMaxTreeDepth').then(res=>{
          this.cur_tree_depth = res.data
      })
      axios.get('http://127.0.0.1/list/getMaxChildrenNum').then(res=>{
          this.cur_child_num = res.data
      })
      this.max_tree_num = this.$globalVar.MAX_TREE_NUM;
      this.max_tree_depth = this.$globalVar.MAX_TREE_DEPTH;
      this.max_child_num = this.$globalVar.MAX_CHILDREN_NUM;
    },
  methods:{
    getall(){
      axios.get('http://127.0.0.1/list/getsamplecnt').then(res=>{
          this.tagged_sample_num = res.data
      })
      axios.get('http://127.0.0.1/list/gettreecnt').then(res=>{
          this.total_tree_num = res.data
      })
      axios.get('http://127.0.0.1/list/getcorrectcnt').then(res=>{
          this.correct_sample_num = res.data
      })
      axios.get('http://127.0.0.1/list/getMaxTreeDepth').then(res=>{
          this.cur_tree_depth = res.data
      })
      axios.get('http://127.0.0.1/list/getMaxChildrenNum').then(res=>{
          this.cur_child_num = res.data
      })
      this.max_tree_num = this.$globalVar.MAX_TREE_NUM;
      this.max_tree_depth = this.$globalVar.MAX_TREE_DEPTH;
      this.max_child_num = this.$globalVar.MAX_CHILDREN_NUM;
    },
    settreenum(){
      this.$globalVar.MAX_TREE_NUM = this.set_tree_num;
      this.max_tree_num = this.$globalVar.MAX_TREE_NUM;
    },
    settreedepth(){
      this.$globalVar.MAX_TREE_DEPTH = this.set_tree_depth;
      this.max_tree_depth = this.$globalVar.MAX_TREE_DEPTH;
    },
    setchildnum(){
      this.$globalVar.MAX_CHILDREN_NUM = this.set_child_num;
      this.max_child_num = this.$globalVar.MAX_CHILDREN_NUM;
    },
  }
}

</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-info {
  margin-bottom: 20px;
}

.status-info div {
  margin: 5px 0;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-group .input {
  flex: 1;
  margin-right: 10px;
}

.input-group .el-button {
  flex-shrink: 0;
}
</style>