//components/HelloWorld.vue
<template>
  <button @click="add">count is: {{ count }}</button>
</template>
 
<script>
export default {
  name: "HelloWorld",
  data() {    
    return {
      count: 0
    }
  },
  methods:{
    add(){
      this.count++
    },
    //...
  }
};
</script>
