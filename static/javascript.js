/* jshint esversion: 6 */

Vue.component('gchart', VueGoogleCharts.GChart);

let API_URL = 'https://co2-gatech.appspot.com/api';

var app = new Vue({
    el: '#app',

    data () {
        return {
            yearData: [],
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
            axios.get(API_URL + '/departments')
            .then((response) => {
                console.log(response.data);
                this.apiData = response.data.result;
            })
            .catch(error => console.log(error)),

            axios.get(API_URL + '/top_emitters')
            .then((response) => {
                console.log(response.data);
                this.emitterData = response.data.result;
            })
            .catch(error => console.log(error)),

            axios.get(API_URL + '/departments/all?granularity=year')
            .then((response) => {
                console.log(response.data);
                this.yearData = response.data;
            })
            .catch(error => console.log(error))
        ]);
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
            if (this.yearData.length == 0) {
                return [];
            }
            const columnData = [
                ['Year', 'Total Overall Emissions']
            ];
            for (var i = 0; i < this.yearData.length; i++) {
                data = this.yearData[i];
                year = new Date(data.period.begin).getUTCFullYear().toString();
                emission = data.totalEmissions;
                columnData.push([year, emission]);
            }
            return columnData;
        },

        barChartData: function() {
            if (this.yearData.length == 0) {
                return [];
            }
            // TODO: Get these and their pretty names from the API
            const haulTypes = ['long', 'medium', 'short'];
            var byHaul = {};
            haulTypes.forEach((haul) => byHaul[haul] = 0 );
            for (var i = 0; i < this.yearData.length; i++) {
                for (const [haul, emission] of Object.entries(this.yearData[i].emissionsByHaul)) {
                    console.log(haul, emission);
                    byHaul[haul] += emission.emissions;
                }
            }

            return [['Haul Type', 'Total Emissions']].concat(haulTypes.map(haul => [haul, byHaul[haul]]));
        },

        lineChartData: function() {
            const lineData = [
                ['Rank', 'Percentage']
            ];
            let total = 0;
            for (let i = 0; i < this.emitterData.length; i += 1) {
                const point = [this.emitterData[i].rank.toString(), this.emitterData[i].percentage/100];
                lineData.push(point);
                total += this.emitterData[i].percentage;
            }
            // lineData.push(['Rest', 100 - total]);

            return lineData;
        },

        lineChartOptions: function() {
            return {
                chart: {
                    title: 'Top Emitters',
                    subtitle: 'Top 10 emitters by percent of emissions they cause'
                },
                vAxis: {
                    format: 'percent'
                }
            }
        }
    }

})
