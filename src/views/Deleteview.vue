<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const title = ref('感想の削除')
const db = ref([])

const projectId    = 'vue-cooking-648fe'
const collectionId = 'data'
const baseUrl      = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionId}`
const getData = async () => {
  try {
    const res = await axios.get(baseUrl)
    db.value = res.data.documents || []
  } catch (err) {
    console.error('データ取得エラー:', err)
  }
}

const deleteDoc = async (fullName) => {
  const url = `https://firestore.googleapis.com/v1/${fullName}`

  try {
    await axios.delete(url)
    await getData()
  } catch (err) {
    console.error('削除エラー:', err)
  }
}

onMounted(getData)
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <ul v-if="db.length">
      <li v-for="doc in db" :key="doc.shop">
        {{ doc.fields.shop.stringValue }}
        <button @click="deleteDoc(doc.shop)" style="margin-left:8px">削除</button>
      </li>
    </ul>
    <p v-else>ドキュメントがありません。</p>
  </div>
</template>