Vue.component('gchart', VueGoogleCharts.GChart);

var app = new Vue({
    el: '#app',

    data () {
        return {
            apiData: [],
            emitterData: [],
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
        return axios.all([
            axios.get('https://co2-gatech.appspot.com/api/departments')
            .then((response) => {
                console.log(response.data.result);
                this.apiData = response.data.result;
            })
            .catch(error => console.log(error)),
            axios.get('https://co2-gatech.appspot.com/api/top_emitters')
            .then((response) => {
                console.log(response.data.result);
                this.emitterData = response.data.result;
            })
            .catch(error => console.log(error))
        ])
    },

    computed: {
        pieChartData: function() {
            const pieData = this.chartData;
            for (let i = 0; i < this.apiData.length; i += 1) {
                const point = [this.apiData[i].name, this.apiData[i].total_emissions];
                pieData.push(point);
            }

            return pieData;
        },

        columnChartData: function() {
            const columnData = [
                ['Year', 'Total Overall Emissions']
            ];
            var total = 0;
            for (let i = 0; i < this.apiData.length; i += 1) {
                total = total + this.apiData[i].total_emissions;
            }
            columnData.push(['2018', total]);
            return columnData;
        },

        barChartData: function() {
            const barData = [
                ['Department', 'Trip Mileage']
            ];
            for (let i = 0; i < this.apiData.length; i += 1) {
                const point = [this.apiData[i].name, this.apiData[i].total_distance];
                barData.push(point);
            }

            return barData;
        },

        lineChartData: function() {
            const lineData = [
                ['Emissions', 'Rank']
            ];
            for (let i = 0; i < this.emitterData.length; i += 1) {
                const point = [this.emitterData[i].totalEmissions, this.emitterData[i].rank];
                lineData.push(point);
            }

            return lineData;
        }
    }

})
