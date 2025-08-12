<template>
  <el-dialog
    title="编辑个人信息"
    :visible.sync="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="form.nickname" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input
          type="textarea"
          v-model="form.design"
          placeholder="请输入个人简介"
          :rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="handleAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "PersonalDia",
  data() {
    return {
      dialogVisible: false,
      form: {
        nickname: "",
        design: "",
        avatar: ""
      },
      imageUrl: ""
    };
  },
  methods: {
    open() {
      this.dialogVisible = true;
      // 可以在这里初始化表单数据
    },
    handleClose() {
      this.dialogVisible = false;
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.includes("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImage && isLt2M;
    },
    handleAvatarUpload({ file }) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result;
        this.form.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    handleSubmit() {
      this.$emit("flesh", this.form);
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped>
.avatar-uploader {
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 6px;
}
</style>
