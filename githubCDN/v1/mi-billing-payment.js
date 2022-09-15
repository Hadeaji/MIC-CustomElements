"use strict";


const miTempBillingPaymentTemplateString = ```
<template id="mi-temp-billing-payment">
<style type="text/css">
  * {
    font-family: system-ui;
  }

  .card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    border-radius: 5px;
    /* 5px rounded corners */
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
  }

  .label {
    color: #4b4b4b;
    font-weight: 500;
    padding: 5px 15px;
    margin: 0;
    font-size: 12px;
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
  <div id="content"></div>

  <div class="linkBox">
    <a id="link"></a>
  </div>
</div>
</template>
```;

  const miTempBillingPaymentTemplate = document.createElement(
    "template"
  );
  miTempBillingPaymentTemplate.innerHTML = miTempBillingPaymentTemplateString;
  class MI_BILLING_PAYMENT extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(
        miTempBillingPaymentTemplate.content.cloneNode(true)
      );
    }

    static get observedAttributes() {
      return [
        "title",
        "link",
        "link-msg",
        "dates-data",
        "bill-data",
        "payment-data",
      ];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      if (attribute == "title") {
        this.shadowRoot.querySelector("#title").innerHTML =
          newValue.toUpperCase();
      }
      if (attribute == "link") {
        this.shadowRoot.querySelector("#link").href = newValue;
      }
      if (attribute == "link-msg") {
        this.shadowRoot.querySelector("#link").innerHTML = newValue + " >";
      }

      if (attribute == "dates-data") {
        let data = JSON.parse(newValue);
        this.loadDates(data);
      }

      if (attribute == "payment-data") {
        let data = JSON.parse(newValue);
        this.loadPayment(data);
      }

      if (attribute == "bill-data") {
        let data = JSON.parse(newValue);
        this.loadBills(data);
      }
    }

    loadDates(arr) {
      arr.forEach((date) => {
        let section = document.createElement("div");
        section.className = "card-row";

        let ele = document.createElement("h3");
        ele.innerHTML = date;
        ele.className = "label";
        section.appendChild(ele);
        this.shadowRoot.querySelector("#content").appendChild(section);
      });
    }
    loadPayment(arr) {
      let cardRows = this.shadowRoot.querySelectorAll(".card-row");
      cardRows.forEach((row, x) => {
        let ele = document.createElement("p");
        try {
          ele.innerHTML = `<span>Payment:</span> $${arr[x]}`;
          ele.className = "sub-label";
        } catch {
          return;
        }

        row.appendChild(ele);
      });
    }
    loadBills(arr) {
      let cardRows = this.shadowRoot.querySelectorAll(".card-row");
      cardRows.forEach((row, x) => {
        let ele = document.createElement("p");
        try {
          ele.innerHTML = `<span>Bill:</span> $${arr[x]}`;
          ele.className = "sub-label";
        } catch {
          return;
        }

        row.appendChild(ele);
      });
    }
  }
  customElements.define("mi-billing-payment", MI_BILLING_PAYMENT);


<template id="grapy">
  <style type="text/css">
    .box {
      border-radius: 0.5em;
      padding: 2px;
      cursor: move;
    }

    .box.over {
      border: 3px dotted #666;
    }

    [draggable] {
      user-select: none;
    }

    .container {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      grid-auto-flow: row;
    }
  </style>

  <div id="container" class="container"></div>
