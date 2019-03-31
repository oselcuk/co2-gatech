Vue.component('gchart', VueGoogleCharts.GChart);

var app = new Vue({
    el: '#app',

    data () {
        return {
            apiData: []
        }
    },

    mounted () {
        axios
            .get('http://127.0.0.1/departments')
            .then(function(response){
                console.log(response);
                this.apiData = response.data.results;
            })
    }

})
