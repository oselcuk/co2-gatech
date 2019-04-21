let API_URL = '/api';

var app = new Vue({
    el: "#app",
    data: {
        message: "Hello",
        fromDate: null, //new Date(2015, 1),
        toDate: null, //Date.now(),
        activeDepartment: "all",
        yearData: [],
        initialSummary: [],
        summary: [],
        emitterData: []
    },

    components: {
        vuejsDatepicker,
        gchart: VueGoogleCharts.GChart
    },

    mounted () {
        this.loadDepartmentsData();
        this.loadTopEmittersData();
        this.loadYearlyData();
    },

    computed: {
        departments () {
            var all = [
                { text: 'Georgia Tech', value: 'all' }
            ].concat(this.initialSummary.map(dep => (
                {text: dep.name, value: dep.department}))
            );
            return all;
        },

        totalEmissionsData () {
            if (this.yearData.length == 0) {
                return [];
            }
            var columnData = [
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

        emissionsByDepartmentData () {
            return [['Organization', 'Total Emissions']].concat(
                this.summary.map(d => [d.name, d.total_emissions])
            );
        },

        emissionsByTripData () {
            if (this.yearData.length == 0) {
                return [];
            }
            // TODO: Get these and their pretty names from the API
            var haulTypes = ['long', 'medium', 'short'];
            var byHaul = {};
            haulTypes.forEach((haul) => byHaul[haul] = 0 );
            for (var i = 0; i < this.yearData.length; i++) {
                for (const [haul, emission] of Object.entries(this.yearData[i].emissionsByHaul)) {
                    byHaul[haul] += emission.emissions;
                }
            }

            return [['Haul Type', 'Total Emissions']].concat(haulTypes.map(haul => [haul, byHaul[haul]]));
        },

        topEmittersData () {
            return [['Rank', 'Percentage']].concat(
                this.emitterData.map(d => [d.rank.toString(), d.percentage/100])
            );
        },

        topEmittersOptions () {
            return {
                chart: {
                    title: 'Top Emitters',
                    subtitle: 'Top 10 emitters by percent of emissions they cause'
                },
                vAxis: {
                    format: 'percent'
                }
            };
        },

        apiTimeParams () {
            var params = {};
            if (this.fromDate) {
                params.begin = this.fromDate.toISOString().slice(0, 10);
            }
            if (this.toDate) {
                params.end = this.toDate.toISOString().slice(0, 10);
            }
            return params;
        }
    },

    methods: {
        loadDepartmentsData (args={}) {
            axios.get(API_URL + '/departments', {params: args})
            .then((response) => {
                this.summary = response.data.result;
                if (this.initialSummary.length == 0) {
                    this.initialSummary = this.summary;
                }
            })
            .catch(error => console.log(error));
        },
        loadTopEmittersData (args={}) {
            axios.get(API_URL + '/top_emitters', {params: args})
            .then((response) => {
                this.emitterData = response.data.result;
            })
            .catch(error => console.log(error));
        },
        loadYearlyData (args={}) {
            axios.get(API_URL + '/departments/' + this.activeDepartment, {
                params: Object.assign({}, args, {granularity: 'year'})
            }).then((response) => {
                this.yearData = response.data;
            })
            .catch(error => console.log(error))
        }
    },

    watch: {
        apiTimeParams (newParams, oldParams) {
            this.loadDepartmentsData(newParams);
            this.loadTopEmittersData(newParams);
            this.loadYearlyData(newParams);
        },
        activeDepartment (newDepartment, oldDepartment) {
            this.loadYearlyData(this.apiTimeParams);
        }
    }
});
