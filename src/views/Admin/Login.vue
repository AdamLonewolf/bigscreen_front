<script>
export default {
    data(){
        return{
            email:"",
            password:"",
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
                this.alertMsg = res.message; //j'envoie le message de succès
                this.showSucces = true;
                setTimeout(() => {
                 window.location.href = "/administration";
                }, 1000); // Une fois l'alerte affichée, l'admin est dirigé sur le dashboard la seconde qui suit.
            } else {
                this.alertMsg = res.message; //j'envoie le message d'erreur
                this.showError = true
                setTimeout(() => {
                    this.isLoading = false; //S'il y'a une erreur, le bouton de chargement ne s'affiche plus après 0.5 secondes
                }, 500);
            }
        }
    }
}
</script>

<template>
  
     <!-- Alerte en cas de succès -->
        <div v-if="showSucces" class="alert bg-success  text-white text-xl w-1/2 m-auto border-none mt-4 animate__animated animate__fadeInDown">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{alertMsg}}</span>
        </div>
        <!-- Alerte en cas d'erreur -->
        <div v-if="showError" class="alert bg-danger text-white text-xl w-1/2 m-auto border-none mt-10 animate__animated animate__fadeInDown">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{alertMsg}}</span>
        </div>

<div class="flex items-center justify-center h-screen">
    <form  class="bg-white w-[400px] h-[450px] rounded-[20px] px-[30px] py-[15px]" @submit.prevent="submit">
        <div class="logo">
         <img src="src/assets/images/bigscreen_black.png" class="w-[120px] h-auto" alt="logo bigscreen">   
        </div>
        <div class="form-text font-bold text-[26px] mb-6  text-purple">
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
        background-image: url('src/assets/images/papyrus-dark.png');
        background-size:40%;
        background-position: center center;
    }
</style>