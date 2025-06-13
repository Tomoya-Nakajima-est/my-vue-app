<script setup>
import axios from "axios";
import { ref } from "vue";

const title = ref("食べた物の記録");
const resText = ref("未完了");

const post = ref({
    fields: {
        shop: { stringValue: ""},
        menu: { stringValue: ""},
        review: { stringValue: ""},
    },
});

const postData = async () =>
{
  const project1 = "vue-cooking-648fe"; 
  const collection1 = "data"; 
  const url = `https://firestore.googleapis.com/v1/projects/${project1}/databases/(default)/documents/${collection1}`;

  try {
    const result = await axios.post(url, post.value);
    console.log(result.data); 
    resText.value = "投稿完了！"; 
  } catch (error) {
    console.error("投稿エラー:", error);
    resText.value = "投稿失敗";
  }
};
</script>

<template>
    <div>
        <h1> {{  title }}</h1>
        <p>{{  resText }}</p>

        <p>お店の名前:<input type="text" v-model="post.fields.shop.stringValue"/></p>
        <p>メニュー:<input type="text" v-model="post.fields.menu.stringValue"/></p>
        <p>感想:<input type="text" v-model="post.fields.review.stringValue"/></p>

        <input type="button" value="投稿！" @click="postData"/>
    </div>
</template>

