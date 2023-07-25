<script>
import Sidebar from "../../components/Sidebar.vue";
import { initFlowbite } from "flowbite";
export default {
  data() {
    return {
      User_responses: [], //Va contenir les informations de la requête
      page: 1, //La page actuelle
      totalPage: "", //Le nombre total de pagees
      responses: "",
      hideLoader: false,
    };
  },
  watch: {
    //J'utilise un watcher pour regarder la valeur de l'objet page. S'il change de valeur, j'appelle la fonctiion getUserResponses
    page() {
      this.getUserResponses();
    },
  },
  methods: {
    //Fonction pour récupérer les réponses des utilisateurs
    async getUserResponses() {
      var link = `${this.url}user/responses/${this.page}`;
      var res = await (
        await fetch(link, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();

      if (res.status == "Done") {
        this.User_responses = res.data; //je récupère les données
        var data = Object.values(this.User_responses); //Je transforme User_response en tableau d'objets
        this.responses = data; //je stocke le tableau d'objets dans l'objet responses
        this.totalPage = this.User_responses.totalPage; //je récupère le nombre de pages au totale
      }
    },

    //loader

    loader() {
      setTimeout(() => {
        this.hideLoader = !this.hideLoader; //hide loader sera sur true après 1 sec
      }, 1000);
    },
  },

  components: {
    Sidebar,
  },

  mounted() {
    this.getUserResponses();
    this.loader();
    initFlowbite(); // sert à initialiser les composants de flowbite
  },
};
</script>

<template>
  <!--loader de la page-->
  <transition name="fade">
    <div v-if="!hideLoader" class="loader">
      <div class="spinner"></div>
      <div class="loader-text">Chargement en cours...</div>
    </div>
  </transition>

  <Sidebar></Sidebar>

  <div class="p-4 sm:ml-64">
    <div
      class="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700"
    >
      <!--Header de la page-->
      <div class="page-title p-5">
        <h1 class="mb-4 mt-4 text-5xl page-title-h1 font-bold text-black">
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r to-purple from-[#8E2DE2]"
            >Réponses</span>
          des utilisateurs
        </h1>
      </div>

      <!--Tableau des réponses-->
      <div class="relative overflow-x-auto sm:rounded-lg my-12">
        <table
          class="w-full my-12 rounded-full text-sm text-left text-white"
          v-for="(response, index) in responses"
          :key="index"
        >
          <thead class="text-xs bg-gray-700">
            <tr>
              <th scope="col" class="px-6 text-[16px] py-3">Question n°</th>
              <th scope="col" class="px-6 text-[16px] py-3">
                Titre de la question
              </th>
              <th scope="col" class="px-6 text-[16px] py-3">Réponse</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="bg-gray_black border-b dark:border-gray-700"
              v-for="(r, index) in response"
              :key="index"
            >
              <td class="px-6 py-4 text-[18px]">
                {{ r.question_id }}
              </td>
              <td class="px-6 py-4 text-[18px]">
                {{ r.question }}
              </td>
              <td class="px-6 py-4 text-[18px]">
                {{ r.user_response }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

         <!--Vue Awesome paginate-->
            <div class="flex justify-center bg-transparent items-center">
                <vue-awesome-paginate
                :current-page="page"
                :total-items="totalPage*10"
                :max-pages-shown="5"
                v-model="page"
                />
            </div>


    </div>
  </div>
</template>

<style>
/*style de la pagination*/
.pagination-container {
  display: flex;
  column-gap: 10px;
}
.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.paginate-buttons:hover {
  background-color: #d8d8d8;
}
.active-page {
  background-color: #451bde;
  border: 1px solid #451bde;
  color: white;
}
.active-page:hover {
  background-color: #451bde;
}

@media (max-width: 768px) {
    .page-title span,.page-title-h1{
    font-size: 25px;
  }
}
</style>
