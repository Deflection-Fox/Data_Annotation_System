<template>
  <div class="container">
    <div class="button-container">
      <el-button type="danger" class="button-action" @click="upload">上传 new_sample</el-button>
      <el-button type="primary" class="button-action" @click="download">下载 tagged_sample</el-button>
    </div>
    <div class="json-container">
      <pre>{{ jsonData }}</pre>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
export default {
  data() {
    return {
      new_sample_id: '',
      parent_id: '',
      create_time: '',
      prompt: '',
      response: '',
      tagged_sample: '',
      new_sample:[],
      jsonData: '',
    }
  },
  methods: {
    upload() {  
      this.jsonData = require('@/files/input.json');
      this.new_sample = this.jsonData.new_sample;
      this.new_sample.forEach(item => {
        axios.get('http://127.0.0.1/list/add',{
        params: {
          parent_id: item.parent_id,
          prompt: item.prompt,
          response: item.response
        }
      })
    });
    },
    download() {    //查找info表全部数据
      axios.get('http://127.0.0.1/list/download').then(res=>{
          // console.log(res.data);
          this.tagged_sample = res.data[0];
          console.log(this.tagged_sample);
          const content = JSON.stringify(res.data[0]);
          const blob = new Blob([content]);

          // 创建一个 a 标签，添加属性
          let eleLink = document.createElement('a');
          eleLink.download = "已标记样本.json";
          eleLink.style.display = 'none';
          eleLink.href = URL.createObjectURL(blob);

          // 触发点击，然后移除
          document.body.appendChild(eleLink);
          eleLink.click();
          document.body.removeChild(eleLink);
      }).catch(err=>{
          console.log("获取数据失败" + err);
      })
    },
    }
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.button-action {
  width: 48%;
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

.json-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: auto;
  max-height: 400px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 14px;
  color: #333;
}
</style>