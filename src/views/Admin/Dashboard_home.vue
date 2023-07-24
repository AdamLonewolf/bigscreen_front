<script>
import Sidebar from '../../components/Sidebar.vue';
import Chart from 'chart.js/auto';

export default {
    data(){
        return{
            responses_6:[], //récupérera le nombre de réponses de la question 6
            responses_7:[], //récupérera le nombre de réponses de la question 7
            responses_8:[], //récupérera le nombre de réponses de la question 8
            responses_Quality:[], //Récupère le taux des réponses des questions 11 à 15
            hideLoader: false,
        }
    },
    components: {
      Sidebar
    },
    methods:{

        //Fonction qui va récupérer le nombre de propositions données à des questions spécifiques

        async getResponseCount(){
             var link = `${this.url}count/responses`;
        var res = await(await fetch(link,{
                method:"get",
                headers:{
                    'Content-Type': "application/json"
                },
            })).json();
            if(res.status == "Done"){
                this.responses_6 = res.question_6
                this.responses_7 = res.question_7
                this.responses_8 = res.question_8
                this.responses_Quality = res.question_quality
                this.hideLoader = !this.hideLoader
                //j'appelle mes fonctions qui vont afficher les charts
                this.firstChart();
                this.secondChart();
                this.thirdChart();
                this.fourthChart();
            }
        },


        //Données pour le chart
        //Id_canva = id du canvas; labels = éléments à afficher dans labels ; data = données à insérer dans data;colors = couleurs à mettre dans background colors, type = type du graphique

        chartData(id_canva,labels, dataNumber, colors, type){

            //Les éléments pour créer mon chart seront différents en fonction du type du chart

            if(type === "pie"){

            const ctx = document.getElementById(id_canva);
            const data = {
                 labels: labels,
                datasets: [{
                    label: 'Nombre',
                    data: dataNumber,
                    backgroundColor: colors,
                    hoverOffset: 4
                }]
            };
            const myChart =new Chart(ctx,{
                type: type,
                data: data,
                });

            } else if(type ==="radar") {

            const ctx = document.getElementById(id_canva);
            const data = {
                 labels: labels,
                datasets: [{
                    label: 'Taux',
                    data: dataNumber,
                    fill: true,
                    backgroundColor: colors,
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }]
            };
            const myChart =new Chart(ctx,{
                type: type,
                data: data,
                });
            }  

        },

        //Fonction qui va contenir les données du 1er diagramme

        firstChart(){

           var id = 'firstChart';
           var labels = ['Oculus Quest', 'Oculus Rift/s' , 'HTC Vive', 'Windows Mixed Reality', 'Valve index' ];
           var data = [];
           var colors = [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(174, 41, 245)',
            'rgb(32, 239, 45 )', 
            ]
          var type = 'pie'



             var question6Data = this.responses_6;

            // Je récupère les valeurs des réponses pour chaque label
            var data = labels.map(label => question6Data[label] || 0);

          this.chartData(id, labels, data, colors, type) //J'appelle la fonction chartData et je retourne toutes les informations en paramètre
           
        },

        //Fonction qui va contenir les données du 2eme diagramme

         secondChart(){

           var id = 'secondChart';
           var labels = ['SteamVR', 'Oculus Store' , 'Viveport', 'Windows store'];
           var data = [];
           var colors = [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(174, 41, 245)',
            ]
          var type = 'pie'

     

             var question7Data = this.responses_7;

            // Je récupère les valeurs des réponses pour chaque label
            var data = labels.map(label => question7Data[label] || 0);   


          this.chartData(id, labels, data, colors, type) //J'appelle la fonction chartData et je retourne toutes les informations en paramètre
           
        },


        //Fonction qui va contenir les données du 3eme diagramme

        thirdChart(){

           var id = 'thirdChart';
           var labels = ['Oculus Quest', 'Oculus Go' , 'HTC Vive Pro', 'PSVR', 'Autre', 'Aucun'];
           var data = [];
           var colors = [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(174, 41, 245)',
            'rgb(32, 217, 239)',
            'rgb(32, 79, 239)'
            ]
          var type = 'pie'


             var question8Data = this.responses_8;

            // Je récupère les valeurs des réponses pour chaque label
            var data = labels.map(label => question8Data[label] || 0);       


          this.chartData(id, labels, data, colors, type) //J'appelle la fonction chartData et je retourne toutes les informations en paramètre
           
        },

        //Fonction qui va contenir les données du 4eme diagramme
        fourthChart(){

           var id = 'fourthChart';
           var labels = ['Qualité de l\'image', 'Confort d\'utilisation' , 'Connexion réseau', 'Qualité des graphismes 3D', 'Qualité Audio' ];
           var data = [];
           var colors = [
            'rgba(255, 99, 132, 0.2)',
            ]
          var type = 'radar'


            var questions = ["question_11", "question_12", "question_13", "question_14", "question_15"]
             var questionQuality = this.responses_Quality
             var data = questions.map(element => questionQuality[element]);
            
            console.log(data);

            // Je récupère les valeurs des réponses pour chaque label
              


          this.chartData(id, labels, data, colors, type) //J'appelle la fonction chartData et je retourne toutes les informations en paramètre
           
        },

    },
   mounted() {
       this.getResponseCount()
  },
}



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

    <div class="p-4 sm:ml-64 h-[60vh]">
        <!--Header de la page-->
         <div class="page-title p-5">      
            <h1 class="mb-4 mt-4 text-5xl font-bold text-black"><span class="text-transparent bg-clip-text bg-gradient-to-r to-purple from-[#8E2DE2]">Statistiques</span> du sondage</h1>
        </div>

        <!--Chart Js-->

    <!--Container de la première ligne-->

    <div class="first-column-wrapper w-full h-[100%] flex my-12">
        <div class="w-1/2 h-full  flex flex-col justify-center items-center">
            <div class="title">
                <h1 class="text-[22px] my-4 font-semibold"> statistiques de la <span class="text-purple">question 6</span></h1>
            </div>
            <canvas id="firstChart" class="w-full h-full"></canvas>
        </div>
        <div class="w-1/2 h-full flex justify-center items-center flex-col">
            <div class="title">
                <h1 class="text-[22px] my-4 font-semibold"> statistiques de la<span class="text-purple"> question 7</span></h1>
            </div>
            <canvas id="secondChart" class="w-full h-full"></canvas>
        </div>
    </div>

    <!--Container de la seconde ligne-->

    <div class="second-column-wrapper w-full h-[100%] my-[10%] flex">
        <div class="w-1/2 h-full flex justify-center items-center flex-col">
             <div class="title">
                <h1 class="text-[22px] font-semibold my-4">statistiques de la<span class="text-purple"> question 8</span>
                </h1>
            </div>
            <canvas id="thirdChart" class="w-full h-full"></canvas>
        </div>
        <div class="w-1/2 h-full flex justify-center items-center flex-col">
            <div class="title">
                <h1 class="text-[22px] font-semibold my-4">statistiques des<span class="text-purple"> questions 11 à 15</span>
                </h1>
            </div>
            <canvas id="fourthChart" class="w-full h-full"></canvas>
        </div>
    </div>
       
    </div>

</template>

<style>

</style>