</template>


  const grapyTemplate = document.querySelector("#grapy");
  class Grapy extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(grapyTemplate.content.cloneNode(true));
      this.onMutation = this.onMutation.bind(this);
      linkEvents(this.shadowRoot);
    }

    static get observedAttributes() {
      return ["map_style"];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      if (attribute == "map_style") {
        this.shadowRoot
          .querySelector("#container")
          .setAttribute("style", newValue);
      }
    }

    connectedCallback() {
      // Set up observer
      this.observer = new MutationObserver(this.onMutation);

      // Watch the Light DOM for child node changes
      this.observer.observe(this, { childList: true });
    }

    disconnectedCallback() {
      // remove observer if element is no longer connected to DOM
      this.observer.disconnect();
    }

    onMutation(mutations) {
      const added = [];

      // A `mutation` is passed for each new node
      for (const mutation of mutations) {
        // Could test for `mutation.type` here, but since we only have
        // set up one observer type it will always be `childList`
        added.push(...mutation.addedNodes);
      }

      let divs = added.filter((el) => el.nodeType === Node.ELEMENT_NODE);
      this.setUpBoxes(divs);
    }

    setUpBoxes(childs) {
      this.disconnectedCallback();
      childs.forEach((ele) => {
        let wrappedEle = this.wrap(ele);
        this.shadowRoot.querySelector("#container").appendChild(wrappedEle);
      });
      this.connectedCallback();

      console.log("item");
    }

    wrap(el) {
      let wrapper = document.createElement("div");
      wrapper.setAttribute("class", "box");
      wrapper.setAttribute("draggable", "true");
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      return wrapper;
    }
  }
  customElements.define("mi-grapy", Grapy);

  function linkEvents(shadowRoot) {
    document.addEventListener("DOMContentLoaded", (event) => {
      var dragSrcEl = null;

      function handleDragStart(e) {
        this.style.opacity = "0.4";

        dragSrcEl = this;

        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", this.innerHTML);
      }

      function handleDragOver(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }

        e.dataTransfer.dropEffect = "move";

        return false;
      }

      function handleDragEnter(e) {
        this.classList.add("over");
      }

      function handleDragLeave(e) {
        this.classList.remove("over");
      }

      function handleDrop(e) {
        if (e.stopPropagation) {
          e.stopPropagation(); // stops the browser from redirecting.
        }

        if (dragSrcEl != this) {
          dragSrcEl.innerHTML = this.innerHTML;
          this.innerHTML = e.dataTransfer.getData("text/html");
        }

        return false;
      }

      function handleDragEnd(e) {
        this.style.opacity = "1";

        items.forEach(function (item) {
          item.classList.remove("over");
        });
      }

      let items = shadowRoot.querySelectorAll(".container .box");
      console.log(items);
      items.forEach(function (item) {
        item.addEventListener("dragstart", handleDragStart, false);
        item.addEventListener("dragenter", handleDragEnter, false);
        item.addEventListener("dragover", handleDragOver, false);
        item.addEventListener("dragleave", handleDragLeave, false);
        item.addEventListener("drop", handleDrop, false);
        item.addEventListener("dragend", handleDragEnd, false);
      });
    });
  }


<template id="mi-temp-meter-read">
  <style type="text/css">
    * {
      font-family: system-ui;
    }

    .card {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      border-radius: 5px;
      /* 5px rounded corners */
      margin: 10px;
      min-width: 400px;
      padding: 10px;
    }

    #title {
      margin: 15px;
      color: #1f5da6;
      font-weight: 500;
    }

    .label {
      color: #4b4b4b;
      font-weight: 500;
      background: #dadada;
      padding: 5px 15px;
      margin: 0;
      font-size: 12px;
    }

    .value {
      padding: 5px 15px;
      margin: 0;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
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

    table {
      border: none;
      border-collapse: collapse;
      width: 100%;
    }

    table td,
    table th {
      border-left: 1px solid rgba(150, 150, 150, 0.5);
      border-right: 1px solid rgba(150, 150, 150, 0.5);
    }

    table td:first-child,
    table th:first-child {
      border-left: none;
    }

    table td:last-child,
    table th:last-child {
      border-right: none;
    }
  </style>

  <div class="card">
    <h3 id="title"></h3>
    <!-- <div id="content"></div> -->
    <table>
      <tr id="headRow"></tr>
      <tr id="dataRow"></tr>
    </table>
    <div class="linkBox">
      <a id="link"></a>
    </div>
  </div>
</template>


  const miMeterTemp = document.querySelector("#mi-temp-meter-read");
  class MI_METER_READ extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(miMeterTemp.content.cloneNode(true));
    }

    static get observedAttributes() {
      return ["title", "link", "link-msg", "value-data", "label-data"];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      if (attribute == "title") {
        this.shadowRoot.querySelector("#title").innerHTML = newValue;
      }
      if (attribute == "link") {
        this.shadowRoot.querySelector("#link").href = newValue;
      }
      if (attribute == "link-msg") {
        this.shadowRoot.querySelector("#link").innerHTML = newValue + " >";
      }

      if (attribute == "label-data") {
        console.log(newValue);
        let data = JSON.parse(newValue);
        this.loadTh(data);
      }

      if (attribute == "value-data") {
        let data = JSON.parse(newValue);
        this.loadTd(data);
      }
    }

    loadTh(arr) {
      for (let thData of arr) {
        let ele = document.createElement("th");
        ele.innerHTML = thData;
        ele.className = "label";
        this.shadowRoot.querySelector("#headRow").appendChild(ele);
      }
    }

    loadTd(arr) {
      for (let thData of arr) {
        let ele = document.createElement("td");
        ele.className = "value";
        ele.innerHTML = thData;
        this.shadowRoot.querySelector("#dataRow").appendChild(ele);
      }
    }
  }
  customElements.define("mi-meter-read", MI_METER_READ);


