<template>
  <div class="dialog">
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <div class="form">
        <el-form
          ref="form"
          :model="formData"
          :rules="form_rules"
          label-width="120px"
          style="margin:10px;width:auto"
        >
          <el-form-item label="收支类型:">
            <el-select v-model="formData.type" placeholder="收支类型">
              <el-option
                v-for="(formtype,index) in format_type_list"
                :key="index"
                :label="formtype"
                :value="formtype"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="收支描述:" prop="describe">
            <el-input type="describe" v-model="formData.describe"></el-input>
          </el-form-item>

          <el-form-item label="收入:" prop="income">
            <el-input type="income" v-model="formData.income"></el-input>
          </el-form-item>

          <el-form-item label="支出:" prop="expand">
            <el-input type="expand" v-model="formData.expand"></el-input>
          </el-form-item>

          <el-form-item label="账户现金:" prop="cash">
            <el-input type="cash" v-model="formData.cash"></el-input>
          </el-form-item>

          <el-form-item label="备注:" prop="remark">
            <el-input type="remark" v-model="formData.remark"></el-input>
          </el-form-item>

          <el-form-item class="text_right">
            <el-button @click="dialog.show=false">取消</el-button>
            <el-button @click="onSubmit('form')" type="primary">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "dialog",
  data() {
    return {
      format_type_list: ["a", "b", "c", "d"],
      form_rules: {
        describe: [
          { required: true, message: "收支描述不能为空", trigger: "blur" }
        ],
        income: [{ required: true, message: "收入不能为空", trigger: "blur" }],
        expand: [{ required: true, message: "支出不能为空", trigger: "blur" }],
        cash: [{ required: true, message: "现金不能为空", trigger: "blur" }]
      }
    };
  },
  props: {
    dialog: Object,
    formData: Object
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const url = this.dialog.option === "add" ? "add" : `edit/${this.formData.id}`;

          this.$axios.post(`/api/profiles/${url}`, this.formData).then(res => {
            //添加成功
            this.$message({
              message: "数据添加成功",
              type: "success"
            });
            //隐藏对话框dialog
            this.dialog.show = false;
            this.$emit("update");
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>