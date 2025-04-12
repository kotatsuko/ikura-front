<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goNext = () => {
  router.push("/story");
};

const goMaintenance = () => {
  router.push("/maintenance");
};
</script>

<template>
  <!-- さいちゃん担当 -->

  <!--
  <button @click="goNext">testtest始める</button>
  -->

  <!---追加------->

	<div>
	  <video-player 
		ref="videoPlayer"
		:options="videoOptions"
		@ended="onVideoEnded"  
	  />
	  
	  <!-- 再生終了後にボタン表示 -->
	  <div v-if="showButton" class="button-container">
		<button @click="handleButtonClick">ゲームスタート</button>
	  </div>
	</div>

<!--ここまで-->



  <!-- ↓↓↓↓このメンテナンスボタン隠しといて！誰でもメンテ入れたら困るから！！↓↓↓↓-->
  <button @click="goMaintenance">メンテナンス画面</button>
</template>



<!---動画・背景・ボタン関係----->



<style>
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
  
  <script>
  import VideoPlayer from "@/components/VideoPlayer.vue";
  import 'video.js/dist/video-js.css';
  
  export default {
	name: "VideoExample",
	components: {
	  VideoPlayer
	},
	data() {
	  return {
		showButton: false,  // 再生終了後にボタンを出すためのフラグ
		videoOptions: {
		  autoplay: true,
		  controls: false,  // ★ 再生バー（コントロール）を非表示にする
		  sources: [
			{
			  src: "/movie/aa.mp4",
			  type: "video/mp4"
			}
		  ]
		}
	  };
	},
	methods: {
	  onVideoEnded() {
		// 動画再生が終わったらボタンを表示
		this.showButton = true;
	  },
	  handleButtonClick() {
		// ボタンクリック時の処理（例えばページ遷移など）
		console.log('ボタンが押されました');



		// ここに好きなアクションを追加してね！



    
	  }
	}
  };
  </script>
  