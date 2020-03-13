<template>
  <div class="fillContainer">
    <div>
      <el-form :inline="true" ref="add_data" v-model="search_data">
        <!-- 时间筛选 -->
        <el-form-item label="按照时间筛选：">
          <el-date-picker v-model="search_data.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>--
          <el-date-picker v-model="search_data.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="search" @click="handleSearch()">筛选</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button
            type="primary"
            size="small"
            icon="view"
            v-if="user.identity =='manager'"
            @click="handleAdd()"
          >添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table_container">
      <el-table
        v-if="tableData.length>0"
        :data="tableData"
        style="width: 100%"
        border
        max-height="450"
      >
        <el-table-column align="center" prop="date" label="创建时间" width="250">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="type" label="收支类型" width="120"></el-table-column>
        <el-table-column align="center" prop="describe" label="收支描述" width="130"></el-table-column>
        <el-table-column align="center" prop="income" label="收入" width="100">
          <template slot-scope="scope">
            <span style="color:#00d053">{{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="expand" label="支出" width="100">
          <template slot-scope="scope">
            <span style="color:#f56767">{{ scope.row.expand }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cash" label="账户现金" width="120">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="remark" label="备注" width="180"></el-table-column>
        <el-table-column label="操作" prop="operation" width="180" v-if="user.identity =='manager'" align="center">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              icon="delete"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <Dialog :dialog="dialog" :formData="formData" @update="getProfile"></Dialog>
  </div>
</template>

<script>
import Dialog from "../components/Dialog";
export default {
  name: "fundlist",
  data() {
    return {
      search_data: {
        startTime: "",
        endTime: ""
      },
      filterTableData: [],
      paginations: {
        page_index: 1, //当前位于哪一页
        total: 0, //总页数
        page_size: 5, //一页显示的条数
        page_sizes: [5, 10, 15, 20], //每页可显示多少条
        layout: "total,sizes,prev,pager,next,jumper" //翻页属性
      },
      tableData: [],
      allTableData: [],
      formData: {
        type: "",
        describe: "",
        income: "",
        expand: "",
        cash: "",
        remark: "",
        id: ""
      },
      dialog: {
        show: false,
        title: "",
        option: "edit"
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
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
          this.allTableData = res.data;
          this.filterTableData = res.data;
          //设置分页数据
          this.setPaginations();
        })
        .catch(error => {
          console.log(error);
        });
    },
    setPaginations() {
      //分页属性设置,初始化的
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      //设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleEdit(index, row) {
      //编辑
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      };
      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expand: row.expand,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
    },
    handleDelete(index, row) {
      console.log(12345);
      this.$axios
        .delete(`/api/profiles/delete/${row._id}`)
        .then(res => {
          this.$message("删除成功");
          this.getProfile();
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleAdd() {
      this.dialog.show = true;
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add"
      };
      this.formData = {
        type: "",
        describe: "",
        income: "",
        expand: "",
        cash: "",
        remark: "",
        id: ""
      };
    },
    handleSizeChange(page_size) {
      console.log(`每页 ${page_size} 条`);
      //切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      console.log(`当前页: ${page}`);
      //获取当前页面
      let index = this.paginations.page_size * (page - 1);
      //数据的总数
      let nums = this.paginations.page_size * page;
      //定义容器
      let tables = [];

      for (let i = index; i < nums; i++) {
        if (this.allTableData[i]) {
          tables.push(this.allTableData[i]);
        }
        this.tableData = tables;
      }
    },
    handleSearch() {
      //筛选
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "warning",
          message: "请选择时间序列"
        });
        this.getProfile();
        return;
      }

      const startTime = this.search_data.startTime.getTime();
      const endTime = this.search_data.endTime.getTime();

      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= startTime && time <= endTime;
      });

      //分页数据的调用
      this.setPaginations();
    }
  },
  components: {
    Dialog
  }
};
</script>

<style scoped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.btnRight {
  float: center;
  margin-right: 300px;
}

.pagination {
  text-align: left;
  margin-top: 15px;
}
</style>