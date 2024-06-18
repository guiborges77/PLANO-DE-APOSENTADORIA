document.addEventListener("DOMContentLoaded", function () {
  const retirementForm = document.getElementById("retirement-form");
  const investmentForm = document.getElementById("investment-form");
  const inputs = document.querySelectorAll('input[type="number"]');
  const currencyInputs = document.querySelectorAll(".currency-input");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const themeIcon = document.getElementById("theme-icon");

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
    calculateRetirement();
  });

  investmentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    calculateInvestment();
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

  if (interestType === "monthly") {
    for (let i = 0; i < months; i++) {
      totalAmount += monthlyAmount;
      totalAmount *= 1 + interestRate;
    }
  } else if (interestType === "annual") {
    const monthlyInterestRate = interestRate / 12;
    for (let i = 0; i < months; i++) {
      totalAmount += monthlyAmount;
      totalAmount *= 1 + monthlyInterestRate;
    }
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
  ).innerText = `Investimento Mensal Necessário: ${monthlyInvestment.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  )}`;
}
