<template>
  <div>
    <!-- 再生開始ボタン（最初に表示） -->
    <div v-if="!videoStarted" class="button-container">
      <button @click="startVideo">▶️ スタート</button>
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

  <button @click="goMaintenance">メンテナンス画面</button>
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
  },
};
</script>

<!---動画・背景・ボタン関係----->

<style scoped>
body {
  background-color: rgb(0, 0, 0); /* 背景色を指定 */
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
