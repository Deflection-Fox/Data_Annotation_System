
<template>
    <div id="box">
      <div class="button-group">
        <el-button type="primary" @click="all">获取tagged_sample表的全部数据</el-button>
        <el-button type="primary" @click="tree">树状检索</el-button>
        <el-button type="primary" @click="join">进行ranked pairs排序</el-button>
      </div>
      <el-table :data="tagged_sample" style="width: 100%">
        <el-table-column prop="new_sample_id" label="Sample ID"></el-table-column>
        <el-table-column prop="parent_id" label="Parent ID"></el-table-column>
        <el-table-column prop="create_time" label="Create Time"></el-table-column>
        <el-table-column prop="prompt" label="Prompt"></el-table-column>
        <el-table-column prop="response" label="Response"></el-table-column>
        <el-table-column prop="sort" label="Sort"></el-table-column>
        <el-table-column prop="ranking" label="Ranking"></el-table-column>
        <el-table-column prop="depth" label="Depth"></el-table-column>
      </el-table>
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
        tagged_sample_id: '',
        parent_id: '',
        create_time: '',
        prompt: '',
        response: '',
        tagged_sample: [],
        data:[],
        candidates: [],
        ballots: [],
        ranking: [],
      }
    },
    methods: {
      all() {    //查找info表全部数据
        axios.get('http://127.0.0.1/list/all').then(res=>{
            // console.log(res.data);
            this.tagged_sample = res.data
        }).catch(err=>{
            console.log("获取数据失败" + err);
        })
      },
      tree() {    //查找info表全部数据
        axios.get('http://127.0.0.1/list/tree').then(res=>{
            // console.log(res.data);
            this.tagged_sample = res.data
        }).catch(err=>{
            console.log("获取数据失败" + err);
        })
      },
      join() {
    axios.get('http://127.0.0.1/list/joinpair')
        .then(res => {
            this.data = res.data;
            const result = this.data;

            const processedResults = result.map(result => ({
                new_sample_id: result.new_sample_id,
                ns_parent_id: result.ns_parent_id,
                create_time: result.create_time,
                prompt: result.prompt,
                response: result.response,
                ns_sort: result.ns_sort,
                ballots: JSON.parse(result.ballots)
            }));

            console.log("Processed Results:");
            console.log(processedResults);

            // 按照 ballot_id 分组 ballots
            const groupedBallots = {};
            processedResults.forEach(result => {
                result.ballots.forEach(ballot => {
                    const ballotId = ballot.ballot_id;
                    if (!groupedBallots[ballotId]) {
                        groupedBallots[ballotId] = [];
                    }
                    groupedBallots[ballotId].push({
                        sample_id: ballot.sample_id,
                        ranking: ballot.ranking,
                        parent_id: ballot.parent_id
                    });
                });
            });

            console.log("Grouped ballots by ballot_id:", groupedBallots);

            const groupedByParentId = {};

            // 按照 parent_id 分组
            Object.values(groupedBallots).forEach(ballotGroup => {
                ballotGroup.forEach(ballot => {
                    const parentId = ballot.parent_id;
                    if (!groupedByParentId[parentId]) {
                        groupedByParentId[parentId] = [];
                    }
                    groupedByParentId[parentId].push(ballot);
                });
            });

            console.log('按 parent_id 分组后的数据:', groupedByParentId);

            // 存储排序结果
            const sortedResults = {};

            // 对每组 parent_id 分开处理
            const processGroups = async () => {
                for (const parentId of Object.keys(groupedByParentId)) {
                    const group = groupedByParentId[parentId];

                    // 提取候选人和投票数据
                    const candidates = [...new Set(group.map(ballot => ballot.sample_id))];
                    const ballots = Object.values(groupedBallots).map(ballotGroup =>
                        ballotGroup
                            .filter(ballot => ballot.parent_id == parentId)
                            .sort((a, b) => a.ranking - b.ranking)
                            .map(ballot => ballot.sample_id)
                    );

                    console.log(`Processing Parent ID ${parentId}:`);
                    console.log(`Candidates: ${candidates}`);
                    console.log(`Ballots: ${ballots}`);

                    // 调用 rankedPairs 函数
                    const ranking = rankedPairs(candidates, ballots);

                    // 更新数据库中的排名
                    await Promise.all(ranking.map((id, index) => {
                        const rank = index + 1;
                        return axios.get('http://127.0.0.1/list/updaterank', {
                            params: {
                                ranking: rank,
                                new_sample_id: id
                            }
                        });
                    }));

                    // 存储排序结果
                    sortedResults[parentId] = ranking;
                }
            };

            processGroups().then(() => {
                console.log('分组排序结果:', sortedResults);
            }).catch(err => {
                console.log('处理分组时发生错误:', err);
            });
        })
        .catch(err => {
            console.log("获取数据失败" + err);
        });
}

    }
  }
  
  </script>
  
  <style scoped>
  #box {
    padding: 20px;
  }
  
  .button-group {
    margin-bottom: 20px;
  }
  
  .button-group .el-button {
    margin-right: 10px;
  }
  </style>