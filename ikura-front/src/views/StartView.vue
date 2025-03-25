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
  <button @click="goNext">始める</button>
  <!-- ↓↓↓↓このメンテナンスボタン隠しといて！誰でもメンテ入れたら困るから！！↓↓↓↓-->
  <button @click="goMaintenance">メンテナンス画面</button>
</template>
