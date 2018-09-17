const vm = new Vue({
    el: '#vue-app',
    data: {
        k: 100,
        n: 2,
        r: 0.3
    },
    computed: {
        // initial calculations
        result() {
            let result = []
            for (let t = 0, n; t <= 50; t++) {
                n = this.calcN(t).toFixed(3)
                result.push(n)
            }
            return result
        }
    },
    methods: {
        // высчитывает n(t) при текущих параметрах
        calcN(t) {
            const k = this.k
            const r = this.r
            const n = this.n

            return k / (1 + ((k/n)-1) * Math.pow(Math.E, (-r*t)))
        },

        recalcValues() {
            chart.data.datasets[0].data = []

            for (let t = 0, n; t <= 50; t++) {
                n = this.calcN(t).toFixed(2)
                chart.data.datasets[0].data.push(n)
            }
            
            chart.update()
        }
    },
})

const ctx = document.getElementById('graph').getContext('2d')
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [...Array(51).keys()],
        datasets: [{
            data: vm.result,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
            ],
            borderWidth: 3
        }],
    },
    options: {
        legend: {
            display: false,
        },
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'N, шт.'
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 't, у.е.'
                }
            }]
        }
    }
})
