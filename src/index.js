const vm = new Vue({
    el: '#vue-app',
    data: {
        k: 100,
        n: 2,
        r: 0.3,
        highlightedPoint: undefined
    },
    computed: {
        // геттер для набора значений n(t) при t=[0, 50]
        result() {
            let result = []
            for (let t = 0, n; t <= 50; t++) {
                n = this.calcN(t).toFixed(3)
                result.push(n)
            }
            return result
        },
        // геттер точки с наибольшей скоростью изменения графика (возвращает координату t)
        pointToHighlight() {
            let changeRate         // скорость изменения графика для текущей точки
            let maxChangeRate = 0  // максимальная скорость изменения графика
            let pointToHighlight   // координата t точки, которую необходимо выделить

            for (let t = 0; t <= 50; t++) {
                changeRate = this.calcChangeRate(t)
                
                if (Math.abs(changeRate) > Math.abs(maxChangeRate)) {
                    maxChangeRate = changeRate
                    pointToHighlight = t
                }
            }

            return pointToHighlight
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

        // вычисляет значение скорости изменения графика функции в заданной точке t
        calcChangeRate(t) {
            const k = this.k
            const r = this.r
            const n = this.n

            // Эта формула - продифференцированная функция n(t)
            return (r*k*((k/n)-1)*Math.pow(Math.E, (-r*t)))/Math.pow((1+((k/n)-1)*Math.pow(Math.E, (-r*t))), 2)
        },

        // перерисовать график с новыми данными 
        rerenderChart() {
            let chartData = chart.data.datasets[0].data

            // поменять текущие значения на новые
            this.result.forEach((newValue, i) => {
                chartData[i] = newValue
            })

            // выделить необходимую точку
            this.highlightPoint(this.pointToHighlight)

            chart.update()
        },

        // визуально выделить точку, с координатой t
        highlightPoint(t) {
            // очистить предыдущюю выделенную точку, если такая есть
            if (this.highlightedPoint !== undefined) this.dehighlightPoint(this.highlightedPoint)

            // определение кастомных стилей для выбранной точки
            let point = chart.getDatasetMeta(0).data[t]
            if (point === undefined) return // выйти из функции, если точки не существует
            point.custom = point.custom || {}

            point.custom.backgroundColor = "rgb(79, 214, 178)"
            point.custom.radius = 9
        
            // запомнить координату выделенной точки (чтобы в дальнейшем ее было легко "очистить")
            this.highlightedPoint = t
        },

        // очистить кастомные стили точки с индексом t
        dehighlightPoint(t) {
            let point = chart.getDatasetMeta(0).data[t]
            delete point.custom
        },
    },
    // следит за изменениями параметров и перерисовывает график при необходимости
    watch: {
        k() {
            this.rerenderChart()
        },
        n() {
            this.rerenderChart()
        },
        r() {
            this.rerenderChart()
        },

    }
})

const ctx = document.getElementById('graph').getContext('2d')
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [...Array(51).keys()],
        datasets: [{
            data: vm.result,
            backgroundColor: [
                'rgba(79, 214, 178, 0.2)',
            ],
            borderColor: [
                'rgb(66, 178, 148)',
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
