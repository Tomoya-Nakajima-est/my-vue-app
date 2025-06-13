<!-- <script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const title = ref("東京のおすすめのお店");


const subGenres = ref([]); // プルダウン用（重複なし）
const selectedGenre = ref(''); // 選択されたジャンル
const shops = ref([]); // 店舗一覧

const getData = async () => {
  try {
    const apiKey = "36b1f45fc2a788fd"; // ←あなたのAPIキーに置き換えてください
    const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${apiKey}&large_area=Z011&format=json&count=100`;

    const res = await axios.get(url);
    const shopList = res.data.results.shop || [];

    const genreSet = new Set();
    shopList.forEach(shop => {
      if (shop.sub_genre?.name) {
        genreSet.add(shop.sub_genre.name);
      }
    });

    subGenres.value = Array.from(genreSet);
    shops.value = shopList;

  } catch (error) {
    console.error("データ取得エラー:", error);
  }
};

onMounted(getData);
</script>

<template>
  <div>
    <h1>{{ title }}</h1>

    <div v-if="subGenres.length">
      <label>ジャンルを選択：</label>
      <select v-model="selectedGenre">
        <option disabled value="">選択してください</option>
        <option v-for="genre in subGenres" :key="genre">{{ genre }}</option>
      </select>
    </div>
    <div v-else>
      <p>ジャンルを取得中...</p>
    </div>

    <div v-if="selectedGenre">
      <h2>「{{ selectedGenre }}」のおすすめ店舗</h2>
      <ul>
        <li v-for="shop in shops" :key="shop.id" v-if="shop.sub_genre?.name === selectedGenre">
          <strong>{{ shop.name }}</strong><br />
          {{ shop.address }}<br />
          <a :href="shop.urls.pc" target="_blank">詳細を見る</a>
        </li>
      </ul>
    </div>
  </div>
</template> -->

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const title = ref('ジャンル別おすすめのお店')
const db = ref([]) // Firestoreの全データ
const genres = ref([]) // プルダウン用ジャンル一覧
const selectedGenre = ref('') // 選択中のジャンル（プルダウン）
const confirmedGenre = ref('') // 「決定」ボタンで確定したジャンル

// Firestore設定
const projectId = 'vue-cooking-648fe'
const collectionId = 'suggest'
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionId}`

// データ取得
const getData = async () => {
  try {
    const res = await axios.get(baseUrl)
    const docs = res.data.documents || []

    db.value = docs

    // ジャンル一覧（重複なし）
    const genreList = docs.map(doc => doc.fields.genre?.stringValue).filter(Boolean)
    genres.value = [...new Set(genreList)] // 重複削除
  } catch (err) {
    console.error('データ取得エラー:', err)
  }
}

// 「決定」ボタンを押したとき
const confirmSelection = () => {
  confirmedGenre.value = selectedGenre.value
}

onMounted(getData)
</script>

<template>
  <div>
    <h1>{{ title }}</h1>

    <!-- プルダウンと決定ボタン -->
    <div v-if="genres.length">
      <label for="genre-select">ジャンルを選択：</label>
      <select v-model="selectedGenre" id="genre-select">
        <option disabled value="">選択してください</option>
        <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
      </select>
      <button @click="confirmSelection" :disabled="!selectedGenre">決定</button>
    </div>
    <p v-else>ジャンルを読み込み中...</p>

    <!-- 選択されたジャンルに対応する店舗情報を表示 -->
    <div v-if="confirmedGenre">
      <h2>「{{ confirmedGenre }}」のおすすめ店舗</h2>
      <ul>
        <li
          v-for="doc in db"
          :key="doc.name"
          v-if="doc.fields.genre?.stringValue === confirmedGenre"
        >
          <strong>店名：</strong>{{ doc.fields.shop?.stringValue }}<br />
          <strong>おすすめメニュー：</strong>{{ doc.fields.menu?.stringValue }}<br />
        </li>
      </ul>
    </div>
  </div>
</template>