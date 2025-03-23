<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goNext = () => {
  router.push("/story");
};
</script>

<template>
  <!-- さいちゃん担当 -->
  <button @click="goNext">始める</button>
</template>