<template id="mi-temp-chart">
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
    }
    .label {
      color: #4b4b4b;
      font-weight: 500;
      padding: 5px 15px;
      margin: 0;
      font-size: 12px;
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
</template>
<script src="https://cdn.jsdelivr.net/npm/apexcharts">

  const miChartTemp = document.querySelector("#mi-temp-chart");
  class MI_CHART extends HTMLElement {
    unite;
    labels;
    data;

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(miChartTemp.content.cloneNode(true));
    }

    static get observedAttributes() {
      return ["title", "link", "link-msg", "unite", "labels", "data"];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      if (attribute == "title") {
        this.shadowRoot.querySelector("#title").innerHTML =
          newValue.toUpperCase();
      }
      if (attribute == "link") {
        this.shadowRoot.querySelector("#link").href = newValue;
      }
      if (attribute == "link-msg") {
        this.shadowRoot.querySelector("#link").innerHTML = newValue + " >";
      }

      if (attribute == "unite") {
        this.unite = newValue;
      }

      if (attribute == "labels") {
        let data = JSON.parse(newValue);
        this.labels = data;
      }

      if (attribute == "data") {
        let data = JSON.parse(newValue);
        this.data = data;
        this.renderChart();
      }
    }

    renderChart() {
      let options = {
        series: [],
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
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
        colors: ["#b9d8f4", "#244c81"],

        tooltip: {
          y: {
            formatter: function (val) {
              return val;
            },
          },
        },
      };

      let chart = new ApexCharts(
        this.shadowRoot.querySelector("#chart"),
        options
      );
      chart.render();
      setTimeout(() => {
        chart.updateSeries(this.data);
      }, 200);
    }
  }

  customElements.define("mi-chart", MI_CHART);

