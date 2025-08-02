<template>
  <el-dialog 
    title="编辑个人信息" 
    :visible.sync="visible" 
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form 
      :model="form" 
      ref="form" 
      label-width="80px"
      :rules="rules"
    >
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" maxlength="20" />
      </el-form-item>
      
      <el-form-item label="个人简介" prop="bio">
        <el-input 
          v-model="form.bio" 
          type="textarea" 
          rows="3"
          maxlength="100"
        />
      </el-form-item>
      
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio label="male">男</el-radio>
          <el-radio label="female">女</el-radio>
          <el-radio label="">未设置</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="生日">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="选择生日"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      
      <el-form-item label="所在地">
        <el-input v-model="form.location" placeholder="例如：北京市" />
      </el-form-item>
    </el-form>
    
    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'PersonalDia',
  data() {
    return {
      visible: false,
      form: {
        nickname: '',
        bio: '',
        gender: '',
        birthday: '',
        location: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 打开对话框并初始化表单
    open(userInfo) {
      this.visible = true;
      this.form = { ...userInfo }; // 复制用户信息到表单
    },
    // 提交表单
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('save-info', { ...this.form }); // 通知父组件保存
          this.visible = false;
        }
      });
    }
  }
};
</script>