const miTempBillingPaymentTemplateString =
`
<style type="text/css">
* {
  font-family: system-ui;
}

h3 {
  text-align: left;
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
`;

const miTempBillingPaymentTemplate = document.createElement("template");
miTempBillingPaymentTemplate.innerHTML = miTempBillingPaymentTemplateString;
class MI_BILLING_PAYMENT extends HTMLElement {
    example = `
    <mi-billing-payment
        title="Billing & Payment History"
        link="https://www.google.com"
        link-msg="View More"
        dates-data='["November 2, 2021","October 2, 2021", "September 2, 2021","Augest 2, 2021"]'
        bill-data="[91.46,91.46,91.46,91.46]"
        payment-data="[91.46,91.46,91.46,91.46]"
    >
    </mi-billing-payment>
    `;
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