<template id="mi-temp-billing-summary">
  <style type="text/css">
    * {
      font-family: system-ui;
    }

    .card {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      border-radius: 5px;
      /* 5px rounded corners */
      margin: 10px;
      min-width: 300px;
      padding: 20px;
    }

    .row {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(150, 150, 150, 0.3);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .multi-row {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(150, 150, 150, 0.3);
      display: flex;
      flex-direction: column;
    }

    .sub-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }



    #title {
      margin: 0 0 15px 0;
      color: #1f5da6;
      font-weight: 500;
    }

    #sectiontitle {
      margin: 3px 0;
      color: #06182d;
      font-weight: 500;
      font-size: x-large;
    }

    #comment {
      color: rgba(128, 128, 128, 0.7);
      text-decoration: none;
      margin: 10px 0;
      font-weight: 500;
      font-size: 12px;
    }
    .label {
      color: #4b4b4b;
      font-weight: 500;
      padding: 5px 0;
      margin: 0;
      font-size: 12px;
    }

    .sub-label {
    font-weight: 400;
    padding: 5px 15px;
    margin: 0;
    text-align: left;
    color: #005faa;
    width: 38%;
    font-style: italic;
    }

    .bold-label {
      color: #4b4b4b;
    font-weight: 500;
    padding: 5px 0;
    margin: 0;
    font-size: 17px;
    text-align: left;
    width: 100%;
    }

    .total-row{
      font-weight: 500;

    }

    .first-label {
      color: #4b4b4b;
      padding: 5px 0;
      margin: 0;
      text-align: left;
      width: 50%;
    }

    .sub-label span {
      color: #a7a7a7;
      font-weight: 500;

    }

    .value {
      padding: 5px 15px;
      margin: 0;
      font-size: 16px;
      width: 15%;
      text-align: right;
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
    <h4 id="title"></h4>
    <h3 id="sectiontitle"></h3>
    <p id="comment"></p>
    <div id="content">
      <div class="row" id="daily-basic-service-charge"></div>
      <div class="row" id="billing-demand-charge"></div>
      <div class="row" id="peak-demand-charge"></div>
      <div class="multi-row" id="EnergyCharge">
        <div class="sub-row" id="energy-charge-on-peak"></div>
        <div class="sub-row" id="energy-charge-off-peak"></div>
      </div>
      <div class="multi-row" id="FuelCharge">
        <div class="sub-row" id="fuel-charge-on-peak"></div>
        <div class="sub-row" id="fuel-charge-off-peak"></div>
      </div>
      <div class="row" id="capacity-charge"></div>
      <div class="row" id="storm-protection-charge"></div>
      <div class="row" id="energy-conservation-charge"></div>
      <div class="row" id="environmental-cost-recovery"></div>
      <div class="sub-row" id="clean-energy-transition-mechanism"></div>
    </div>
    <hr class="lastDiv" />
    <div class="sub-row total-row" id="electric-charges-subtotal"></div>
  </div>
</template>


  const miTempBillingSummaryTemplate = document.querySelector(
    "#mi-temp-billing-summary"
  );
  class MI_BILLING_SUMMARY extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(
        miTempBillingSummaryTemplate.content.cloneNode(true)
      );
    }

    static get observedAttributes() {
      return [
        "title",
        "sectiontitle",
        "comment",
        "clean-energy-transition-mechanism",
        "environmental-cost-recovery",
        "energy-conservation-charge",
        "storm-protection-charge",
        "capacity-charge",
        "fuel-charge-off-peak",
        "fuel-charge-on-peak",
        "energy-charge-off-peak",
        "energy-charge-on-peak",
        "peak-demand-charge",
        "billing-demand-charge",
        "daily-basic-service-charge",
        "total"
      ];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      if (attribute == "title") {
        this.shadowRoot.querySelector("#title").innerHTML =
          newValue.toUpperCase();
      } else if (attribute == "sectiontitle") {
        this.shadowRoot.querySelector("#sectiontitle").innerHTML = newValue;
      } else if (attribute == "comment") {
        this.shadowRoot.querySelector("#comment").innerHTML = newValue;
      } else if (attribute == "total"){
        this.loadTotal(newValue);
      }else {
        this.loadBlock(attribute, newValue);
      }
    }

    loadBlock(attribute, stringData) {
      let cardRow = this.shadowRoot.querySelector(`#${attribute}`);
      let data = JSON.parse(stringData);
      let name = attribute.split("-");
      let newName = [];
      for (let i of name) {
        let temp = `${i[0].toUpperCase()}${i.slice(1)}`;
        newName.push(temp);
      }
      if((newName[0] == "Fuel" || newName[0] == "Energy") && newName[1] == "Charge"){
        let boldLabel = newName.splice(0, 2);
        
        if(newName[0] == "On"){
          let parent = this.shadowRoot.querySelector(`#${boldLabel.join("")}`);
          let boldLabelEle = document.createElement("h5");
          boldLabelEle.innerHTML = `${boldLabel.join(" ")}`;
          boldLabelEle.className = "bold-label";
          parent.prepend(boldLabelEle);
        }
      }
      newName = newName.join(" ");
    
      let ele1 = document.createElement("p");
      ele1.innerHTML = `${newName}`;
      ele1.className = "first-label";
      cardRow.appendChild(ele1);

      let ele2 = document.createElement("p");
      ele2.innerHTML = `${data.label}`;
      ele2.className = "sub-label";
      cardRow.appendChild(ele2);

      let ele3 = document.createElement("p");
      ele3.innerHTML = `$${data.value}`;
      ele3.className = "value";
      cardRow.appendChild(ele3);
    }

    loadTotal(total){
      let row = this.shadowRoot.querySelector("#electric-charges-subtotal");
      let ele1 = document.createElement("p");
      ele1.innerHTML = `Electric Charges Subtotal`;
      ele1.className = "first-label";
      row.appendChild(ele1);
      let ele2 = document.createElement("p");
      ele2.innerHTML = `$${total}`;
      ele2.className = "value";
      row.appendChild(ele2);
    }

  }
  customElements.define("mi-billing-summary", MI_BILLING_SUMMARY);



