<script>
export default {
  data() {
    return {
      index: 0, //Compteur
      questions: [], //Tableau qui va stocker toutes les questions
      width: "", //élément pour le style
      selectedOption: "", //Vmodel pour les propositions
      type_b: "", //Vmodel pour les input de type B
      type_c: "", //Vmodel pour les input de type C
      userEmail: "", //vmodel de l'input type email
      responses: [],
      showLinkModal: false, //Modal qui va afficher le lien de redirection à la fin du sondage.
      emailError: false, //Montre le message d'erreur au niveau de l'input email
      inputTextError: false, //Montre le message d'erreur au niveau des inputs de type B
      inputNumberError2: false,
      inputNumberError: false, //Montre le message d'erreur au niveau des inputs de type c
      token: sessionStorage.getItem("user_token"), //objet qui va stocker le token de l'utilisateur
    };
  },
  props: {
    display: Boolean,
  },
  methods: {
    //Fonction qui va servir à retourner la liste des questions
    async getQuestions() {
      var link = `${this.url}questions`;
      var res = await (
        await fetch(link, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();

      if (res.status == "Done") {
        this.questions = res.data; //On récupère les informations de l'objet data de ma réponse json
      }
    },

    // Fonction pour obtenir la question actuelle en fonction de l'index

    getCurrentQuestion() {
      //Si l'index est supérieur à 0 et inférieur à la taille du tableau, alors il retourne la question actuelle

      if (this.index >= 0 && this.index < this.questions.length) {
        return this.questions[this.index];
      } else {
        // Si toutes les questions ont été affichées, je fais apparaître le modal de finalisation du sondage
        return (this.showLinkModal = true);
      }
    },

    //Foncter qui va affecter une valeur à selectOption

    updateSelectedOption(option) {
      this.selectedOption = option; //selected option va récupérer le libellé de la proposition selectionnée
      this.saveResponses(); //j'appelle nextQuestion
    },

    //Validation de l'email.

    emailValidation() {
      //Si l'utilisateur laisse le champ vide ou ne mets pas d'arobase et qu'il clique sur le bouton suivant, alors une erreur sera retournée

      if (this.getCurrentQuestion().id === 1) {
        if (!this.userEmail.trim() || !this.userEmail.includes("@")) {
          this.emailError = true;
          setTimeout(() => {
            this.emailError = false;
          }, 2000);
          return;
        } else {
          this.saveResponses();
        }
      }
    },

    //Vérification des inputs de type B

    inputTextVerification() {
      //Si le champ est vide, on ne passe pas à la question suivante.
      if (this.getCurrentQuestion().type === "B") {
        if (!this.type_b.trim()) {
          this.inputTextError = true;
          setTimeout(() => {
            this.inputTextError = false;
          }, 2000);
        } else {
          this.saveResponses();
        }
      }
    },

    //Vérification des inputs de type C

    inputNumberVerification() {
      var questionId = this.getCurrentQuestion().id;

      if (
        this.getCurrentQuestion().type === "C" &&
        questionId >= 11 &&
        questionId <= 15
      ) {
        var number = parseInt(this.type_c);
        // Si le vmodel (transformé en entier) est inférieur à 1 ou supérieur à 5, ou n'est pas un nombre ou encore est vide, alors on ne passe pas à la question suivante.
        if (isNaN(number) || number < 1 || number > 5 || this.type_c === "") {
          this.inputNumberError = true;
          setTimeout(() => {
            this.inputNumberError = false;
          }, 2000);
        } else {
          this.saveResponses();
        }
      } else {
        if (this.type_c === "") {
          this.inputNumberError2 = true;
          setTimeout(() => {
            this.inputNumberError2 = false;
          }, 2000);
        } else {
          this.saveResponses();
        }
      }
    },

    //Fonction qui va permettre de revenir à la question précédente

    previousQuestion() {
      //Je décrémente l'index
      this.index--;
    },

    // Fonction va mettre à jour ou ajouter une réponse en fonction de l'index de la question
    updateOrSaveResponse(response) {
      //On parcourt la table responses pour voir s'il y'a pas une reponse existante pour une question
      const existingResponseIndex = this.responses.findIndex(
        (r) => r.question_id === response.question_id
      );

      if (existingResponseIndex !== -1) {
        // Si une réponse existe déjà pour cette question, on la met à jour
        this.responses[existingResponseIndex] = response;
      } else {
        // Sinon, on ajoute la nouvelle réponse au tableau
        this.responses.push(response);
      }
    },

    //Je crée une méthode qui va sauvegarder les réponses de l'utilisateur jusqu'à la fin du sondage
    saveResponses() {
      var currentQuestion = this.getCurrentQuestion(); //je récupère les infos de la question actuelle
      var token = sessionStorage.getItem("user_token");
      var response = {
        email: "",
        question_id: currentQuestion.id,
        user_response: "",
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

      this.updateOrSaveResponse(response);

      // j'incrémente l'index pour passer à la question suivante
      this.index++;

      // Vérifier si c'est la dernière question
      if (this.index > this.questions.length - 1) {
        // Si c'est la dernière question, soumettre les réponses à la base de données
        this.submitResponses();
      }
    },

    //Fonction pour enregistrer les réponses de l'utilisateur dans la base de données

    async submitResponses() {
      var link = `${this.url}submit_responses`;
      var res = await (
        await fetch(link, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ responses: this.responses }), //On envoie le tableau responses sous format json
        })
      ).json();

      if (res.status == "Done") {
        console.log(res);
      }
    },

    //Fonction pour passer à la question suivante
  },
  computed: {
    //On cherche à calculer la valeur de la barre de progression (en %)
    //On fait l'index de la question/la taille du tableau qui contient les questions - 1 * 100
    progress() {
      return (this.index / this.questions.length) * 100;
    },
  },
  mounted: function () {
    this.getQuestions();
  },
};
</script>

