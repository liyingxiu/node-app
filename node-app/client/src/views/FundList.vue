<template>
  <el-table v-if="tableData.length>0" :data="tableData" style="width: 100%" border max-height="450">
    <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
    <el-table-column align="center" prop="date" label="创建时间" width="250"></el-table-column>
    <el-table-column align="center" prop="type" label="收支类型" width="120"></el-table-column>
    <el-table-column align="center" prop="describe" label="收支描述" width="150"></el-table-column>
    <el-table-column align="center" prop="income" label="收入" width="120"></el-table-column>
    <el-table-column align="center" prop="expand" label="支出" width="120"></el-table-column>
    <el-table-column align="center" prop="cash" label="账户现金" width="140"></el-table-column>
    <el-table-column align="center" prop="remark" label="备注" width="220"></el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "fundlist",
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      //获取表格数据
      this.$axios
        .get("/api/profiles")
        .then(res => {
          this.tableData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
</style>