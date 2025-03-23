<template>
  <!-- たつや担当 -->
  <div>
    <h1>ストーリー画面</h1>

    <!-- ローディング表示 -->
    <p v-if="gameStore.loading">データを取得中...</p>
    <p v-if="gameStore.error" class="error">{{ gameStore.error }}</p>

    <!-- 画面表示 -->
    <div v-if="currentScreen">
      <h2>{{ currentScreen.screenType }}</h2>
      <img
        v-if="currentScreen.characterFileName"
        :src="`/ikura/images/${currentScreen.characterFileName}`"
        alt="キャラクター"
      />
      <img
        v-if="currentScreen.backFileName"
        :src="`/ikura/images/${currentScreen.backFileName}`"
        alt="背景"
      />

      <!-- セリフ表示 -->
      <div v-for="line in lines" :key="line.lineId">
        <p :class="'line-size-' + line.lineSize">{{ line.line }}</p>
      </div>

      <!-- 分岐ボタン表示 -->
      <div v-if="branches.length > 0">
        <button
          v-for="branch in branches"
          :key="branch.branchId"
          @click="changeScreen(branch.nextScreenId)"
        >
          {{ branch.buttonLabel }}
        </button>
      </div>
      <button
        v-else-if="currentScreen.nextScreenId !== null"
        @click="changeScreen(currentScreen.nextScreenId)"
      >
        次へ
      </button>
    </div>
    <p v-else>currentScreen が `null` または `undefined` です</p>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useGameStore } from "../stores/db.js";

const gameStore = useGameStore();
const currentScreenId = ref(null); // 初期値を `null` に変更

// デバッグ用ログ
console.log("StoryView.vue: コンポーネントがマウントされました");

// コンポーネントがマウントされたら API データを取得
onMounted(async () => {
  console.log("StoryView.vue: fetchGameData() を実行します");
  await gameStore.fetchGameData();
  console.log("StoryView.vue: データ取得完了", gameStore.screens);

  // データ取得後に初期画面 ID をセット
  currentScreenId.value = 0; // ✅ データ取得後に初期画面を設定
});

// 現在の画面を取得
const currentScreen = computed(() => {
  console.log("currentScreenId:", currentScreenId.value);
  if (currentScreenId.value === null) return null;
  const screen = gameStore.getScreenById(currentScreenId.value);
  console.log("取得した currentScreen:", screen);
  return screen;
});

// 分岐ボタンを取得
const branches = computed(() => {
  if (currentScreenId.value === null) return [];
  const branchList = gameStore.getBranchesByScreenId(currentScreenId.value);
  console.log("取得した branches:", branchList);
  return branchList;
});

// セリフを取得
const lines = computed(() => {
  if (currentScreenId.value === null) return [];
  const lineList = gameStore.getLinesByScreenId(currentScreenId.value);
  console.log("取得した lines:", lineList);
  return lineList;
});

// 画面の切り替え
const changeScreen = (nextScreenId) => {
  console.log(`changeScreen: ${currentScreenId.value} → ${nextScreenId}`);
  currentScreenId.value = nextScreenId;
};

// `currentScreen` の変化を監視
watch(currentScreen, (newVal, oldVal) => {
  console.log("currentScreen が更新されました:", { oldVal, newVal });
});
</script>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}
.line-size-0 {
  font-size: small;
}
.line-size-1 {
  font-size: medium;
}
.line-size-2 {
  font-size: large;
}
</style>
