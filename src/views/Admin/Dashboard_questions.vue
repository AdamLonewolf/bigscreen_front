<script>
import Sidebar from '../../components/Sidebar.vue';
export default {
    data(){
        return{
            questions:[], //tableau qui récupérera les questions
            hideLoader:false,
        }
    },
    methods:{
        async getQuestions(){
             var link = `${this.url}questions`;
             var res = await(await fetch(link,{
                method:"get",
                headers:{
                    'Content-Type': "application/json"
                },
            })).json();
            if(res.status == 'Done'){
                this.questions = res.data;
                this.hideLoader = !this.hideLoader
            }
        }
    },
     components: {
      Sidebar
    },

    mounted(){
        this.getQuestions();
    }
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

    <!--Ma sidebar-->
        <div class="siderbar-container">
            <Sidebar></Sidebar>
        </div>
    <!--contenu de la page-->
    <div class="p-4 sm:ml-64">
        <div class="page-title p-5">      
                <h1 class="mb-4 mt-4 text-5xl font-bold text-black"><span class="text-transparent bg-clip-text bg-gradient-to-r to-purple from-[#8E2DE2]">Questions</span> du sondage</h1>
        </div>
    <!--Le tableau-->
        <div class="relative overflow-x-auto shadow-md my-12">
            <table class="w-full text-sm text-left text-white ">
                <thead class="text-xs bg-gray-700">
                    <tr>
                        <th scope="col" class="px-6 text-[16px] py-3">  
                            Question n°
                        </th>
                        <th scope="col" class="px-6 text-[16px] py-3">
                            Titre de la question
                        </th>
                        <th scope="col" class="px-6 text-[16px] py-3">
                            Type de la question
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bg-gray_black border-b  dark:border-gray-700" v-for="question in questions" :key="question.id">
                        <td class="px-6 py-4 text-[18px]">
                            {{question.id}}
                        </td>
                        <td class="px-6 py-4 text-[18px]">
                            {{question.title}}
                        </td>
                        <td class="px-6 py-4 text-[18px]">
                            {{question.type}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
    
    

    
   

</template>

<style>

</style>