<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Keyboard, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default {
  data() {
    return {
      responses: [], //stockera les réponses de l'utilisateur
       shouldShowNavigation: true,  //affichage de la navigation dans le carousel
    };
  },
  components: {
      Swiper,
      SwiperSlide,
    },

  props: ["token"],

  methods: {
    //Fonction pour récupérer les réponses données par l'utilisateur

    async getResponses(token) {
      var link = `${this.url}responses/${token}`;
      var res = await (
        await fetch(link, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();

      if (res.status == "Done") {
        this.responses = res.data; //On récupère les informations de l'objet data de ma réponse json
      }
    },

    onSwiper(swiper) {
      console.log(swiper);
    },
    onSlideChange() {
      console.log('slide change');
    },
  },

  mounted() {
    //Si on récupère le token, on appelle la fonction une fois laa page chargée
    if (this.token) {
      this.getResponses(this.token);
    }
  },

  setup() {
    return {
      modules: [Keyboard, Navigation],
    };
  },
 
};
</script>

<template>
  <div class="navbar bg-transparent">
    <a href="/" class="z-50">
      <img
        src="/assets/images/bigscreen_logo.png"
        class="w-[160px] h-auto ml-4"
        alt="logo bigscreen"
      />
    </a>
  </div>

  <div class="page-title p-5 animate__animated animate__fadeInUp">
    <h1
      class="mb-4 mt-4 text-3xl min-[320px]:text-[22px] font-bold text-white md:text-5xl lg:text-6xl"
    >
      <span
        class="text-transparent bg-clip-text bg-gradient-to-r to-purple from-[#8E2DE2]"
        >Réponses</span
      >
      du sondage
    </h1>
    <p
      class="text-lg font-medium text-white min-[320px]:text-[16px] lg:text-xl"
    >
      Vous trouverez ci-dessous les réponses que vous avez apportées à notre
      sondage.
    </p>
    <hr class="w-48 h-1 my-8 border-0 rounded bg-white" />
  </div>

  <div class="wrapper my-12 p-3 relative">
    <swiper
    :slidesPerView="1"
    :spaceBetween="10"
      :keyboard="{
        enabled: true,
      }"
      :navigation="shouldShowNavigation"
      :modules="modules"
      :breakpoints="{
      '320': {
        shouldShowNavigation: false,
        slidesPerView: 1,
        spaceBetween: 5,
      },
      '640': {
        shouldShowNavigation: false,
        slidesPerView: 1,
        spaceBetween: 5,
      },
      '768': {
        slidesPerView: 1,
        spaceBetween: 40,
        shouldShowNavigation: false,
      },
    }"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      class="mySwipe h-[350px]"
    >
      <swiper-slide v-for="answer in responses" :key="answer.id">
        <div class="lg:w-[400px] lg:h-[250px] xl:w-[400px] xl:h-[250px] md:w-[400px] md:h-[250px] sm:w-[400px] min-[320px]:h-[250px]  min-[320px]:w-[320px] sm:h-[250px] m-auto p-4 bg-white border rounded-lg">
          <div
            class="answer-container flex flex-col justify-center items-center"
          >
            <h5
              class="mb-2 text-2xl font-bold tracking-tight text-purple text-center"
            >
              Question {{ answer.question_id }}
            </h5>
            <h6
              class="my-5 text-black lg:text-[22px] xl:text-[22px] md:text-[22px] min-[320px]:text-[18px] font-bold tracking-tight text-center"
            >
              {{ answer.question }}
            </h6>
            <p class="font-semibold text-center text-[24px] text-success">
              <span class="font-semibold  text-black lg:text-[22px] xl:text-[22px] md:text-[22px] min-[320px]:text-[18px]"
                >Réponse donnée:</span
              >
              {{ answer.user_response }}
            </p>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background-color: #000000;
}

.swiper-button-prev {
  color: white;
  top: 35% !important;
  left: 0px;
}

.swiper-button-prev:hover {
  transition: 0.3s ease-in;
  color: #451bde;
}

.swiper-button-next:hover {
  transition: 0.3s ease-in;
  color: #451bde;
}

.swiper-button-next {
  color: white;
  top: 35% !important;
  right: 0px;
}
</style>
