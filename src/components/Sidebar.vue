<script>
export default {
    data(){
      return{
         id : sessionStorage.getItem('admin_id')
      }
    },
   methods:{
         
      //Fonction pour se déconnecter 
      async logout(){
       //Je stocke l'id dans une variable
       var id = this.id;
       var link = `${this.url}logout/${id}`
        
       var res = await(await(fetch(link,{
        method:"get",
         headers:{
            'Content-Type': "application/json"
         },
       }))).json(); 

       if(res.status == "Done"){
        //Si la déconnexion est effectuée avec succès, on écrase les token et l'id de l'admin dans la session du navigateur
          sessionStorage.removeItem('admin_id');
          sessionStorage.removeItem('admin_token');
          window.location.href = ('/connexion_administration'); //Si c'est bon, on dirige l'admin sur le login
       }  
      }
   }

}
</script>

<template>
    <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
   <span class="sr-only">Open sidebar</span>
   <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
   </svg>
</button>

<aside id="logo-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
   <div class="h-full px-3 py-4 overflow-y-auto bg-gray_black">
      <a href="/administration" class="flex items-center pl-2.5 mb-5">
         <img src="public/assets/images/bigscreen_logo.png" class="w-[160px] h-auto" alt="Bigscreen" />
      </a>
      <ul class="space-y-2 my-10 font-medium">
         <li>
            <a href="/administration" class="flex items-center p-2 text-white hover:bg-purple rounded-[10px] group transition ease-in duration-200">
                <i class="fa-solid fa-chart-pie mx-2"></i>
               <span class="ml-3">Accueil</span>
            </a>
         </li>
          <li>
            <a href="/administration_questions" class="flex items-center p-2 text-white group hover:bg-purple rounded-[10px] transition ease-in duration-200">
                <i class="fa-solid fa-clipboard-question mx-2"></i>
               <span class="ml-3">Questions</span>
            </a>
         </li>
          <li>
            <a href="/administration_reponses" class="flex items-center p-2 text-white group hover:bg-purple rounded-[10px] transition ease-in duration-200">
                <i class="fa-solid fa-clipboard-list mx-2"></i>
               <span class="ml-3">Réponses</span>
            </a>
         </li>
         <li>
            <a href="#" @click="logout" class="flex items-center p-2 text-white rounded-lg bg-danger hover:bg-[#EA3F2E] group">
                <i class="fa-solid fa-right-from-bracket mx-2"></i>
               <span class="ml-3">Se déconnecter</span>
            </a>
         </li>
      </ul>
   </div>
</aside>    
</template>

<style>

</style>