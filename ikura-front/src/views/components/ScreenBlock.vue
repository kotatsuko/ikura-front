<template>
  <div class="screen-block-wrapper" :style="{ marginLeft: `${depth}px` }">
    <div class="screen-block">
      <h3 class="screen-title">画面 {{ screen.screen_id }}</h3>
      <!-- キャラクター画像プレビュー -->
      <img
        v-if="characterFiles && characterFiles[screen.screen_id]"
        :src="getImageUrl(characterFiles[screen.screen_id])"
        alt="キャラ画像"
        class="preview-image"
      />

      <!-- 背景画像プレビュー -->
      <img
        v-if="backFiles && backFiles[screen.screen_id]"
        :src="getImageUrl(backFiles[screen.screen_id])"
        alt="背景画像"
        class="preview-image"
      />
      <br />
      <button
        type="button"
        class="btn"
        @click="
          $emit('init-screen', {
            screenId: screen.screen_id,
            nextScreenId: screen.next_screen_id,
            parentScreenId: screen.parent_screen_id,
          })
        "
      >
        - 画面削除
      </button>
      <button
        type="button"
        class="btn"
        :disabled="!branches.some((b) => b.screen_id === screen.screen_id)"
        @click="
          $emit('init-branch', {
            screenId: screen.screen_id,
          })
        "
      >
        - 分岐削除
      </button>

      <!-- 入力欄 -->
      <div class="input-grid">
        <div class="form-group" v-for="(field, key) in screenFields" :key="key">
          <!-- ドロップダウン選択 -->
          <select
            v-if="dropdownOptions[key]"
            v-model.number="screen[key]"
            class="input"
          >
            <option
              v-for="(label, value) in dropdownOptions[key]"
              :value="value"
              :key="value"
            >
              {{ label }}
            </option>
          </select>

          <input
            v-if="field.type !== 'none'"
            v-model="screen[key]"
            :type="field.type || 'text'"
            class="input"
            :placeholder="field.label"
          />

          <!-- ✅ キャラクター画像ボタン -->
          <div v-if="key === 'character_file_name'">
            <button
              type="button"
              class="btn"
              @click="$emit('select-character-file', screen.screen_id)"
            >
              キャラクター画像選択
            </button>
          </div>

          <!-- ✅ 背景画像ボタン -->
          <div v-if="key === 'back_file_name'">
            <button
              type="button"
              class="btn"
              @click="$emit('select-back-file', screen.screen_id)"
            >
              背景画像選択
            </button>
          </div>
        </div>
      </div>

      <div class="button-group">
        <button
          type="button"
          class="btn"
          @click="$emit('toggle-line', screen.screen_id)"
        >
          💬 セリフ入力
        </button>
        <button
          type="button"
          class="btn"
          @click="$emit('add-screen', screen.screen_id)"
        >
          ＋ 次の画面を追加
        </button>
        <button
          type="button"
          class="btn"
          @click="$emit('add-branch', screen.screen_id)"
        >
          🔀 分岐追加
        </button>
      </div>

      <div
        v-if="visibleLineScreenIds.includes(screen.screen_id)"
        class="line-block"
      >
        <h4 class="subtitle">セリフ一覧</h4>
        <div
          v-for="(line, j) in lines.filter(
            (l) => l.screen_id === screen.screen_id
          )"
          :key="j"
          class="line-grid"
        >
          <input v-model="line.line" class="input" placeholder="セリフ" />
          <!-- セリフサイズ ドロップダウン -->
          <select v-model.number="line.line_size" class="line-drop">
            <option disabled value="">サイズを選択</option>
            <option :value="0">小</option>
            <option :value="1">中</option>
            <option :value="2">大</option>
          </select>

          <!-- セリフ種別 ドロップダウン -->
          <select v-model.number="line.line_type" class="line-drop">
            <option disabled value="">種別を選択</option>
            <option :value="0">通常</option>
            <option :value="1">ナレーション</option>
            <option :value="2">選択肢</option>
          </select>
          <button
            type="button"
            class="line-drop"
            @click="
              $emit('init-line', {
                screenId: screen.screen_id,
                lineId: line.line_id,
              })
            "
          >
            - 削除
          </button>
        </div>
        <button
          type="button"
          class="btn"
          @click="$emit('add-line', screen.screen_id)"
        >
          ＋ セリフ追加
        </button>
      </div>

      <!-- 分岐表示 -->
      <div
        v-for="branch in branches.filter(
          (b) => b.screen_id === screen.screen_id
        )"
        :key="`branch-${branch.screen_id}-${branch.branch_id}`"
        class="branch-block"
        :style="{ marginLeft: `${(depth + 1) * 24}px` }"
      >
        <h4 class="subtitle">
          分岐
          {{
            branch.branch_id === 0
              ? "左"
              : branch.branch_id === 1
              ? "右"
              : branch.branch_id
          }}
        </h4>
        <div class="branch-grid">
          <p>branch_id</p>
          <input :value="branch.branch_id" class="input readonly" disabled />
          <p>screen_id</p>
          <input :value="branch.screen_id" class="input readonly" disabled />
          <input
            v-model="branch.button_label"
            class="input"
            placeholder="ボタンラベル"
          />
          <p>next_screen_id</p>
          <input
            v-model.number="branch.next_screen_id"
            class="input"
            placeholder="次画面ID"
          />
          <button
            class="btn"
            @click="$emit('add-branch-screen', branch, depth + 1)"
          >
            → 分岐先に画面追加
          </button>
        </div>

        <!-- 分岐先の画面 -->
        <ScreenBlock
          v-for="child in screens.filter(
            (s) => s.screen_id === branch.next_screen_id
          )"
          :key="child.screen_id"
          :screen="child"
          :screenFields="screenFields"
          :lines="lines"
          :visibleLineScreenIds="visibleLineScreenIds"
          :branches="branches"
          :screens="screens"
          :depth="depth + 1"
          :characterFiles="characterFiles"
          :backFiles="backFiles"
          @add-line="$emit('add-line', $event)"
          @init-line="$emit('init-line', $event)"
          @toggle-line="$emit('toggle-line', $event)"
          @add-screen="$emit('add-screen', $event)"
          @init-screen="$emit('init-screen', $event)"
          @add-branch="$emit('add-branch', $event)"
          @init-branch="$emit('init-branch', $event)"
          @add-branch-screen="$emit('add-branch-screen', $event, depth + 1)"
          @select-character-file="$emit('select-character-file', $event)"
          @select-back-file="$emit('select-back-file', $event)"
        />
      </div>

      <!-- 通常画面の子画面 -->
      <ScreenBlock
        v-for="child in screens.filter(
          (s) =>
            s.parent_screen_id === screen.screen_id && s.from_branch_id === null
        )"
        :key="child.screen_id"
        :screen="child"
        :screenFields="screenFields"
        :lines="lines"
        :visibleLineScreenIds="visibleLineScreenIds"
        :branches="branches"
        :screens="screens"
        :depth="depth"
        :characterFiles="characterFiles"
        :backFiles="backFiles"
        @add-line="$emit('add-line', $event)"
        @init-line="$emit('init-line', $event)"
        @toggle-line="$emit('toggle-line', $event)"
        @add-screen="$emit('add-screen', $event)"
        @init-screen="$emit('init-screen', $event)"
        @add-branch="$emit('add-branch', $event)"
        @add-branch-screen="$emit('add-branch-screen', $event, depth)"
        @select-character-file="$emit('select-character-file', $event)"
        @select-back-file="$emit('select-back-file', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ScreenBlock",
  props: {
    screen: Object,
    screenFields: Object,
    lines: Array,
    visibleLineScreenIds: Array,
    branches: Array,
    screens: Array,
    depth: Number,
    characterFiles: Object,
    backFiles: Object,
  },
  data() {
    return {
      dropdownOptions: {
        screen_type: {
          0: "通常画面",
          1: "分岐画面",
          2: "ゲームオーバー画面",
          3: "クリア画面",
        },
        character_scene_type: {
          0: "通常表示",
          1: "アップ表示",
          2: "引き表示",
        },
        character_exit_type: {
          0: "通常アウト",
          1: "スライドアウト",
          2: "フェードアウト",
        },
        character_size: {
          0: "キャラクター サイズ小",
          1: "キャラクター サイズ中",
          2: "キャラクター サイズ大",
        },
        character_position: {
          0: "キャラクター 左寄",
          1: "キャラクター 中央",
          2: "キャラクター 右寄",
        },
      },
    };
  },
  methods: {
    getImageUrl(file) {
      return file ? URL.createObjectURL(file) : "";
    },
  },
};
</script>

