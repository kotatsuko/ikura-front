<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">画面マスターメンテナンス</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- 数値入力 -->
      <div>
        <label class="block">画面ID</label>
        <input
          v-model.number="screen.screen_id"
          type="number"
          class="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label class="block">画面タイプ</label>
        <input
          v-model.number="screen.screen_type"
          type="number"
          class="border p-2 w-full"
          required
        />
      </div>

      <!-- テキスト入力 -->
      <div>
        <label class="block">キャラクター名</label>
        <input
          v-model="screen.character_name"
          type="text"
          class="border p-2 w-full"
        />
      </div>

      <!-- ファイル選択 -->
      <div>
        <label class="block">キャラクターファイル</label>
        <input
          type="file"
          @change="onFileChange($event, 'character_file_name')"
          class="border p-2 w-full"
        />
      </div>
      <div>
        <label class="block">背景ファイル</label>
        <input
          type="file"
          @change="onFileChange($event, 'back_file_name')"
          class="border p-2 w-full"
        />
      </div>
      <div>
        <label class="block">BGMファイル</label>
        <input
          type="file"
          @change="onFileChange($event, 'bgm_file_name')"
          class="border p-2 w-full"
        />
      </div>

      <!-- 数値入力（続き） -->
      <div>
        <label class="block">キャラクター表示種別</label>
        <input
          v-model.number="screen.character_scene_type"
          type="number"
          class="border p-2 w-full"
        />
      </div>
      <div>
        <label class="block">キャラクター退場種別</label>
        <input
          v-model.number="screen.character_exit_type"
          type="number"
          class="border p-2 w-full"
        />
      </div>
      <div>
        <label class="block">キャラクターの大きさ</label>
        <input
          v-model.number="screen.character_size"
          type="number"
          class="border p-2 w-full"
        />
      </div>
      <div>
        <label class="block">キャラクターの位置</label>
        <input
          v-model.number="screen.character_position"
          type="number"
          class="border p-2 w-full"
        />
      </div>
      <div>
        <label class="block">次画面ID</label>
        <input
          v-model.number="screen.next_screen_id"
          type="number"
          class="border p-2 w-full"
        />
      </div>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        保存
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screen: {
        screen_id: null,
        screen_type: null,
        character_name: "",
        character_file_name: "",
        back_file_name: "",
        character_scene_type: null,
        character_exit_type: null,
        character_size: null,
        character_position: null,
        bgm_file_name: "",
        next_screen_id: null,
      },
      selectedFiles: {},
    };
  },
  methods: {
    onFileChange(event, key) {
      const file = event.target.files[0];
      if (file) {
        this.screen[key] = file.name;
        this.selectedFiles[key] = file;
      }
    },
    async submitForm() {
      const formData = new FormData();
      formData.append("json", JSON.stringify(this.screen));
      for (const key in this.selectedFiles) {
        formData.append(key, this.selectedFiles[key]);
      }
      try {
        const response = await fetch("http://localhost:8080/ikura/scenario", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          alert("保存が完了しました。");
        } else {
          alert("エラーが発生しました。");
        }
      } catch (error) {
        console.error(error);
        alert("通信エラーが発生しました。");
      }
    },
  },
};
</script>

<style scoped>
input,
button {
  font-size: 1rem;
}
</style>
