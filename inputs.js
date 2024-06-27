document.addEventListener("DOMContentLoaded", function () {
  const retirementForm = document.getElementById("retirement-form");
  const inputs = document.querySelectorAll('input[type="number"]');
  const currencyInputs = document.querySelectorAll(".currency-input");
  const accordionButton = document.querySelector(".accordion-button");
  const accordionContent = document.querySelector(".accordion-content");
  const resultDiv = document.getElementById("result");
  const interestRateInput = document.getElementById("interest-rate");

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9.]/g, "");
      if (this.value < 0) {
        this.value = 0;
      }
    });
  });

  currencyInputs.forEach((input) => {
    input.addEventListener("input", function () {
      formatCurrencyInput(this);
    });
  });

  retirementForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateForm(retirementForm)) {
      const details = calculateRetirement();
      displayResults(details);
      displayGraph(details.details);
      showDetailsButton();
      showDownloadButton();
    }
  });

  accordionButton.addEventListener("click", function () {
    if (accordionContent.classList.contains("show")) {
      accordionContent.classList.remove("show");
      accordionContent.classList.add("hide");
    } else {
      accordionContent.classList.remove("hide");
      accordionContent.classList.add("show");
    }
    adjustChartPosition();
  });

  interestRateInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9.,]/g, "");
  });

  function formatCurrencyInput(input) {
    const value = input.value.replace(/\D/g, "");
    const options = {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    };
    const formattedValue = new Intl.NumberFormat("pt-BR", options).format(
      value / 100
    );
    input.value = formattedValue;
  }

  function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.value === "" || input.value == null) {
        isValid = false;
        input.classList.add("border-red-500");
      } else {
        input.classList.remove("border-red-500");
      }
    });

    if (!isValid) {
      displayErrorMessage("Por favor, preencha todos os campos corretamente.");
    }
    return isValid;
  }

  function displayErrorMessage(message) {
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = message;
    retirementForm.insertAdjacentElement("beforebegin", errorMessage);

    setTimeout(() => {
      errorMessage.remove();
    }, 3000);
  }

  function showDetailsButton() {
    document.getElementById("details_container_button").style.display = "block";
  }

  function showDownloadButton() {
    document.getElementById("download-chart").style.display = "block";
  }

  function adjustChartPosition() {
    const chartWrapper = document.getElementById("chart-wrapper");
    if (accordionContent.classList.contains("show")) {
      chartWrapper.style.marginTop = "20px";
    } else {
      chartWrapper.style.marginTop = "0";
    }
  }
});

function calculateRetirement() {
  const initialAmount = parseFloat(
    document
      .getElementById("initial-amount")
      .value.replace(/[R$\s.]/g, "")
      .replace(",", ".")
  );
  const monthlyAmount = parseFloat(
    document
      .getElementById("monthly-amount")
      .value.replace(/[R$\s.]/g, "")
      .replace(",", ".")
  );
  const duration = parseFloat(document.getElementById("duration").value);
  const durationType = document.getElementById("duration-type").value;
  const interestRateInput = parseFloat(
    document.getElementById("interest-rate").value.replace(",", ".")
  );
  const interestType = document.getElementById("interest-type").value;
  const interestRate =
    interestType === "annual"
      ? interestRateInput / 12 / 100
      : interestRateInput / 100;

  let totalAmount = initialAmount;
  let totalInvested = initialAmount; // Inicializa o total investido com o valor inicial
  const months = durationType === "years" ? duration * 12 : duration;
  let details = [];
  let totalInterest = 0;

  for (let i = 0; i < months; i++) {
    const aporte = i === 0 ? initialAmount + monthlyAmount : monthlyAmount;
    totalAmount += i === 0 ? monthlyAmount : aporte;
    totalInvested += i === 0 ? monthlyAmount : aporte; // Adiciona o aporte ao total investido
    const interest =
      totalAmount * (interestRate / (interestType === "annual" ? 1 : 1));
    totalAmount += interest;
    totalInterest += interest;
    details.push({
      month: i + 1,
      aporte: aporte.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      juros: interest.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      totalInvestido: totalInvested.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      total: totalAmount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    });
  }

  return { details, totalInterest };
}

function displayResults({ details, totalInterest }) {
  const resultDiv = document.getElementById("result");
  const totalAmount = details[details.length - 1].total;
  const interestRateInput = parseFloat(
    document.getElementById("interest-rate").value.replace(",", ".")
  );
  const interestType = document.getElementById("interest-type").value;
  const monthlyRate =
    interestType === "annual" ? interestRateInput / 12 : interestRateInput;
  const monthlyReturn =
    parseFloat(totalAmount.replace(/[R$\s.]/g, "").replace(",", ".")) *
    (monthlyRate / 100);

  resultDiv.innerHTML = `
    <div class="result-block-container">
      <div class="result-block">
        <p class="montserrat"><span class="icon material-icons">attach_money</span>Valor Total: <br><strong>${totalAmount}</strong></p>
      </div>
      <div class="result-block">
        <p class="montserrat"><span class="icon material-icons">trending_up</span>Rendimento Mensal (${monthlyRate.toFixed(
          2
        )}% ao mês): <br><strong>${monthlyReturn.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}</strong></p>
      </div>
      <div class="result-block">
        <p class="montserrat">Total de juros acumulados: <br><strong>${totalInterest.toLocaleString(
          "pt-BR",
          { style: "currency", currency: "BRL" }
        )}</strong></p>
      </div>
    </div>`;

  let detailsHTML = `
    <div class="overflow-x-auto">
      <table class="table-auto w-full text-xs md:text-sm">
        <thead>
          <tr>
            <th class="px-1 py-1 md:px-4 md:py-2"><span class="icon material-icons">calendar_today</span>Mês</th>
            <th class="px-1 py-1 md:px-4 md:py-2"><span class="icon material-icons">attach_money</span>Aporte</th>
            <th class="px-1 py-1 md:px-4 md:py-2"><span class="icon material-icons">bar_chart</span>Juros</th>
            <th class="px-1 py-1 md:px-4 md:py-2"><span class="icon material-icons">account_balance_wallet</span>Total Investido</th>
            <th class="px-1 py-1 md:px-4 md:py-2"><span class="icon material-icons">equalizer</span>Total</th>
          </tr>
        </thead>
        <tbody>`;

  details.forEach((detail) => {
    detailsHTML += `
      <tr>
        <td class="border px-1 py-1 md:px-4 md:py-2">${detail.month}</td>
        <td class="border px-1 py-1 md:px-4 md:py-2">${detail.aporte}</td>
        <td class="border px-1 py-1 md:px-4 md:py-2">${detail.juros}</td>
        <td class="border px-1 py-1 md:px-4 md:py-2">${detail.totalInvestido}</td>
        <td class="border px-1 py-1 md:px-4 md:py-2">${detail.total}</td>
      </tr>`;
  });

  detailsHTML += `
        </tbody>
      </table>
    </div>`;

  document.getElementById("details").innerHTML = detailsHTML;
}
