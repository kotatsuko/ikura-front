<template>
  <div class="container" @click="handleScreenClick">
    <!-- 再生開始ボタン（最初に表示） -->
    <div v-if="!videoStarted" class="button-container">
      <button @click="startVideo">(´◉◞౪◟◉)</button>
    </div>

    <video-player
      v-if="videoStarted"
      ref="videoPlayer"
      :options="videoOptions"
      @ended="onVideoEnded"
    />

    <!-- 再生終了後にボタン表示 -->
    <div v-if="showButton" class="button-container">
      <button @click="handleButtonClick">ゲームスタート</button>
    </div>
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer.vue";
import "video.js/dist/video-js.css";
import { useRouter } from "vue-router";

export default {
  name: "VideoExample",
  components: {
    VideoPlayer,
  },
  data() {
    return {
      videoStarted: false,
      showButton: false, // 再生終了後にボタンを出すためのフラグ
      videoOptions: {
        autoplay: true,
        controls: false, // ★ 再生バー（コントロール）を非表示にする
        sources: [
          {
            src: "/ikura/movie/aa.mp4",
            type: "video/mp4",
          },
        ],
        clickLog: [],
      },
    };
  },
  methods: {
    onVideoEnded() {
      // 動画再生が終わったらボタンを表示
      this.showButton = true;
    },
    handleButtonClick() {
      // ボタンクリック時の処理（例えばページ遷移など）
      console.log("ボタンが押されました");

      // ここに好きなアクションを追加してね！
    },
    goNext() {
      this.$router.push("/story");
    },
    goMaintenance() {
      this.$router.push("/maintenance");
    },
    startVideo() {
      this.videoStarted = true;

      // DOM更新後に再生を確実に実行（Vueの非同期DOM更新対策）
      this.$nextTick(() => {
        if (this.$refs.videoPlayer?.player) {
          const playPromise = this.$refs.videoPlayer.player.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("動画の自動再生に失敗しました:", error);
            });
          }
        }
      });
    },
    handleScreenClick(event) {
      const now = Date.now();
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      const area =
        clientX < innerWidth * 0.2 && clientY < innerHeight * 0.2
          ? "left-top"
          : clientX > innerWidth * 0.8 && clientY < innerHeight * 0.2
          ? "right-top"
          : null;

      if (area) {
        this.clickLog.push({ area, time: now });

        // 5秒以内にフィルター
        this.clickLog = this.clickLog.filter((log) => now - log.time <= 5000);

        const leftTopCount = this.clickLog.filter(
          (l) => l.area === "left-top"
        ).length;
        const rightTopCount = this.clickLog.filter(
          (l) => l.area === "right-top"
        ).length;

        if (leftTopCount >= 1 && rightTopCount >= 2) {
          this.clickLog = [];
          this.goMaintenance();
        }
      } else {
        this.clickLog = []; // 条件外のクリックでリセット
      }
      console.log(this.clickLog);
    },
  },
};
</script>

<!---動画・背景・ボタン関係----->

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.container {
  background-color: rgb(0, 0, 0); /* 背景色を指定 */
  height: 100vh; /* 画面の高さすべて */
  width: 100vw; /* 画面の幅すべて */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.button-container {
  margin-top: 20px;
  text-align: center;
}
button {
  padding: 10px 20px;
  font-size: 18px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background-color: #2980b9;
}
</style>
