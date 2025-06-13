<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const title =ref("～今日の食事記録～");
const db = ref([]);

const getData = async () => {
  const project1 = "vue-cooking-648fe"; 
  const collection1 = "data"; 
  const url = `https://firestore.googleapis.com/v1/projects/${project1}/databases/(default)/documents/${collection1}`;

  try {
    const result = await axios.get(url);
    console.log(result.data);
    db.value = result.data.documents; 
  } catch (error) {
    console.error("データ取得エラー:", error);
  }
};

onMounted(getData);
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="dbItem in db" :key="dbItem.shop">
        {{ dbItem.fields.menu.stringValue }}
      </li>
    </ul>
  </div>
</template>