<template>
  <div class="editor-container">
    <el-upload
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="false"
      :headers="headers"
      class="editor-img-uploader"
      v-if="type == 'url'"
    >
      <i ref="uploadRef" class="editor-img-uploader"></i>
    </el-upload>
    <div class="editor" :style="styles">
      <editor-content
        :editor="editor"
      />
    </div>
  </div>
</template>

<script setup>
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { getToken } from "@/utils/auth";
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/upload"); // 上传的图片服务器地址
const headers = ref({
  Authorization: "Bearer " + getToken()
});

const props = defineProps({
  /* 编辑器的内容 */
  modelValue: {
    type: String,
  },
  /* 高度 */
  height: {
    type: Number,
    default: null,
  },
  /* 最小高度 */
  minHeight: {
    type: Number,
    default: null,
  },
  /* 只读 */
  readOnly: {
    type: Boolean,
    default: false,
  },
  /* 上传文件大小限制(MB) */
  fileSize: {
    type: Number,
    default: 5,
  },
  /* 类型（base64格式、url格式） */
  type: {
    type: String,
    default: "url",
  }
});

const editor = ref();

const styles = computed(() => {
  let style = {};
  if (props.minHeight) {
    style.minHeight = `${props.minHeight}px`;
  }
  if (props.height) {
    style.height = `${props.height}px`;
  }
  return style;
});

// 初始化编辑器
onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue || '<p></p>',
    extensions: [
      StarterKit
    ],
    editable: !props.readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      proxy.$emit('update:modelValue', html);
    },
    placeholder: '请输入内容'
  });
});

// 监听modelValue变化
watch(() => props.modelValue, (v) => {
  if (editor.value && v !== editor.value.getHTML()) {
    editor.value.commands.setContent(v || '<p></p>');
  }
});

// 上传前校检格式和大小
function handleBeforeUpload(file) {
  const type = ["image/jpeg", "image/jpg", "image/png", "image/svg"];
  const isJPG = type.includes(file.type);
  //检验文件格式
  if (!isJPG) {
    proxy.$modal.msgError(`图片格式错误!`);
    return false;
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }
  return true;
}

// 上传成功处理
function handleUploadSuccess(res, file) {
  // 如果上传成功
  if (res.code == 200) {
    // 插入图片，res.url为服务器返回的图片链接地址
    editor.value.commands.insertContent({
      type: 'image',
      attrs: {
        src: import.meta.env.VITE_APP_BASE_API + res.fileName,
        alt: '上传的图片',
        title: '上传的图片'
      }
    });
  } else {
    proxy.$modal.msgError("图片插入失败");
  }
}

// 上传失败处理
function handleUploadError() {
  proxy.$modal.msgError("图片插入失败");
}
</script>

<style>
.editor-container {
  width: 100%;
}
.editor-img-uploader {
  display: none;
}
.editor {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  min-width: 100%;
}
.ProseMirror {
  padding: 10px;
  min-height: 300px;
  width: 100%;
}
.ProseMirror-focused {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
</style>
