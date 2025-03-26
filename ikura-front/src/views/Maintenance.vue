<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">シナリオメンテナンス</h1>

    <form @submit.prevent="submitData" class="space-y-4">
      <h2 class="text-xl font-semibold">画面情報</h2>
      <div v-for="(s, i) in screens" :key="i" class="space-y-2">
        <input
          v-model.number="s.screen_id"
          type="number"
          placeholder="画面ID"
          class="input"
        />
        <input
          v-model.number="s.screen_type"
          type="number"
          placeholder="画面タイプ"
          class="input"
        />
        <input
          v-model="s.character_name"
          placeholder="キャラクター名"
          class="input"
        />
        <input
          v-model="s.character_file_name"
          placeholder="キャラクターファイル名"
          class="input"
        />
        <input
          v-model="s.back_file_name"
          placeholder="背景ファイル名"
          class="input"
        />
        <input
          v-model.number="s.character_scene_type"
          type="number"
          placeholder="キャラクター表示種別"
          class="input"
        />
        <input
          v-model.number="s.character_exit_type"
          type="number"
          placeholder="キャラクター退場種別"
          class="input"
        />
        <input
          v-model.number="s.character_size"
          type="number"
          placeholder="キャラクターの大きさ"
          class="input"
        />
        <input
          v-model.number="s.character_position"
          type="number"
          placeholder="キャラクターの位置"
          class="input"
        />
        <input
          v-model="s.bgm_file_name"
          placeholder="BGMファイル名"
          class="input"
        />
        <input
          v-model.number="s.next_screen_id"
          type="number"
          placeholder="次画面ID"
          class="input"
        />
      </div>
      <button type="button" @click="addScreen" class="btn">＋画面追加</button>

      <h2 class="text-xl font-semibold">分岐情報</h2>
      <div v-for="(b, i) in branches" :key="i" class="grid grid-cols-4 gap-2">
        <input
          v-model.number="b.branch_id"
          placeholder="分岐ID"
          class="input"
        />
        <input
          v-model.number="b.screen_id"
          placeholder="画面ID"
          class="input"
        />
        <input
          v-model="b.button_label"
          placeholder="ボタンラベル"
          class="input"
        />
        <input
          v-model.number="b.next_screen_id"
          placeholder="次画面ID"
          class="input"
        />
      </div>
      <button type="button" @click="addBranche" class="btn">＋分岐追加</button>

      <h2 class="text-xl font-semibold">セリフ情報</h2>
      <div v-for="(l, i) in lines" :key="i" class="grid grid-cols-5 gap-2">
        <input
          v-model.number="l.line_id"
          placeholder="セリフID"
          class="input"
        />
        <input
          v-model.number="l.screen_id"
          placeholder="画面ID"
          class="input"
        />
        <input v-model="l.line" placeholder="セリフ" class="input" />
        <input
          v-model.number="l.line_size"
          placeholder="サイズ"
          class="input"
        />
        <input v-model.number="l.line_type" placeholder="種別" class="input" />
      </div>
      <button type="button" @click="addLine" class="btn">＋セリフ追加</button>

      <button type="submit" class="btn bg-blue-600 text-white">保存</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screens: [
        {
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
      ],
      branches: [],
      lines: [],
    };
  },
  methods: {
    addScreen() {
      this.screens.push({
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
      });
    },
    addBranche() {
      this.branches.push({
        branch_id: null,
        screen_id: null,
        button_label: "",
        next_screen_id: null,
      });
    },
    addLine() {
      this.lines.push({
        line_id: null,
        screen_id: null,
        line: "",
        line_size: null,
        line_type: null,
      });
    },
    async submitData() {
      const payload = {
        screens: this.screens,
        branches: this.branches,
        lines: this.lines,
      };
      const res = await fetch("http://localhost:8080/ikura/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      alert(result.status === "ok" ? "保存しました！" : "エラーが発生しました");
    },
  },
};
</script>

<style scoped>
.input {
  @apply border p-2 w-full;
}
.btn {
  @apply px-4 py-2 mt-2 border rounded;
}
</style>
