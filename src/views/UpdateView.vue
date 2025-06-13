<script setup>
import axios from 'axios'
import { ref,onMounted } from 'vue'

const title = ref('記録の変更')
const db = ref([])

const projectId    = 'vue-cooking-648fe'
const collectionId = 'data'
const baseUrl      = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionId}`

const getData = async () => {
  try {
    const res = await axios.get(baseUrl)
    db.value = (res.data.documents || []).map(doc => ({
      name: doc.name,
      fields: doc.fields,
      editShop: doc.fields.shop?.stringValue || '',
      editMenu: doc.fields.menu?.stringValue || '',
      editReview: doc.fields.review?.stringValue || ''
    }))
  } catch (err) {
    console.error('読み込みエラー:', err)
  }
}

const updateDoc = async (doc) => {
  const url = `https://firestore.googleapis.com/v1/${doc.name}` +
              `?updateMask.fieldPaths=shop&updateMask.fieldPaths=menu&updateMask.fieldPaths=review`

  const body = {
    fields: {
      shop:   { stringValue: doc.editShop },
      menu:   { stringValue: doc.editMenu },
      review: { stringValue: doc.editReview }
    }
  }

  try {
    await axios.patch(url, body)
    await getData()
  } catch (err) {
    console.error('更新エラー:', err)
  }
}

onMounted(getData)
</script>

<template>
  <div>
    <h1>{{ title }}</h1>

    <ul v-if="db.length">
      <li v-for="doc in db" :key="doc.shop" style="margin-bottom:1rem;">

        <div>
          <strong>Current:</strong>
          {{ doc.fields.shop.stringValue }}  {{ doc.fields.menu.stringValue }}
          <span v-if="doc.fields.review">／ {{ doc.fields.review.stringValue }}</span>
        </div>

        <div style="margin:0.5rem 0;">
          <input v-model="doc.editShop" placeholder="New shop" />
          <input v-model="doc.editMenu" placeholder="New menu" />
          <input v-model="doc.editReview" placeholder="New review" />
        </div>

        <button @click="updateDoc(doc)">更新</button>
      </li>
    </ul>

    <p v-else>ドキュメントがありません。</p>
  </div>
</template>