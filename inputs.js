document.addEventListener("DOMContentLoaded", function () {
    const retirementForm = document.getElementById("retirement-form");
    const inputs = document.querySelectorAll('input[type="number"]');
    const currencyInputs = document.querySelectorAll(".currency-input");
    const accordionButton = document.querySelector(".accordion-button");
    const accordionContent = document.querySelector(".accordion-content");
  
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
      }
    });
  
    accordionButton.addEventListener("click", function () {
      accordionContent.classList.toggle("show");
    });
  
    document.getElementById("download-chart").addEventListener("click", function () {
      const link = document.createElement("a");
      link.href = document.getElementById("myChart").toDataURL("image/png");
      link.download = "grafico_aposentadoria.png";
      link.click();
    });
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
      if (
        input.value === "" ||
        input.value == null ||
        parseFloat(input.value.replace(/[R$\s.]/g, "").replace(",", ".")) <= 0
      ) {
        isValid = false;
        input.classList.add("border-red-500");
      } else {
        input.classList.remove("border-red-500");
      }
    });
  
    if (!isValid) {
      alert("Por favor, preencha todos os campos corretamente.");
    }
    return isValid;
  }
  