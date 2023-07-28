<script>
export default {
    data(){
        return{
            email:"",
            password:"",
            hideloader: false, //permettra de cacher mon loader
            showSucces: false, //affichage de l'alerte en cas de succès
            showError:false, //affichage de l'alerte en cas d'erreur
            alertMsg: '', //message en fonction de l'alerte
            isLoading: false, //Gère l'état du bouton de chargement (affiché/pas affiché)
        }
    },
    methods:{
        //Fonction pour soumettre les données du formulaire 
        async submit(){
            this.isLoading = true; //J'affiche le bouton de chargement
            var link = `${this.url}login`

            //Ici, si l''email est vide ainsi que le mot de passe ou si l'email ne contient pas d'@, alors il sort de la fonction.

            if (!this.email || !this.email.includes('@') || !this.password) {
                this.showError = true;
                setTimeout(() => {
                    this.showError = false;
                }, 2500);
                return; // Arrêter ici si l'e-mail ou le mot de passe ne sont pas valides
            }


            var res = await(await fetch(link,{
                method:"post",
                headers:{
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    //On envoie les données sous format json
                    "email": this.email,
                    "password":this.password,
                })
            })).json();

            

            if(res.status == "Done"){
                sessionStorage.setItem('admin_token',res.token); //On stocke le token de l'admin dans la session du navigateur
                sessionStorage.setItem('admin_id',res.user.id) //Je récupère l'id de l'admin
                
                this.alertMsg = res.message; //j'envoie le message de succès
                this.showSucces = true;
                setTimeout(() => {
                 window.location.href = "/administration";
                }, 1000); // Une fois l'alerte affichée, l'admin est dirigé sur le dashboard la seconde qui suit.
            } else {
                this.alertMsg = res.message; //j'envoie le message d'erreur
                this.showError = true
                this.isLoading = false
                setTimeout(() => {
                    this.showError = false
                }, 2500);
            }
        },
    


        loader(){
            setTimeout(() => {
                this.hideloader = !this.hideloader //hide loader sera sur true après 1 sec
            },1000)
        }
    },

    mounted(){
        this.loader();
    }
}
</script>

<template>

    <!--loader de la page-->
    <transition name="fade">
        <div v-if="!hideloader" class="loader">
            <div class="spinner"></div>
            <div class="loader-text">Chargement en cours...</div>
        </div>
    </transition>
  
    <!-- Alerte en cas de succès -->
     
    <div class="alert-wrapper flex justify-center">
        <div id="alert-3" v-if="showSucces" class=" absolute flex my-5 justify-center items-center p-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Info</span>
            <div class="ml-3 text-sm font-medium">
                {{alertMsg}}
            </div>
        </div>
    </div>

    <!-- Alerte en cas d'erreur --> 
    
    <div class="alert-wrapper flex justify-center">
        <transition name="fade">
         <div id="alert-2" v-if="showError" class="absolute my-5 flex items-center p-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Info</span>
            <div class="ml-3 text-sm font-medium">
                {{alertMsg}} Veuillez vérifier vos identifiants.
            </div>
        </div>
         </transition>
    </div>
   
       



        <div class="flex items-center justify-center h-screen">
            <form  class="bg-white xl:w-[400px] xl:h-[450px] lg:w-[400px] lg:h-[450px]xl:bg-green-400 sm:h-[450px] sm:w-[400px] min-[320px]:w-[350px] rounded-[20px] px-[30px] py-[15px]" @submit.prevent="submit">
                <div class="logo">
                <img src="/assets/images/bigscreen_black.png" class="w-[120px] h-auto" alt="logo bigscreen">   
                </div>
                <div class="form-text font-bold text-[26px] min-[320px]:text-[22px] mb-6  text-purple">
                    Connexion au dashboard
                </div>
                <div class="form-group">
                    <div class="input-one flex flex-col">
                        <label for="email" class="font-semibold mb-2">Email</label>
                        <div class="relative">
                            <i class="fa-solid fa-envelope absolute top-1/2 left-3 transform -translate-y-1/2"></i>
                            <input type="email" id="email" name="email" placeholder="Rentrez votre email..." v-model="email" class="input input-bordered w-full  focus:outline-none focus:border-purple focus:border-2 pl-10" required/>
                        </div>
                        
                    </div>
                    <div class="input-two flex flex-col">
                        <label for="password" id="password" name="password" class="font-semibold mb-2 mt-2">Mot de passe</label>
                        <div class="relative">
                        <i class="fa-solid fa-lock absolute top-1/2 left-3 transform -translate-y-1/2"></i>
                        <input type="password" v-model="password" placeholder="Rentrez votre mot de passe..." class="input input-bordered w-full focus:outline-none focus:border-purple focus:border-2 pl-10"/>
                        </div>
                    
                    </div>
                </div>
                <div class="btn-submit my-5">
                <button v-if="isLoading" class="btn text-white w-full bg-purple">
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <p>Veuillez patienter...</p>
                </button>
                <button v-else type="submit" class="btn bg-black text-white w-full transition ease-in duration-300 hover:bg-purple">Se connecter</button>
                </div>
            </form>
        </div>
  

        

</template>

<style>
    body{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        background-image: url('/assets/images/papyrus-dark.png');
        background-size:40%;
        background-position: center center;
    }
</style>