<style scoped>
.screen-block-wrapper {
  min-width: 960px;
}
.screen-block {
  min-width: 600px;
  width: 1000px;
  max-width: 100%;
}
.screen-title {
  font-size: 18px;
  font-weight: bold;
  color: #336699;
  margin-bottom: 12px;
}
.input-grid {
  width: 160px;
}
.form-group {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
}
.label {
  font-weight: bold;
  margin-bottom: 4px;
}
.input {
  padding: 6px;
  border: 1px solid #aaa;
  border-radius: 4px;
  width: 100%;
  min-width: 200px;
}
.readonly {
  background-color: #eee;
}
.button-group {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.line-block {
  padding: 5px;
  width: 1000px;
  border-left: 4px solid #b3b3b3;
}
.branch-block {
  margin-top: 20px;
  padding: 5px;
  width: 1000px;
  border-top: 4px solid #b3b3b3;
  border-left: 4px solid #b3b3b3;
}
.branch-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.line-grid {
  display: flex;
  width: 800px;
  height: 30px;
}
.line-drop {
  width: 70px;
  height: 30px;
}
.subtitle {
  font-weight: bold;
  margin-bottom: 8px;
}
.preview-image {
  margin-top: 8px;
  max-width: 200px;
  max-height: 150px;
  border: 1px solid #ccc;
}
</style>