<!-- Example For Actual Elements For User To Use -->
<mi-grapy
  class="container"
  map_style="display: grid; grid-template-columns: 2fr 1fr;"
>
  <mi-chart
    title="Usage Details"
    link="www.google.com"
    link-msg="View Billing & Usage"
    unite="Unite"
    labels='["Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sept", "Oct", "Nov", "Dec"]'
    data='[{"name": "Net Profit","data": [44, 55, 57, 56, 61, 58, 63, 60, 66]}, {"name": "Revenue","data": [76, 85, 101, 98, 87, 105, 91, 114, 94]}]'
  >
  </mi-chart>
  <mi-billing-payment
    title="Billing & Payment History"
    link="https://www.google.com"
    link-msg="View More"
    dates-data='["November 2, 2021","October 2, 2021", "September 2, 2021","Augest 2, 2021"]'
    bill-data="[91.46,91.46,91.46,91.46]"
    payment-data="[91.46,91.46,91.46,91.46]"
  >
  </mi-billing-payment>
  <mi-meter-read
    title="Meter Read"
    link="www.google.com"
    link-msg="View Meter Details"
    label-data='["Meter Number","Passed Days", "Current Reading","Previous Reading","Total Used"]'
    value-data='[1234324, "23 Days", 225, 245,12.5]'
  >
  </mi-meter-read>

  <mi-billing-summary
  title="Billing Summary"
  sectiontitle="⚡ Electric Charges"
  comment="Service Period: November 25, 2021 - December 28, 2022"
  clean-energy-transition-mechanism='{"label":"88 kW @ $0.74000 ","value":"96.80"}'
  environmental-cost-recovery='{"label":"56,240 kWh @ $0.00130/kWh","value":"73.11"}'
  energy-conservation-charge='{"label":"88 kW @ $0.74000","value":"71.28"}'
  storm-protection-charge='{"label":"88 kW @ $0.74000","value":"51.92"}'
  capacity-charge='{"label":"88 kW @ $0.09000/kW","value":"7.92"}'
  fuel-charge-off-peak='{"label":"43,040 kWh @ $0.02944/kWh","value":"1,267.10"}'
  fuel-charge-on-peak='{"label":"13,200 kWh @ $0.03318/kWh ","value":"437.98"}'
  energy-charge-off-peak='{"label":"43,040 kWh @ $0.00566/kWh","value":"243.61"}'
  energy-charge-on-peak='{"label":"13,200 kWh @ $0.01183/kWh","value":"156.16"}'
  peak-demand-charge='{"label":"88 kW @ 8.990000/kW","value":"791.12"}'
  billing-demand-charge='{"label":"88 kW @ 4.40000/kW","value":"387.20"}'
  daily-basic-service-charge='{"label":"26 days @ $1.07000","value":"36.38"}'
  total="3,638.58"
>
</mi-billing-summary>
</mi-grapy>
