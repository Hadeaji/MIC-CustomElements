const miTempUsageDetailsTemplateString =
    `
    <style type="text/css">
        * {
            font-family: system-ui;
        }
        .card {
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            transition: 0.3s;
            border-radius: 5px; /* 5px rounded corners */
            margin: 10px;
            min-width: 300px;
            padding: 10px;
        }
        .card-row {
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(150, 150, 150, 0.3);
        }
        #title {
            margin: 15px;
            color: #1f5da6;
            font-weight: 500;
            text-align: left;
        }
        .label {
            color: #4b4b4b;
            font-weight: 500;
            padding: 5px 15px;
            margin: 0;
            font-size: 12px;
            text-align: left;
        }
        .sub-label {
            color: #4b4b4b;
            font-weight: 500;
            padding: 5px 15px;
            margin: 0;
            font-size: 12px;
            text-align: end;
            font-weight: 700;
        }
        .sub-label span {
            color: #a7a7a7;
            font-weight: 500;
        }
        .value {
            padding: 5px 15px;
            margin: 0;
            font-weight: 600;
            font-size: 16px;
        }
        .linkBox {
            text-align: end;
            margin: 15px 10px 5px;
        }
        .card .linkBox #link {
            color: #1f5da6;
            text-decoration: none;
            margin: 10px;
            font-weight: 500;
            font-size: 12px;
        }
    </style>

    <div class="card">
        <h3 id="title"></h3>
        <div id="chart"></div>

        <div class="linkBox">
            <a id="link"></a>
        </div>
    </div>
`;

// Imported packages
var apexcharts = document.createElement('script');  
apexcharts.setAttribute('src','https://cdn.jsdelivr.net/npm/apexcharts');
document.head.appendChild(apexcharts);
//

const miTempUsageDetailsTemplate = document.createElement("template");
miTempUsageDetailsTemplate.innerHTML = miTempUsageDetailsTemplateString;
class MIC_CHART extends HTMLElement {
    unite;
    labels;
    data;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(miTempUsageDetailsTemplate.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['title', 'link', 'link-msg', 'unite', 'labels', 'data'];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute == 'title') {
            this.shadowRoot.querySelector(
                '#title'
            ).innerHTML = newValue.toUpperCase();
        }
        if (attribute == 'link') {
            this.shadowRoot.querySelector('#link').href = newValue;
        }
        if (attribute == 'link-msg') {
            this.shadowRoot.querySelector('#link').innerHTML =
                newValue + ' >';
        }

        if (attribute == 'unite') {
            this.unite = newValue;
        }

        if (attribute == 'labels') {
            let data = JSON.parse(newValue);
            this.labels = data;
        }

        if (attribute == 'data') {
            let data = JSON.parse(newValue);
            this.data = data;
            this.renderChart();
        }
    }

    renderChart() {
        let options = {
            series: [],
            chart: {
                type: 'bar',
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 10,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            xaxis: {
                categories: this.labels,
            },
            yaxis: {
                title: {
                    text: this.unite,
                },
            },
            fill: {
                opacity: 1,
            },
            colors: ['#b9d8f4', '#244c81'],

            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
        };

    let chart = new ApexCharts(this.shadowRoot.querySelector("#chart"), options);
    chart.render();
    setTimeout(() => {
        chart.updateSeries(this.data);
    }, 200);
    }
}

customElements.define('mic-chart', MIC_CHART);
