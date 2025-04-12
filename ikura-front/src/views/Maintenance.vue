<template>
  <div id="scenario-container">
    <h1 id="scenario-title">シナリオメンテナンス</h1>
    <!-- デバッグ用テーブル表示 -->
    <div class="debug-view">
      <h2>デバッグビュー（画面）</h2>
      <table>
        <thead>
          <tr>
            <th>画面ID</th>
            <th>次画面ID</th>
            <th>親画面ID</th>
            <th>分岐ID</th>
            <th>深さ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in screens" :key="s.screen_id">
            <td>{{ s.screen_id }}</td>
            <td>{{ s.next_screen_id }}</td>
            <td>{{ s.parent_screen_id }}</td>
            <td>{{ s.from_branch_id }}</td>
            <td>{{ s.depth }}</td>
          </tr>
        </tbody>
      </table>

      <h2>デバッグビュー（分岐）</h2>
      <table>
        <thead>
          <tr>
            <th>画面ID</th>
            <th>分岐ID</th>
            <th>ラベル</th>
            <th>次画面ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in branches" :key="`b-${b.screen_id}-${b.branch_id}`">
            <td>{{ b.screen_id }}</td>
            <td>{{ b.branch_id }}</td>
            <td>{{ b.button_label }}</td>
            <td>{{ b.next_screen_id }}</td>
          </tr>
        </tbody>
      </table>

      <h2>デバッグビュー（セリフ）</h2>
      <table>
        <thead>
          <tr>
            <th>画面ID</th>
            <th>セリフID</th>
            <th>内容</th>
            <th>サイズ</th>
            <th>種別</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in lines" :key="`l-${l.screen_id}-${l.line_id}`">
            <td>{{ l.screen_id }}</td>
            <td>{{ l.line_id }}</td>
            <td>{{ l.line }}</td>
            <td>{{ l.line_size }}</td>
            <td>{{ l.line_type }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
          :characterFiles="characterFiles"
          :backFiles="backFiles"
          @add-line="addLine"
          @init-line="({ screenId, lineId }) => initLine(screenId, lineId)"
          @toggle-line="toggleLineInput"
          @add-screen="addScreenAfter"
          @add-branch="addBranches"
          @init-screen="
            ({ screenId, nextScreenId, parentScreenId }) =>
              initScreen(screenId, nextScreenId, parentScreenId)
          "
          @init-branch="({ screenId }) => initBranch(screenId)"
          @add-branch-screen="addScreenToBranch"
          @select-character-file="onSelectCharacterFile"
          @select-back-file="onSelectBackFile"
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
          screen_type: 0,
          character_name: "",
          character_file_name: "",
          back_file_name: "",
          character_scene_type: 0,
          character_exit_type: 0,
          character_size: 1,
          character_position: 1,
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
        character_file_name: { label: "キャラクター", type: "none" },
        back_file_name: { label: "背景ファイル", type: "none" },
        character_name: { label: "キャラクター名" },
        screen_type: { label: "画面タイプ", type: "none" },
        character_scene_type: { label: "キャラ表示種別", type: "none" },
        character_exit_type: { label: "キャラ退場種別", type: "none" },
        character_size: { label: "キャラクターの大きさ", type: "none" },
        character_position: { label: "キャラクターの位置", type: "none" },
        bgm_file_name: { label: "BGMファイル" },
        next_screen_id: { label: "", type: "none" },
      },
      characterFiles: {},
      backFiles: {},
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
        line_size: 1,
        line_type: 0,
      });
    },
    initLine(screenId, lineId) {
      // 対象の line を削除
      this.lines = this.lines.filter(
        (line) => !(line.screen_id === screenId && line.line_id === lineId)
      );
      // 削除した line_id より後の line_id を詰める
      this.lines.forEach((line) => {
        if (line.screen_id === screenId && line.line_id > lineId) {
          line.line_id -= 1;
        }
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
      const index = this.screens.findIndex(
        (s) => s.screen_id === afterScreenId
      );
      const parent = this.screens[index];

      // 新しい画面を作成して挿入
      const newScreen = this.createEmptyScreen();
      const maxScreenId = Math.max(...this.screens.map((s) => s.screen_id));
      newScreen.screen_id = maxScreenId + 1;
      newScreen.parent_screen_id = parent.screen_id;
      newScreen.from_branch_id = null;
      newScreen.depth =
        parent.from_branch_id !== null ? parent.depth + 1 : parent.depth;
      if (parent.next_screen_id !== null) {
        newScreen.next_screen_id = parent.next_screen_id;
      }
      // スクリーンを挿入位置に追加
      this.screens.splice(index + 1, 0, newScreen);
      // next_screen_id を自動的に更新
      parent.next_screen_id = newScreen.screen_id;
    },

    initScreen(screenId, nextScreenId, parentScreenId) {
      // 分岐が紐づいているかチェックする。
      const exists = this.branches.some((b) => b.screen_id === screenId);
      if (exists) {
        // 分岐が紐づいていた場合削除する。
        alert(
          `削除画面に分岐が紐づいているため削除できません。\n分岐を削除してから該当画面を削除してください。`
        );
        return; // 処理を中止
      }

      // 削除画面の画面IDが次画面IDに設定されている要素を取得する。
      const targetScreen = this.screens.find(
        (s) => s.next_screen_id === screenId
      );
      // 取得した要素の次画面IDに、削除画面の次画面IDを設定する。
      if (targetScreen) {
        targetScreen.next_screen_id = nextScreenId;
      }

      // 削除画面の画面IDが親画面IDに設定されている要素を取得する。
      const targetParentScreen = this.screens.find(
        (s) => s.parent_screen_id === screenId
      );
      // 取得した要素の親画面IDに、削除画面の親画面IDを設定する。
      if (targetParentScreen) {
        targetParentScreen.parent_screen_id = parentScreenId;
      }

      // 削除画面の画面IDが次画面IDに設定されている要素を取得する。
      const targetBranchesScreen = this.branches.find(
        (s) => s.next_screen_id === screenId
      );
      // 取得した要素の次画面IDに、削除画面の次画面IDを設定する。
      if (targetBranchesScreen) {
        targetBranchesScreen.next_screen_id = nextScreenId;
      }

      // 該当の画面を削除する。
      this.screens = this.screens.filter((s) => s.screen_id !== screenId);
      // 該当のセリフを削除する。
      this.lines = this.lines.filter((s) => s.screen_id !== screenId);
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

    initBranch(screenId) {
      const targetBranches = this.branches.filter(
        (b) => b.screen_id === screenId
      );

      let targetFlag = true;

      for (const branch of targetBranches) {
        console.log(branch.next_screen_id);
        if (branch.next_screen_id !== null) {
          targetFlag = false;
          break;
        }
      }

      if (targetFlag) {
        this.branches = this.branches.filter((b) => b.screen_id !== screenId);
      } else {
        alert(
          `分岐先に画面が存在するため分岐を削除できません。\n分岐を削除する場合は紐づく画面を全て削除してから分岐を削除してください。`
        );
      }
    },

    addScreenToBranch(branch, parentDepth) {
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
        screen_type: 0,
        character_name: "",
        character_file_name: "",
        back_file_name: "",
        character_scene_type: 0,
        character_exit_type: 0,
        character_size: 1,
        character_position: 1,
        bgm_file_name: "",
        next_screen_id: null,
        parent_screen_id: null,
        from_branch_id: null,
        depth: 0,
      };
    },
    async submitData() {
      const formData = new FormData();

      // JSON部分
      const payload = {
        screens: this.screens,
        branches: this.branches,
        lines: this.lines,
      };
      formData.append(
        "json",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      // ファイル部分
      for (const [screenId, file] of Object.entries(this.characterFiles)) {
        formData.append(`character_file_${screenId}`, file);
      }
      for (const [screenId, file] of Object.entries(this.backFiles)) {
        formData.append(`back_file_${screenId}`, file);
      }

      const res = await fetch("http://localhost:8080/ikura/scenario", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      alert(result.status === "ok" ? "保存しました！" : "エラーが発生しました");
    },
    onSelectCharacterFile(screenId) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".png";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const screen = this.screens.find((s) => s.screen_id === screenId);
          if (screen) {
            screen.character_file_name = file.name;
            this.characterFiles[screenId] = file; // 💡 ファイル保持
          }
        }
      };
      input.click();
    },
    onSelectBackFile(screenId) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".png";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const screen = this.screens.find((s) => s.screen_id === screenId);
          if (screen) {
            screen.back_file_name = file.name;
            this.backFiles[screenId] = file; // 💡 ファイル保持
          }
        }
      };
      input.click();
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