<template>
  <div
    class="questions-container fixed inset-0 flex items-center justify-center rounded-[12px] "
  >
    <div
      v-if="display && !showLinkModal"
      class="animate__animated animate__fadeInUp survey-questions bg-white xl:w-[1200px] xl:h-[620px] lg:w-[980px] lg:h-[600px] lg:bg-white md:w-[750px] md:h-[500px] md:bg-transparent sm:bg-transparent sm:w-full min-[320px]:w-[100vw] min-[320px]:bg-transparent relative rounded-[12px] p-4  "
    >
      <!-- Barre de progression -->
      <div
        class="w-full h-4 mb-4 bg-gray-700 lg:rounded-full xl:rounded-full md:rounded-none sm:rounded-none min-[320px]:rounded-none min-[320px]:w-full"
      >
        <div
          class="h-4 lg:bg-purple xl:bg-purple md:bg-white  sm:bg-white lg:rounded-full xl:rounded-full md:rounded-none sm:rounded-none min-[320px]:bg-white min-[320px]:rounded-none"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
      <div
        v-if="this.index > 0"
        @click="previousQuestion"
        class="flex items-center relative top-3 font-semibold xl:text-black lg:text-black md:text-white sm:text-white min-[320px]:text-white cursor-pointer hover:text-purple transition ease-in duration-200 text-[19px] min-[320px]:text-center"
      >
        <i class="fa-solid fa-arrow-left"></i>
        <p class="mx-3">Précédent</p>
      </div>
      <!--la div des questions -->
      <!--Si la taille du tableau questions est supérieure à 0, j'affiche la div -->
      <div
        v-if="questions.length > 0"
        class="question flex flex-col justify-center"
      >
        <div class="question-header">
          <h4
            class="xl:text-purple lg:text-purple md:text-white min-[320px]:text-white sm:text-white question-indicator uppercase text-[14px] tracking-widest font-bold text-center mt-[60px]"
          >
            Question {{ index + 1 }}/{{ questions.length }}
          </h4>
          <p
            class="xl:text-black lg:text-black md:text-white min-[320px]:text-white sm:text-white font-bold lg:text-[40px] md:text-[40px] sm:text-[40px] min-[320px]:text-[22px] my-4 text-center"
          >
            {{ getCurrentQuestion().title }}
          </p>
        </div>
        <div class="question-body">
          <!--La façon de répondre dépendra du type de la question-->
          <!--Type A-->
          <div
            class="body-type-A flex flex-col  justify-center items-center"
            v-if="getCurrentQuestion().type === 'A'"
          >
            <div class="option-container md:w-[50%] lg:w-[50%] xl:w-[50%] min-[320px]:w-full">
              <!--Quand je clique sur l'une des divs, je récupère la valeur du bouton radio contenu dans la div cliquée-->
              <div
                v-for="(option, optionIndex) in getCurrentQuestion().option"
                :key="option.id"
                class="flex items-center space-x-4 cursor-pointer my-2 bg-gray_black rounded-[10px] hover:bg-purple min-[320px]:w-full transition ease-in duration-150 md:w-full lg:[w-full] xl:w-full p-2"
                @click="updateSelectedOption(option.option_label)"
              >
                <input
                  type="radio"
                  name="option"
                  :id="'option_' + option.id"
                  class="form-radio text-purple h-5 w-5 hidden"
                  :value="option.option_label"
                  v-model="selectedOption"
                />
                <p class="text-white font-medium text-lg">
                  {{ optionIndex + 1 }}.
                </p>
                <p :id="'option_' + option.id" class="text-white font-medium">
                  {{ option.option_label }}
                </p>
              </div>
            </div>
          </div>
          <!--Type B-->
          <div class="body-type-B" v-if="getCurrentQuestion().type === 'B'">
            <!--Validation de l'email (Pour la première question uniquement-->
            <div
              v-if="getCurrentQuestion().id == 1"
              class="flex flex-col items-center justify-center my-[40px]"
            >
              <input
                v-model="userEmail"
                type="email"
                id="email"
                name="email"
                placeholder="ex: adam@ifran.com"
                class="rounded-lg p-2.5 lg:bg-gray-500 xl:bg-gray-500 md:bg-gray-500 sm:bg-white min-[320px]:bg-white min-[320px]:w-[100%] xl:text-white lg:xl:text-white md:text-white sm:text-black text-sm block lg:w-[35%] xl:w-[35%] md:w-[55%] sm:w-[55%]"
                @keyup.enter="emailValidation"
                required
              />
              <transition name="fade">
                <span
                  v-if="emailError"
                  class="error_email float-left font-semibold text-danger my-2"
                >
                  veuillez rentrer un email valide.
                </span>
              </transition>
              <button
                @click="emailValidation"
                class="btn lg:bg-black md:bg-black xl:bg-black xl:text-white lg:xl:text-white md:text-white lg:w-[15%] md:w-[25%] sm:w-[25%] xl:w-[15%] sm:bg-white min-[320px]:bg-white min-[320px]:w-[55%] transition my-8 ease-in duration-300 hover:bg-purple rounded-full tracking-widest hover:-translate-y-[6px]"
              >
                Suivant <i class="fa-solid fa-arrow-right"></i>
              </button>

              
            </div>

            <!--Formulaire pour les questions de type B-->
            <div
              v-else
              class="flex items-center justify-center flex-col my-[40px]"
            >
              <input
                type="text"
                id="response"
                @keyup.enter="inputTextVerification"
                name="response"
                class="border text-white rounded-lg block w-[35%] p-2.5 lg:bg-gray-500 xl:bg-gray-500  md:bg-gray-500 sm:bg-white xl:text-white lg:xl:text-white md:text-white sm:text-black text-sm lg:w-[35%] xl:w-[35%] md:w-[55%] sm:w-[55%] min-[320px]:w-[100%]"
                v-model="type_b"
                placeholder="votre réponse..."
                required
              />
              <transition name="fade">
                <span
                  v-if="inputTextError"
                  class="error_inputB float-left font-semibold text-danger my-2"
                >
                  Veuillez répondre avant de passer à la question suivante.
                </span>
              </transition>

              <button
                @click="inputTextVerification"
                class="btn lg:bg-black md:bg-white xl:bg-black xl:text-white lg:xl:text-white  md:text-black lg:w-[15%] md:w-[25%] sm:w-[25%] xl:w-[15%] sm:bg-white min-[320px]:bg-white min-[320px]:w-[55%] transition my-8 ease-in duration-300 hover:bg-purple rounded-full tracking-widest hover:-translate-y-[6px]"
              >
                Suivant <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!--Type C-->
          <div class="body-type-c" v-if="getCurrentQuestion().type === 'C'">
            <div class="flex items-center justify-center flex-col my-[40px]">
              <input
                type="number"
                @keyup.enter="inputNumberVerification"
                id="number"
                min="1"
                max="99"
                v-model="type_c"
                class="border rounded-lg block w-[35%] p-2.5 lg:bg-gray-500 xl:bg-gray-500 md:bg-gray-500 sm:bg-white xl:text-white lg:xl:text-white md:text-white min-[320px]:bg-white sm:text-black text-sm lg:w-[35%] xl:w-[35%] md:w-[55%] sm:w-[55%] min-[320px]:w-[100%] "
                required
              />
              <transition name="fade">
                <span
                  v-if="inputNumberError"
                  id="error_inputC"
                  class="error_inputC float-left font-semibold text-danger my-2"
                >
                  Rentrez un chiffre compris entre 1 et 5
                </span>
              </transition>
              <transition name="fade">
                <span
                  v-if="inputNumberError2"
                  id="error_inputC"
                  class="error_inputC float-left font-semibold text-danger my-2"
                >
                  Veuillez rentrer un nombre.
                </span>
              </transition>
            </div>
            <div class="btn-next flex items-center justify-center">
              <button
                @click="inputNumberVerification"
                class="btn lg:bg-black md:bg-white xl:bg-black xl:text-white lg:xl:text-white md:text-black lg:w-[15%] md:w-[25%] sm:w-[25%] xl:w-[15%] sm:bg-white min-[320px]:bg-white min-[320px]:w-[100%] transition my-1 ease-in duration-300 hover:bg-purple rounded-full tracking-widest hover:-translate-y-[6px]"
              >
                Suivant <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--Modal pour rediriger sur la page des réponses-->
  <div
    v-if="showLinkModal"
    class="modal-container z-0 fixed inset-0 flex items-center justify-center"
  >
    <!-- Overlay sombre -->
    <div class="fixed inset-0 bg-black opacity-60 w-full h-full"></div>
    <div
      class="my-modal xl:w-[600px] xl:h-[320px] lg:w-[600px] lg:h-[320px] md:w-[600px] md:h-[320px] sm:w-[600px] sm:h-[320px]  min-[320px]:w-[350px] min-[320px]:h-[310px]  z-[10000] animate__animated animate__fadeInUp bg-white rounded-[8px] p-5 flex flex-col"
    >
      <h2 class=" md:text-[22px] min-[320px]:text-[19px] lg:text-[22px] sm:text-[22px] font-semibold text-center text-purple">
        Merci d'avoir participé à ce sondage !
      </h2>
      <p class="text-center font-semibold md:text-[18px] min-[320px]:text-[15px] lg:text-[18px] sm:text-[18px] sm:mt-12 lg:mt-12 md:mt-12 xl:mt-12 min-[320px]:mt-8">
        Toute l'équipe de Bigscreen vous remercie pour votre engagement. Grâce à
        votre investissement, nous vous préparons une application toujours plus
        facile à utiliser, seul ou en famille. Si vous désirez consulter vos
        réponses ultérieurement, vous pouvez consultez cette adresse:
        <router-link :to="`/reponses/${token}`"
          ><a
            href=""
            class="text-[18px] text-purple underline font-medium transition ease-in duration-200 break-words"
            >vos réponses</a
          ></router-link
        >
      </p>
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
