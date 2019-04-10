Vue.component('gchart', VueGoogleCharts.GChart);

var app = new Vue({
    el: '#app',

    data () {
        return {
            apiData: [],
            chartData: [
                ['Organization', 'Total Emissions'],
            ],
            chartOptions: {
                chart: {
                    title: 'Emissions by Org.'
                }
            }
        }
    },

    mounted () {
        return axios
            .get('https://co2-gatech.appspot.com/api/departments')
            .then((response) => {
                console.log(response.data.result);
                this.apiData = response.data.result;
            })
            .catch(error => console.log(error))
    },

    computed: {
        pieChartData: function() {
            const pieData = this.chartData;
            for (let i = 0; i < this.apiData.length; i += 1) {
                const point = [this.apiData[i].name, this.apiData[i].totalEmissions];
                pieData.push(point);
            }

            return pieData;
        },

        barChartData: function() {
            const barData = [
                ['Year', 'Total Overall Emissions']
            ];
            var total = 0;
            for (let i = 0; i < this.apiData.length; i += 1) {
                total += this.apiData[i].totalEmissions;
            }
            barData.push(['2018', total]);
            return barData;
        }
    }

})
