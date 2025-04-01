<template>
  <div id="scenario-container">
    <h1 id="scenario-title">シナリオメンテナンス</h1>
    <form @submit.prevent="submitData" id="scenario-form">
      <div class="scroll-wrapper">
        <ScreenBlock
          v-for="screen in screens.filter(
            (s) => s.parent_screen_id === null && s.from_branch_id === null
          )"
          :key="screen.screen_id"
          :screen="screen"
          :screenFields="screenFields"
          :lines="lines"
          :visibleLineScreenIds="visibleLineScreenIds"
          :branches="branches"
          :screens="screens"
          :depth="0"
          @add-line="addLine"
          @toggle-line="toggleLineInput"
          @add-screen="addScreenAfter"
          @add-branch="addBranches"
          @add-branch-screen="addScreenToBranch"
        />
      </div>
      <div class="footer-buttons">
        <button type="submit" class="btn save">保存</button>
      </div>
    </form>
  </div>
</template>

<script>
import ScreenBlock from "./components/ScreenBlock.vue";

export default {
  components: { ScreenBlock },
  data() {
    return {
      // 次のID これに+1しながら次の画面IDにしていく。
      nextScreenId: 2,
      // 画面テーブルの要素の配列
      screens: [
        {
          screen_id: 1,
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
          parent_screen_id: null,
          from_branch_id: null,
          depth: 0,
        },
      ],
      // 分岐テーブルの要素の配列　初期状態で分岐は存在しないため初期値なし
      branches: [],
      // セリフテーブルの要素の配列 初期状態でセリフは存在しないため初期値なし
      lines: [],
      //
      visibleLineScreenIds: [],
      screenFields: {
        screen_type: { label: "画面タイプ", type: "number" },
        character_name: { label: "キャラクター名" },
        character_file_name: { label: "キャラクターファイル名" },
        back_file_name: { label: "背景ファイル名" },
        character_scene_type: { label: "キャラ表示種別", type: "number" },
        character_exit_type: { label: "キャラ退場種別", type: "number" },
        character_size: { label: "キャラクターの大きさ", type: "number" },
        character_position: { label: "キャラクターの位置", type: "number" },
        bgm_file_name: { label: "BGMファイル名" },
        next_screen_id: { label: "次画面ID", type: "number" },
      },
    };
  },
  methods: {
    addLine(screenId) {
      // 画面IDに紐づく全てのセリフIDの要素数 + 1をセリフIDに設定する。
      const line_id =
        this.lines.filter((l) => l.screen_id === screenId).length + 1;
      // セリフ配列の末尾に新規作成したセリフを追加する。
      this.lines.push({
        screen_id: screenId,
        line_id,
        line: "",
        line_size: null,
        line_type: null,
      });
    },
    toggleLineInput(screenId) {
      // 初回セリフ追加時に実行される。
      if (!this.visibleLineScreenIds.includes(screenId)) {
        this.visibleLineScreenIds.push(screenId);
        // セリフに一行追加。
        this.addLine(screenId);
      }
    },
    addScreenAfter(afterScreenId) {
      // 引数(子画面の画面ID)と一致する画面要素番号を取得
      const index = this.screens.findIndex(
        (s) => s.screen_id === afterScreenId
      );
      // 取得した要素に紐づく画面要素を取得し設定
      const parent = this.screens[index];
      // 次画面の要素を作成
      const newScreen = this.createEmptyScreen();
      // 次画面の親画面IDに子画面IDを設定
      newScreen.parent_screen_id = parent.screen_id;
      newScreen.from_branch_id = null;
      // 子要素が分岐画面だった時、次画面のネストを深くする　※ネストが深いほど横幅が広くなる
      newScreen.depth =
        parent.from_branch_id !== null ? parent.depth + 1 : parent.depth;
      // 新しく作成した次画面をscreensの末尾に追加する。
      this.screens.splice(index + 1, 0, newScreen);
    },
    addBranches(screenId) {
      const already = this.branches.filter((b) => b.screen_id === screenId);
      // 分岐リストにscreenIdがない場合
      if (already.length === 0) {
        // 画面リストにscreenIdがない場合
        const screen = this.screens.find((s) => s.screen_id === screenId);
        // インデント追加
        screen.depth += 1;
        this.branches.push(
          // 分岐に0,1を追加
          {
            screen_id: screenId,
            branch_id: 0,
            button_label: "",
            next_screen_id: null,
          },
          {
            screen_id: screenId,
            branch_id: 1,
            button_label: "",
            next_screen_id: null,
          }
        );
      }
    },
    addScreenToBranch(branch, parentDepth) {
      // 既に次の画面が設定されていた場合戻る
      if (branch.next_screen_id) return;
      // 次の画面を作成
      const newScreen = this.createEmptyScreen();
      newScreen.from_branch_id = branch.branch_id;
      newScreen.parent_screen_id = null;
      newScreen.depth = parentDepth + 1;
      this.screens.push(newScreen);
      // 分岐に次の画面をnextIDとして設定
      branch.next_screen_id = newScreen.screen_id;
    },
    createEmptyScreen() {
      // 次の画面入力欄を作っている
      return {
        screen_id: this.nextScreenId++,
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
        parent_screen_id: null,
        from_branch_id: null,
        depth: 0,
      };
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
#scenario-container {
  padding: 24px;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: auto;
}
#scenario-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}
.footer-buttons {
  text-align: right;
  margin-top: 32px;
}
.btn {
  padding: 6px 12px;
  border: 1px solid #999;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}
.btn:hover {
  background-color: #e0e0e0;
}
.save {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
.save:hover {
  background-color: #0056b3;
}
.scroll-wrapper {
  overflow-x: auto;
  min-width: 1200px;
}
</style>
