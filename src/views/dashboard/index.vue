<template>
  <div id="box">
    <div class="left">
      <el-button type="primary" class="button-action" @click="all">获取new_sample表的全部数据</el-button>

      <el-input v-model="new_sample_id" placeholder="请输入new_sample_id" class="input"></el-input>
      <div class="button-group">
        <el-button type="danger" class="button-action" @click="del">删除</el-button>
        <el-button type="primary" class="button-action" @click="get">查询</el-button>
      </div>

      <el-input v-model="parent_id" placeholder="请输入父节点id" class="input"></el-input>
      <el-input v-model="prompt" placeholder="请输入问题" class="input"></el-input>
      <el-input v-model="response" placeholder="请输入回复" class="input"></el-input>
      <div class="button-group">
        <el-button type="success" class="button-action" @click="add">添加</el-button>
        <el-button type="primary" class="button-action" @click="update">修改</el-button>
      </div>
    </div>
    <div class="right">
      <table class="hovertable">
        <thead>
          <tr>
            <th>new_sample_id</th>
            <th>parent_id</th>
            <th>create_time</th>
            <th>prompt</th>
            <th>response</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in new_sample" :key="index">
            <td>{{ item.new_sample_id }}</td>
            <td>{{ item.parent_id }}</td>
            <td>{{ item.create_time }}</td>
            <td>{{ item.prompt }}</td>
            <td>{{ item.response }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import conversationTreeNode from '@/class/conversationTreeNode'
import rankedPairs from '@/function/rankedPairs'
import func from '@/function/func'
import axios from 'axios'

export default {
  data() {
    return {
      new_sample_id: '',
      parent_id: '',
      create_time: '',
      prompt: '',
      response: '',
      new_sample: [],
      treecnt:'',
      treedepth:'',
      childcnt:'',
      maxid:'',
    }
  },
  methods: {
    all() {    //查找info表全部数据
      axios.get('http://127.0.0.1/list/all').then(res=>{
          // console.log(res.data);
          this.new_sample = res.data
          const jsonData = JSON.parse(JSON.stringify(this.new_sample));
          //console.log("aaaaaaaaaaaaaa");
          console.log(jsonData);
      }).catch(err=>{
          console.log("获取数据失败" + err);
      })
    },
    del() {    //删除操作
      axios.get('http://127.0.0.1/list/del',{
        params: {
          new_sample_id: this.new_sample_id
        }
      }).then(res=>{
          // console.log(res.data);
          if(res.data.status == 200) {
          	this.all()
          }else{
          	this.$message({
	          message: '删除失败',
	          type: 'error'
	        });
          }
      }).catch(err=>{
          console.log("操作失败" + err);
      })
    },
    get() {    //查询操作
      axios.get('http://127.0.0.1/list/get',{
        params: {
          new_sample_id: this.new_sample_id
        }
      }).then(res=>{
          // console.log(res.data);
          this.new_sample = res.data
      }).catch(err=>{
          console.log("操作失败" + err);
      })
    },
    async add() {
    try {
        // 添加新的样本
        const addRes = await axios.get('http://127.0.0.1/list/add', {
            params: {
                parent_id: this.parent_id,
                prompt: this.prompt,
                response: this.response
            }
        });

        if (addRes.data.status == 200) {
            this.all();
        } else {
            this.$message({
                message: '添加失败',
                type: 'error'
            });
            return;
        }

        // 获取新样本的 ID
        const maxIdRes = await axios.get('http://127.0.0.1/list/maxid');
        this.maxid = parseInt(maxIdRes.data, 10);
        console.log(this.maxid);

        // 获取当前树的数量
        const treeCntRes = await axios.get('http://127.0.0.1/list/gettreecnt');
        this.treecnt = parseInt(treeCntRes.data, 10);
        console.log(this.treecnt);

        // 获取当前树的最大深度
        const treeDepthRes = await axios.get('http://127.0.0.1/list/getMaxTreeDepth');
        this.treedepth = parseInt(treeDepthRes.data, 10);

        // 获取当前树的最大孩子数
        const childCntRes = await axios.get('http://127.0.0.1/list/getMaxChildrenNum');
        this.childcnt = parseInt(childCntRes.data, 10);

        // 检查树的数量是否超过限制
        if (this.treecnt > this.$globalVar.MAX_TREE_NUM) {
            alert("超过最大树上限，添加失败");
            await axios.get('http://127.0.0.1/list/del', {
                params: {
                    new_sample_id: this.maxid
                }
            });
            return;
        }

        // 检查树的深度是否超过限制
        else if (this.treedepth > this.$globalVar.MAX_TREE_DEPTH) {
            alert("超过树深度上限，添加失败");
            await axios.get('http://127.0.0.1/list/del', {
                params: {
                    new_sample_id: this.maxid
                }
            });
            return;
        }

        // 检查孩子数是否超过限制
        else if (this.childcnt > this.$globalVar.MAX_CHILDREN_NUM && this.parent_id !== -1) {
            alert("超过最大孩子数上限，添加失败");
            await axios.get('http://127.0.0.1/list/del', {
                params: {
                    new_sample_id: this.maxid
                }
            });
            return;
        }
        else this.$message({
                message: '添加成功',
                type: 'success'
            });
    } catch (err) {
        console.log("操作失败" + err);
    }
},
    update() {     //修改操作
      axios.get('http://127.0.0.1/list/update',{
        params: {
          new_sample_id: this.new_sample_id,
          parent_id: this.parent_id,
          prompt: this.prompt,
          response: this.response
        }
      }).then(res=>{
          // console.log(res.data);
          if(res.data.status == 200) {
          	this.all()
          }else{
          	this.$message({
	          message: '修改失败',
	          type: 'error'
	        });
          }
      }).catch(err=>{
          console.log("操作失败" + err);
      })
    },
    pair() {     

      const candidates = [18, 19, 23];
const ballots = [
    [23, 18, 19],
    [18, 23, 19],
    [18, 19, 23]
];


    const result = rankedPairs(candidates, ballots);
    console.log(result);
    }
  }
}


</script>
<style scoped>
#box {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.left {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
}

.right {
  flex: 2;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.button-action {
  width: 100%;
  margin: 5px 0;
  border-radius: 50px;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.button-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.input {
  width: 100%;
  margin: 10px 0;
}

.hovertable {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.hovertable th, .hovertable td {
  padding: 12px;
  border: 1px solid #e0e0e0;
  text-align: left;
}

.hovertable th {
  background-color: #f2f2f2;
}

.hovertable tbody tr:hover {
  background-color: #f9f9f9;
}
</style>