<script>
export default {
  data() {
        return{
            showModal:false,

        }
  },

  methods:{
    //Permet d'afficher ma fenêtre modale
     displayModal(){
        setTimeout(() => {
            this.showModal = true
        }, 500);
     },

     //Fonction permettant de générer le token du sondé

     async generateToken(){
        var link = `${this.url}generate_token`;
        var res = await(await fetch(link,{
                method:"get",
                headers:{
                    'Content-Type': "application/json"
                },
            })).json();
            if(res.status=="Done"){
               sessionStorage.setItem('user_token',res.token); //je stocke le token de l'utilisateur dans la session du navigateur
    
              const modalContainer = document.querySelector(".modal-container");//je me connecte au container du modal via le DOM
              modalContainer.classList.add("animate__animated", "animate__fadeOut"); //j'ajoute les classes de animate css pour créer un fade out

              // Une fois que l'animation est terminée,je définis showModal sur false.
              setTimeout(() => {
                this.showModal = false;
              }, 900); 
          }
     }
  },

  computed:{

  },

   mounted: function () {
    this.displayModal();
  },
};
</script>

<template>
  <!--Navbar-->
  <div class="navbar bg-transparent">
    <a href="/">
      <img
        src="src/assets/images/bigscreen_logo.png"
        class="w-[160px] h-auto ml-4"
        alt="logo bigscreen"
      />
    </a>
  </div>
  <!--Modal de bienvenue-->
  <div v-if="showModal" class="modal-container fixed inset-0 flex items-center justify-center animate__animated animate__fadeIn" >
        <div class="my-modal w-[400px] h-[200px] bg-white rounded-[8px] p-3 flex flex-col justify-between">
        <h2 class="text-[22px] font-semibold  text-center text-purple">Bienvenue sur notre sondage !</h2>
        <p class="text-center text-[18px]">Pour commencer, veuillez cliquer sur le bouton ci-dessous</p>
        <button @click="generateToken" class="btn bg-black hover:bg-purple text-white transition ease-in duration-100">Commencer le sondage</button>    
  </div>
  </div>
  
</template>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  /* background-image: url('src/assets/images/papyrus-dark.png');
        background-size:40%;
        background-position: center center; */
  background-color: #000000;
}
</style>
