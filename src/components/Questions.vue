<script>
export default {
    data(){
        return {
             index: 0, //Compteur
             questions:[], //Tableau qui va stocker toutes les questions
             width:'', //élément pour le style
             selectedOption: '', //Vmodel pour les propositions
             type_b: '', //Vmodel pour les input de type B
             type_c: '', //Vmodel pour les input de type C
             userEmail: '', //vmodel de l'input type email
             responses: [],
             showLinkModal:false, //Modal qui va afficher le lien de redirection à la fin du sondage.
             token: sessionStorage.getItem('user_token'), //objet qui va stocker le token de l'utilisateur
        }
    },
    methods:{

        //Fonction qui va servir à retourner la liste des questions
        async getQuestions(){
             var link = `${this.url}questions`;
             var res = await(await fetch(link,{
                method:"get",
                headers:{
                    'Content-Type': "application/json"
                },
            })).json();

            if(res.status == 'Done'){
                this.questions = res.data //On récupère les informations de l'objet data de ma réponse json
            }
        },

    // Fonction pour obtenir la question actuelle en fonction de l'index
        getCurrentQuestion() {
            //Si l'index est supérieur à 0 et inférieur à la taille du tableau, alors il retourne la question actuelle
        if (this.index >= 0 && this.index < this.questions.length) {
            return this.questions[this.index];
        } else {
            // Sinon, toutes les questions ont été traitées
            return this.showLinkModal = true
        }
        },

    //Foncter qui va affecter une valeur à selectOption

   updateSelectedOption(option) {
      this.selectedOption = option; //selected option va récupérer le libellé de la proposition selectionnée
      this.saveResponses(); //j'appelle nextQuestion
    },

    //Je crée une méthode qui va sauvegarder les réponses de l'utilisateur jusqu'à la fin du sondage
       saveResponses() {
        var currentQuestion = this.getCurrentQuestion(); //je récupère les infos de la question actuelle
        var token = sessionStorage.getItem('user_token');
        var response = {
            email: '',
            question_id: currentQuestion.id,
            user_response: '',
            user_token: token,
        };
        console.log(response);
        
    if (currentQuestion.id === 1) {
      response.email = this.userEmail; //On enregistre l'email dans l'objet email
      response.user_response = this.userEmail; // Quand la question est a pour id 1, on enregistre l'email de l'utilisateur comme réponse
    } else {
      // En fonction du type de la question, j'enregistre la réponse du sondé dans l'objet response
      if (currentQuestion.type === "A") {
        response.user_response = this.selectedOption;
        response.email = this.userEmail;
      } else if (currentQuestion.type === "B") {
        response.user_response = this.type_b;
        response.email = this.userEmail;
        this.type_b = "";
      } else if (currentQuestion.type === "C") {
        response.user_response = this.type_c;
        response.email = this.userEmail;
        this.type_c = "";
      }
    }

        // Je push l'objet response dans le tableau responses 
        this.responses.push(response);
        
        // j'incrémente l'index pour passer à la question suivante
        this.index++;

        // Vérifier si c'est la dernière question
        if (this.index > this.questions.length - 1) {
            // Si c'est la dernière question, soumettre les réponses à la base de données
            this.submitResponses();
        }
    },

        //Fonction pour enregistrer les réponses de l'utilisateur dans la base de données

        async submitResponses(){
            var link = `${this.url}submit_responses`
            var res = await(await fetch(link,{
                method:"post",
                headers:{
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({"responses": this.responses }) //On envoie le tableau responses sous format json
            })).json();

            if(res.status == 'Done'){
                console.log(res)
            } else {
                alert(res.message)
            }
        },

    //Fonction pour passer à la question suivante


    },
    computed:{
        //On cherche à calculer la valeur de la barre de progression (en %)
        //On fait l'index de la question/la taille du tableau qui contient les questions - 1 * 100
        progress(){
        return (this.index/this.questions.length)*100; 
      }
    },
    mounted: function () {
    this.getQuestions();
  },
}
</script>

<template>

<div class="questions-container fixed inset-0 flex items-center justify-center rounded-[12px]">
    <div class="survey-questions bg-white w-[1200px] h-[620px] relative rounded-[12px] p-4">
        <!-- Barre de progression -->
        <div class="w-full h-4 mb-4 bg-gray-500 rounded-full">
            <div class="h-4 bg-purple rounded-full" :style="{ width: progress + '%' }"></div>
        </div>
        <!--la question -->
        <!--Si la taille du tableau questions est supérieure à 0, j'affiche les différentes questions -->
        <div v-if="questions.length > 0" class="question flex flex-col justify-center">
            <div class="question-header">
                <h4 class="text-purple question-indicator uppercase text-[14px] tracking-widest font-bold text-center mt-[60px] ">Question {{ index + 1 }}/{{ questions.length }}</h4>
                <p class="text-black font-bold text-[40px] my-9 text-center">{{getCurrentQuestion().title}}</p>
            </div>
            <div class="question-body">
                <!--La façon de répondre dépendra du type de la question-->

                <!--Type A-->
                <div class="body-type-A flex flex-col justify-center items-center" v-if="getCurrentQuestion().type === 'A' ">
                    <div class="option-container w-[50%]">
                        <!--Quand je clique sur l'une des divs, je récupère la valeur du bouton radio contenu dans la div cliquée-->
                         <div v-for="(option, optionIndex) in getCurrentQuestion().option" :key="option.id" class="flex items-center space-x-4 cursor-pointer my-2 bg-gray_black rounded-[10px] hover:bg-purple transition ease-in duration-150 w-full p-2 " @click="updateSelectedOption(option.option_label)">
                            <input type="radio" name="option" :id="'option_' + option.id" class="form-radio text-purple h-5 w-5 hidden" :value="option.option_label" v-model="selectedOption">
                            <p class="text-white font-medium text-lg">{{optionIndex + 1}}.</p>
                            <p :id="'option_' + option.id" class="text-white font-medium">{{ option.option_label }}</p>
                        </div>
                    </div>    
                </div>
                <!--Type B-->
                <div class="body-type-B" v-if="getCurrentQuestion().type === 'B'">
                    <!--Validation de l'email (Pour la première question uniquement-->
                    <div v-if="getCurrentQuestion().id == 1" class="flex items-center justify-center my-[40px]">
                         <input v-model="userEmail" type="email" id="email" name="email" placeholder="Entrez votre adresse email" class="rounded-lg p-2.5 bg-gray_black text-white text-sm block w-[35%]" required>
                    </div>
                    <!--Formulaire pour les questions de type B-->
                    <div v-else class="flex items-center justify-center my-[40px]">
                        <input type="text" id="response" name="response" class="border text-white text-sm rounded-lg  block w-[35%] p-2.5 bg-gray_black " v-model="type_b" placeholder="votre réponse..." required>
                    </div>
                    <div class="btn-next flex items-center justify-center">
                         <button @click="saveResponses" class="btn bg-black text-white w-[15%] transition ease-in duration-300 hover:bg-purple rounded-full tracking-widest hover:-translate-y-[6px]">Suivant <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
                <!--Type C-->
                <div class="body-type-c" v-if="getCurrentQuestion().type === 'C'">
                    <div class="flex items-center justify-center my-[40px]">
                        <input type="number" id="number" v-model="type_c" class="border text-white text-sm rounded-lg  block w-[35%] p-2.5 bg-gray_black" required>
                    </div>
                    <div class="btn-next flex items-center justify-center">
                         <button @click="saveResponses" class="btn bg-black text-white w-[15%] transition ease-in duration-300 hover:bg-purple rounded-full tracking-widest hover:-translate-y-[6px]">Suivant <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!--Modal pour rediriger sur la page des réponses-->
  <div v-if="showLinkModal" class="modal-container fixed inset-0 flex items-center justify-center" >
    <!-- Overlay sombre -->
      <div class="fixed inset-0 bg-black opacity-60 w-full h-full"></div>
        <div class="my-modal w-[600px] h-[320px]  z-[10000] animate__animated animate__fadeInUp bg-white rounded-[8px] p-5 flex flex-col">
            <h2 class="text-[22px] font-semibold  text-center text-purple">Merci d'avoir participé à ce sondage !</h2>
            <p class="text-center font-semibold text-[18px] my-5">Toute l'équipe de Bigscreen vous remercie pour votre engagement. Grâce à votre investissement, nous vous préparons une application toujours plus facile à utiliser, seul ou en famille. Si vous désirez consulter vos réponses ultérieurement, vous pouvez consultez cette adresse:</p> 
            <router-link :to="`/`"><p class="text-center text-[16px] text-black font-medium hover:text-purple transition ease-in duration-200 break-words">http://localhost:5173/{{token}}</p></router-link> 
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