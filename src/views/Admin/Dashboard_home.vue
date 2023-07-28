<script>
import Sidebar from "../../components/Sidebar.vue";
import Chart from "chart.js/auto";
import { initFlowbite } from "flowbite";
export default {
  data() {
    return {
      responses_6: [], //récupérera le nombre de réponses de la question 6
      responses_7: [], //récupérera le nombre de réponses de la question 7
      responses_8: [], //récupérera le nombre de réponses de la question 8
      responses_Quality: [], //Récupère le taux des réponses des questions 11 à 15
      hideLoader: false,
    };
  },
  components: {
    Sidebar,
  },
  methods: {
    //Fonction qui va récupérer le nombre de propositions données à des questions spécifiques

    async getResponseCount() {
      var link = `${this.url}count/responses`;
      var res = await (
        await fetch(link, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      if (res.status == "Done") {
        this.responses_6 = res.question_6;
        this.responses_7 = res.question_7;
        this.responses_8 = res.question_8;
        this.responses_Quality = res.question_quality;
        this.hideLoader = !this.hideLoader;
        //j'appelle mes fonctions qui vont afficher les charts
        this.firstChart();
        this.secondChart();
        this.thirdChart();
        this.fourthChart();
      }
    },

    //Données pour le chart
    // id_canva (type: string) : L'ID du canvas HTML où le graphique sera affiché.
    // labels (type: Array) : Les étiquettes des données à afficher sur le graphique.
    // dataNumber (type: Array) : Les données numériques à afficher sur le graphique.
    // colors (type: Array) : Les couleurs des éléments du graphique.
    // type (type: string) : Le type de graphique à créer.


    chartData(id_canva, labels, dataNumber, colors, type) {
      //Les éléments pour créer mon chart seront différents en fonction du type du chart

      if (type === "pie") {
        
        const ctx = document.getElementById(id_canva);
        const data = {
          labels: labels,
          datasets: [
            {
              label: "Nombre de personnes",
              data: dataNumber,
              backgroundColor: colors,
              hoverOffset: 4,
            },
          ],
        };
        const myChart = new Chart(ctx, {
          type: type,
          data: data,
        });
      } else if (type === "radar") {
        const ctx = document.getElementById(id_canva);
        const data = {
          labels: labels,
          datasets: [
            {
              label: "Taux",
              data: dataNumber,
              fill: true,
              backgroundColor: colors,
              borderColor: "rgb(255, 99, 132)",
              pointBackgroundColor: "rgb(255, 99, 132)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(255, 99, 132)",
            },
          ],
        };
        const myChart = new Chart(ctx, {
          type: type,
          data: data,
        });
      }
    },

    //Fonction qui va contenir les données du 1er diagramme

    firstChart() {
      var id = "firstChart";
      var labels = [
        "Oculus Quest",
        "Oculus Rift/s",
        "HTC Vive",
        "Windows Mixed Reality",
        "Valve index",
      ];
      var data = [];
      var colors = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(174, 41, 245)",
        "rgb(32, 239, 45 )",
      ];
      var type = "pie";

      var question6Data = this.responses_6;

      // Je récupère les valeurs des réponses pour chaque label
      var data = labels.map((label) => question6Data[label] || 0);

      this.chartData(id, labels, data, colors, type); //J'appelle la fonction chartData et je retourne toutes les informations en paramètre
    },

    //Fonction qui va contenir les données du 2eme diagramme

    secondChart() {
      var id = "secondChart";
      var labels = ["SteamVR", "Oculus Store", "Viveport", "Windows store"];
      var data = [];
      var colors = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(174, 41, 245)",
      ];
      var type = "pie";

      var question7Data = this.responses_7;

      // Je récupère les valeurs des réponses pour chaque label
      var data = labels.map((label) => question7Data[label] || 0);

      this.chartData(id, labels, data, colors, type); //J'appelle la fonction chartData et je retourne toutes les informations en paramètre
    },

    //Fonction qui va contenir les données du 3eme diagramme

    thirdChart() {
      var id = "thirdChart";
      var labels = [
        "Oculus Quest",
        "Oculus Go",
        "HTC Vive Pro",
        "PSVR",
        "Autre",
        "Aucun",
      ];
      var data = [];
      var colors = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(174, 41, 245)",
        "rgb(32, 217, 239)",
        "rgb(32, 79, 239)",
      ];
      var type = "pie";

      var question8Data = this.responses_8;

      // Je récupère les valeurs des réponses pour chaque label
      var data = labels.map((label) => question8Data[label] || 0);

      this.chartData(id, labels, data, colors, type); //J'appelle la fonction chartData et je retourne toutes les informations en paramètre
    },

    //Fonction qui va contenir les données du 4eme diagramme
    fourthChart() {
      var id = "fourthChart";
      var labels = [
        "Qualité de l'image",
        "Confort d'utilisation",
        "Connexion réseau",
        "Qualité des graphismes 3D",
        "Qualité Audio",
      ];
      var data = [];
      var colors = ["rgba(255, 99, 132, 0.2)"];
      var type = "radar";

      var questions = [
        "question_11",
        "question_12",
        "question_13",
        "question_14",
        "question_15",
      ];
      var questionQuality = this.responses_Quality;
      var data = questions.map((element) => questionQuality[element]);

      console.log(data);

      // Je récupère les valeurs des réponses pour chaque label

      this.chartData(id, labels, data, colors, type); //J'appelle la fonction chartData et je retourne toutes les informations en paramètre
    },
  },
  mounted() {
    this.getResponseCount();
    initFlowbite();
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
    <div class="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
      <!--Header de la page-->
      <div class="page-title p-5">
        <h1 class="mb-4 mt-4 text-5xl font-bold page-title-h1 text-black">
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r to-purple from-[#8E2DE2]"
            >Statistiques</span
          >
          du sondage
        </h1>
      </div>

      <!--Chart Js-->

      <!--Container de la première ligne-->
      <div class="test w-full h-full flex flex-col justify-center items-center">
        <div
          class="first-column-wrapper w-[80%] justify-center items-center h-[100%] flex my-12"
        >
          <div class="w-1/2 h-full mx-8 flex flex-col justify-center items-center">
            <div class="title">
              <h1 class="text-[25px] my-4 font-semibold">
                statistiques de la <span class="text-purple">question 6</span>
              </h1>
            </div>
            <canvas id="firstChart" width="400" height="300"></canvas>
          </div>
          <div class="w-1/2 h-full flex mx-8  justify-center items-center flex-col">
            <div class="title">
              <h1 class="text-[25px] my-4 font-semibold">
                statistiques de la<span class="text-purple"> question 7</span>
              </h1>
            </div>
            <canvas id="secondChart" width="400" height="300"></canvas>
          </div>
        </div>

        <!--Container de la seconde ligne-->

        <div class="second-column-wrapper  w-[80%] justify-center items-center h-[100%] my-[10%] flex">
          <div class="w-1/2 h-full mx-8  flex justify-center items-center flex-col">
            <div class="title">
              <h1 class="text-[25px] font-semibold my-4">
                statistiques de la<span class="text-purple"> question 8</span>
              </h1>
            </div>
            <canvas id="thirdChart" width="400" height="300"></canvas>
          </div>
          <div class="w-1/2 h-full mx-8  flex justify-center items-center flex-col">
            <div class="title">
              <h1 class="text-[22px] font-semibold my-4">
                statistiques des<span class="text-purple">
                  questions 11 à 15</span
                >
              </h1>
            </div>
            <canvas id="fourthChart" width="400" height="300"></canvas>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style>


@media (max-width: 992px) {
  .first-column-wrapper,
  .second-column-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    width: 700px;
    overflow: hidden;

  }

  .title h1 {
    font-size: 22px;
  }
}

@media (max-width: 768px) {
  .first-column-wrapper,
  .second-column-wrapper {
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    width: 600px;
    overflow: hidden;
  }

  .page-title span,.page-title-h1{
    font-size: 25px;
  }
}
  .title h1 {
    font-size: 22px;
  }

</style>
