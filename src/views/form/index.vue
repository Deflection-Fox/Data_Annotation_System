<template>
  <div class="container">
    <div class="button-group">
      <el-button type="primary" @click="all">查询全部new_sample</el-button>
      <el-button type="primary" @click="show">查询首颗需标记new_sample树</el-button>
    </div>
    <draggable
      v-model="new_sample"
      group="sample"
      @change="change"
      @start="start"
      @end="end"
    >
      <div class="item" v-for="(item, index) in new_sample" :key="index">
        {{ item }}
      </div>
    </draggable>
    <div class="input-group">
      <label>父节点id：</label>
      <el-input v-model="parent_id" placeholder="请输入父节点id" class="input"></el-input>
    </div>
    <div class="button-group">
      <el-button type="primary" class="button-submit" @click="tag">提交</el-button>
      <el-button type="info" class="button-prev" @click="previous">上一个</el-button>
      <el-button type="success" class="button-next" @click="next">下一个</el-button>
    </div>
  </div>
</template>
 
<script>
import draggable from "vuedraggable";
import axios from 'axios';
export default {
  components: {
    draggable,
  },
  data() {
    return {
      new_sample_id: '',
      parent_id: '',
      create_time: '',
      prompt: '',
      response: '',
      new_sample: [],
      tmp:"",
      ranking:'',
      sort:'',
      selected_sample:[],
      maxballot:''
    };
  },
  // 新建侦听属性，侦听 selected_sample 
  watch:{
    selected_sample(newVal, oldVal) {
        let sortId = 1
        // newVal 中的元素顺序即用户拖拽后看到的元素顺序
        newVal.forEach(sortItem=>{
          // 找到 List 中对应的字段
          let fieldItem = this.new_sample.find(item=>item.new_sample_id == sortItem.new_sample_id);
          // 将页面显示顺序设置为元素 sort 字段值
          fieldItem.sort = sortId++;
        })
      }
  },
  methods: {
    all() {    //查找info表全部数据
      axios.get('http://127.0.0.1/list/all').then(res=>{
          // console.log(res.data);
          this.new_sample = res.data;
      }).catch(err=>{
          console.log("获取数据失败" + err);
      })
    },
    show() {    
      axios.get('http://127.0.0.1/tagged_list/min').then(res=>{
          //console.log(res.data[0]["MIN(parent_id)"]);
          this.parent_id = res.data[0]["MIN(parent_id)"];   
      }).catch(err=>{
          console.log("获取数据失败" + err);
      })
      axios.get('http://127.0.0.1/list/show').then(res=>{
          // console.log(res.data);
          this.new_sample = res.data;
      }).catch(err=>{
          console.log("获取数据失败" + err);
      })
    },
    async tag() {
    try {
        // 获取最小的 parent_id
        const minParentIdResponse = await axios.get('http://127.0.0.1/tagged_list/min');
        this.parent_id = minParentIdResponse.data[0]["MIN(parent_id)"];

        // 添加 tagged_list 条目
        for (const sortItem of this.selected_sample) {
            await axios.get('http://127.0.0.1/tagged_list/add', {
                params: {
                    parent_id: sortItem.parent_id,
                    prompt: sortItem.prompt,
                    response: sortItem.response,
                    ranking: sortItem.sort
                }
            });
        }

        // 获取最大 ballot_id
        const maxBallotResponse = await axios.get('http://127.0.0.1/ballot/maxballot');
        this.maxballot = maxBallotResponse.data[0]["max_ballot_id"] + 1;

        console.log("maxballot:", this.maxballot);

        // 添加 ballot 条目
        for (const sortItem of this.selected_sample) {
            await axios.get('http://127.0.0.1/ballot/addballot', {
                params: {
                    parent_id: sortItem.parent_id,
                    ballot_id: this.maxballot,
                    sample_id: sortItem.new_sample_id,
                    ranking: sortItem.sort,
                    user_id: 1
                }
            });
        }

        // 显示成功消息
        this.$message({
            message: '提交成功',
            type: 'success'
        });

    } catch (err) {
        console.log("操作失败: " + err);
        this.$message({
            message: '操作失败',
            type: 'error'
        });
    }
},
    previous() {    //查找info表全部数据
      axios.get('http://127.0.0.1/list/previous', {
      params: {
        parent_id: this.parent_id
      }
      }).then(res => {
        // console.log(res.data);
        this.new_sample = res.data;
        this.parent_id = this.new_sample[0].parent_id;
      }).catch(err => {
        console.log("获取数据失败" + err);
      });
    },
    next() {    //查找info表全部数据
      axios.get('http://127.0.0.1/list/next', {
      params: {
        parent_id: this.parent_id
      }
      }).then(res => {
        // console.log(res.data);
        this.new_sample = res.data;
        this.parent_id = this.new_sample[0].parent_id;
      }).catch(err => {
        console.log("获取数据失败" + err);
      });
    },
    // 监听拖拽
    change(event) {
      this.selected_sample = this.new_sample.filter(item => item.parent_id == this.parent_id)
      console.log(this.selected_sample);
      //console.log(this.new_sample[0].parent_id);
      if (this.selected_sample !== null && this.selected_sample !== undefined && this.selected_sample.length > 0) {
        // 赋值：当前排序列表中的最大值+1（也即排序列表的当前长度-1）
        this.selected_sample.forEach(unSortItem => unSortItem.sort = this.selected_sample.length - 1)
      }
      // 将字段信息按sort值排序，并将其复制至排序列表
      this.sorted_sample= JSON.parse(JSON.stringify(this.selected_sample.sort((a,b)=>a.sort-b.sort)))
    },
    // 开始拖拽
    start(event) {
      this.selected_sample = this.new_sample.filter(item => item.parent_id == this.parent_id)
      console.log(this.selected_sample);
      //console.log(this.new_sample[0].parent_id);
      if (this.selected_sample !== null && this.selected_sample !== undefined && this.selected_sample.length > 0) {
        // 赋值：当前排序列表中的最大值+1（也即排序列表的当前长度-1）
        this.selected_sample.forEach(unSortItem => unSortItem.sort = this.selected_sample.length - 1)
      }
      // 将字段信息按sort值排序，并将其复制至排序列表
      this.sorted_sample= JSON.parse(JSON.stringify(this.selected_sample.sort((a,b)=>a.sort-b.sort)))
    },
    // 结束拖拽
    end(event) {
      //console.log("end");
      // event.item  拖拽的本身
      // event.to      拖拽的目标列表
      // event.from    拖拽之前的列表
      // event.oldIndex    拖拽前的位置
      // event.newIndex    拖拽后的位置
      //console.log(event);
      //console.log(this.myArray);
    },
    move (event, orgin) {
      //console.log('move', event, orgin)
    }
  },
};
</script>



<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.el-button {
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.button-submit {
  background-color: #409eff;
  border: none;
  color: white;
}

.button-prev {
  background-color: #909399;
  border: none;
  color: white;
}

.button-next {
  background-color: #67c23a;
  border: none;
  color: white;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.input-group label {
  font-size: 16px;
  margin-right: 10px;
}

.input {
  flex: 1;
}

.item {
  padding: 10px;
  margin: 5px 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
