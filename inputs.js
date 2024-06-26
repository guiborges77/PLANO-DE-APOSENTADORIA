document.addEventListener("DOMContentLoaded", function () {
    const retirementForm = document.getElementById("retirement-form");
    const inputs = document.querySelectorAll('input[type="number"]');
    const currencyInputs = document.querySelectorAll(".currency-input");
    const accordionButton = document.querySelector(".accordion-button");
    const accordionContent = document.querySelector(".accordion-content");
    const resultContainer = document.getElementById("result");
    const detailsContainerButton = document.getElementById("details_container_button");
    const downloadChartButton = document.getElementById("download-chart");
  
    loadFormData();
  
    // Inicialmente, esconde os botões de mostrar detalhes e download de gráfico
    detailsContainerButton.style.display = "none";
    downloadChartButton.style.display = "none";
  
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
        calculateRetirement();
        showSuccessMessage("Cálculo realizado com sucesso!");
        saveFormData();
        detailsContainerButton.style.display = "block"; // Mostra o botão após o cálculo
        downloadChartButton.style.display = "block"; // Mostra o botão de download após o cálculo
      } else {
        showErrorMessage("Por favor, preencha todos os campos corretamente.");
      }
    });
  
    accordionButton.addEventListener("click", function () {
      if (accordionContent.classList.contains("show")) {
        accordionContent.classList.remove("show");
        accordionContent.classList.add("hide");
        accordionContent.addEventListener("animationend", () => {
          if (accordionContent.classList.contains("hide")) {
            accordionContent.style.display = "none";
          }
        }, { once: true });
      } else {
        accordionContent.classList.remove("hide");
        accordionContent.classList.add("show");
        accordionContent.style.display = "block";
      }
    });
  
    document.getElementById("download-chart").addEventListener("click", function () {
      const link = document.createElement("a");
      link.href = document.getElementById("myChart").toDataURL("image/png");
      link.download = "grafico_aposentadoria.png";
      link.click();
    });
  
    function showSuccessMessage(message) {
      resultContainer.innerHTML = `<p class="success-message">${message}</p>`;
      resultContainer.classList.add("show");
      setTimeout(() => {
        resultContainer.classList.remove("show");
      }, 3000);
    }
  
    function showErrorMessage(message) {
      resultContainer.innerHTML = `<p class="error-message">${message}</p>`;
      resultContainer.classList.add("show");
      setTimeout(() => {
        resultContainer.classList.remove("show");
      }, 3000);
    }
  
    function saveFormData() {
      const formData = {
        initialAmount: document.getElementById("initial-amount").value,
        monthlyAmount: document.getElementById("monthly-amount").value,
        duration: document.getElementById("duration").value,
        interestRate: document.getElementById("interest-rate").value,
        interestType: document.getElementById("interest-type").value,
      };
      localStorage.setItem("retirementFormData", JSON.stringify(formData));
    }
  
    function loadFormData() {
      const savedData = localStorage.getItem("retirementFormData");
      if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById("initial-amount").value = formData.initialAmount;
        document.getElementById("monthly-amount").value = formData.monthlyAmount;
        document.getElementById("duration").value = formData.duration;
        document.getElementById("interest-rate").value = formData.interestRate;
        document.getElementById("interest-type").value = formData.interestType;
      }
    }
  });
  
  function formatCurrencyInput(input) {
    const value = input.value.replace(/\D/g, "");
    const options = {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    };
    const formattedValue = new Intl.NumberFormat("pt-BR", options).format(value / 100);
    input.value = formattedValue;
  }
  
  function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      const inputValue = parseFloat(input.value.replace(/[R$\s.]/g, "").replace(",", "."));
      if (
        (input.id !== "initial-amount" && (input.value === "" || input.value == null || inputValue <= 0)) ||
        (input.id === "initial-amount" && (input.value !== "" && inputValue < 0))
      ) {
        isValid = false;
        input.classList.add("border-red-500");
      } else {
        input.classList.remove("border-red-500");
      }
    });
  
    return isValid;
  }
  