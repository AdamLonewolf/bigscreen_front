<script>
import Question from '../components/Questions.vue';


export default {
  data() {
        return{
            showModal:false,
            showQuestion:false,
            hideLoader: false,
            userToken: ""
        }
  },
   
  methods:{

    //Fonction permettant d'afficher ma fenêtre modale (de bienvenue)

     displayModal(){
        setTimeout(() => {
            this.showModal = true
        }, 500);
     },

      //loader

         loader(){
            setTimeout(() => {
                this.hideLoader = !this.hideLoader //hide loader sera sur true après 1 sec
            },1000)
        },

     //Fonction permettant de générer le token du sondé et de le stocker dans la session du navigateur

     async generateToken(){
        var link = `${this.url}generate_token`;
        var res = await(await fetch(link,{
                method:"get",
                headers:{
                    'Content-Type': "application/json"
                },
            })).json();
            if(res.status=="Done"){
              this.userToken = res.token //Je stocke le token dans une variable
              sessionStorage.setItem('user_token', res.token) //j'enregistre le token dans la session du navigateur
              const modalContainer = document.querySelector(".modal-container");//je me connecte au container du modal via le DOM
              modalContainer.classList.add("animate__animated", "animate__fadeOutDown"); //j'ajoute les classes de animate css pour créer un fade out

              // Une fois que l'animation est terminée,je définis showModal sur false.
              setTimeout(() => {
                this.showModal = false;
                  setTimeout(()=>{
                    this.showQuestion = true
                  },500)
              }, 900); 
          }
     }
  },
  components:{
    Question, //j'importe le composant question
  },
  computed:{

  },

   mounted: function () {
    this.displayModal();
    this.loader();
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

  <!--Navbar-->
  <div class="navbar bg-transparent ">
    <a href="/" class="z-50">
      <img
        src="public/assets/images/bigscreen_logo.png"
        class="w-[160px] h-auto ml-4"
        alt="logo bigscreen"
      />
    </a>
  </div>
  <!--Le composant Question-->

<Question :display="showQuestion" :token="userToken"></Question>


  <!--Modal de bienvenue-->
  <div v-if="showModal" class="modal-container z-10 fixed inset-0 flex items-center justify-center animate__animated animate__fadeInUp" >
        <div class="my-modal xl:w-[500px] xl:h-[300px] lg:w-[500px] lg:h-[300px] md:w-[500px] md:h-[300px] sm:w-[500px] min-[320px]:w-[350px] min-[320px]:h-[350px] sm:h-[200px] bg-white rounded-[8px] p-3 flex flex-col justify-between">
          <h2 class="text-[22px] font-semibold  text-center text-purple">Bienvenue sur notre sondage !</h2>
          <p class="text-center xl:text-[18px] lg:text-[18px] md:text-[18px] sm-[18px] min-[320px]:text-[17px]">Participez à notre enquête et partagez votre expérience avec nous. Vos réponses nous aideront à adapter notre application VR pour vous offrir une immersion exceptionnelle. Cliquez ci-dessous pour démarrer.</p>
          <button @click="generateToken" class="btn bg-black hover:bg-purple text-white transition ease-in duration-100">Commencer le sondage</button>    
        </div>
  </div>
  
</template>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background-color: #000000;
}

</style>
