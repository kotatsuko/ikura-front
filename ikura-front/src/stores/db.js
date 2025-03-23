import { defineStore } from "pinia";
import axios from "axios";

export const useGameStore = defineStore("game", {
  state: () => ({
    screens: [],
    branches: [],
    lines: [],
    loading: false,
    error: null,
  }),

  getters: {
    /** ID に基づいて特定の画面を取得 */
    getScreenById: (state) => (id) => {
      console.log("getScreenById: 検索する screenId:", id);
      console.log(
        "state.screens の型:",
        Array.isArray(state.screens) ? "Array" : typeof state.screens
      );
      console.log("state.screens:", state.screens);

      if (!Array.isArray(state.screens)) return null; // ✅ 配列でない場合は `null` を返す
      return state.screens.find((screen) => screen.screenId === id) || null;
    },

    /** ID に基づいて分岐ボタンを取得 */
    getBranchesByScreenId: (state) => (screenId) => {
      return state.branches.filter((branch) => branch.screenId === screenId);
    },

    /** ID に基づいてセリフを取得 */
    getLinesByScreenId: (state) => (screenId) => {
      return state.lines.filter((line) => line.screenId === screenId);
    },
  },

  actions: {
    /** ゲームデータを API から取得 */
    async fetchGameData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("http://localhost:8080/ikura/get");
        console.log("API 取得結果:", response.data);

        this.screens = response.data.screens;
        this.branches = response.data.branches;
        this.lines = response.data.lines;

        console.log("保存された screens:", this.screens);
      } catch (err) {
        this.error = "データの取得に失敗しました";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
