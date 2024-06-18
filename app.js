document.addEventListener("DOMContentLoaded", function () {
  const retirementForm = document.getElementById("retirement-form");
  const investmentForm = document.getElementById("investment-form");
  const inputs = document.querySelectorAll('input[type="number"]');
  const currencyInputs = document.querySelectorAll(".currency-input");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const themeIcon = document.getElementById("theme-icon");
  const accordionButton = document.querySelector(".accordion-button");
  const accordionContent = document.querySelector(".accordion-content");

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      // Remover sinais de negativo e impedir valores negativos
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
      calculateRetirement();
    }
  });

  investmentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateForm(investmentForm)) {
      calculateInvestment();
    }
  });

  themeToggle.addEventListener("change", function () {
    if (this.checked) {
      body.classList.remove("dark");
      body.classList.add("light");
      themeIcon.textContent = "nightlight_round";
    } else {
      body.classList.remove("light");
      body.classList.add("dark");
      themeIcon.textContent = "wb_sunny";
    }
  });

  accordionButton.addEventListener("click", function () {
    accordionContent.classList.toggle("show");
  });
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
    alert("Por favor, preencha todos os campos.");
  }
  return isValid;
}

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
  const interestRate =
    parseFloat(document.getElementById("interest-rate").value) / 100;
  const interestType = document.getElementById("interest-type").value;

  let totalAmount = initialAmount;
  const months = duration * 12;
  let details = [];

  for (let i = 0; i < months; i++) {
    const aporte = i === 0 ? initialAmount + monthlyAmount : monthlyAmount;
    const previousAmount = totalAmount;
    totalAmount += i === 0 ? monthlyAmount : aporte;
    const interest =
      totalAmount * (interestRate / (interestType === "annual" ? 12 : 1));
    totalAmount += interest;
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
      total: totalAmount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    });
  }

  const monthlyReturn = totalAmount * 0.01;

  document.getElementById("result").innerHTML = `
    <p class="montserrat">Valor Total: <strong>${totalAmount.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    )}</strong></p>
    <p class="montserrat">Rendimento Mensal (1% ao mês): <strong>${monthlyReturn.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    )}</strong></p>
    <p class="montserrat">Com este valor, você terá um rendimento mensal médio de <strong>${monthlyReturn.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    )}</strong>.</p>`;

  let detailsHTML = `
    <table class="table-auto w-full">
      <thead>
        <tr>
          <th class="px-4 py-2">Mês</th>
          <th class="px-4 py-2">Aporte</th>
          <th class="px-4 py-2">Juros</th>
          <th class="px-4 py-2">Valor Total</th>
        </tr>
      </thead>
      <tbody>`;

  details.forEach((detail) => {
    detailsHTML += `
      <tr>
        <td class="border px-4 py-2">${detail.month}</td>
        <td class="border px-4 py-2">${detail.aporte}</td>
        <td class="border px-4 py-2">${detail.juros}</td>
        <td class="border px-4 py-2">${detail.total}</td>
      </tr>`;
  });

  detailsHTML += `
      </tbody>
    </table>`;

  document.getElementById("details").innerHTML = detailsHTML;
}

function calculateInvestment() {
  const desiredIncome = parseFloat(
    document
      .getElementById("desired-income")
      .value.replace(/[R$\s.]/g, "")
      .replace(",", ".")
  );
  const yearsUntilRetirement = parseFloat(
    document.getElementById("years-until-retirement").value
  );

  const monthsUntilRetirement = yearsUntilRetirement * 12;
  const monthlyInterestRate = 0.01; // 1% ao mês

  // Fórmula do Valor Presente de uma anuidade
  const presentValueAnnuity =
    (desiredIncome / monthlyInterestRate) *
    (1 - Math.pow(1 + monthlyInterestRate, -monthsUntilRetirement));

  // Fórmula do Valor Futuro de uma anuidade
  const monthlyInvestment =
    presentValueAnnuity /
    ((Math.pow(1 + monthlyInterestRate, monthsUntilRetirement) - 1) /
      monthlyInterestRate);

  document.getElementById(
    "investment-result"
  ).innerHTML = `<p class="montserrat">Investimento Mensal Necessário: <strong>${monthlyInvestment.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  )}</strong></p>`;
}
