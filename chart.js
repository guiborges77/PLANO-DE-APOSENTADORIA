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
    let totalInvested = initialAmount; // Inicializa o total investido com o valor inicial
    const months = duration * 12;
    let details = [];
  
    for (let i = 0; i < months; i++) {
      const aporte = i === 0 ? initialAmount + monthlyAmount : monthlyAmount;
      const previousAmount = totalAmount;
      totalAmount += i === 0 ? monthlyAmount : aporte;
      totalInvested += i === 0 ? monthlyAmount : aporte; // Adiciona o aporte ao total investido
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
      <div class="overflow-x-auto">
        <table class="table-auto w-full text-xs md:text-sm">
          <thead>
            <tr>
              <th class="px-1 py-1 md:px-4 md:py-2">Mês</th>
              <th class="px-1 py-1 md:px-4 md:py-2">Aporte</th>
              <th class="px-1 py-1 md:px-4 md:py-2">Juros</th>
              <th class="px-1 py-1 md:px-4 md:py-2">Total Investido</th>
              <th class="px-1 py-1 md:px-4 md:py-2">Total</th>
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
    displayGraph(details);
  }
  
  function displayGraph(details) {
    const ctx = document.getElementById("myChart").getContext("2d");
  
    const labels = details.map((detail) => `Mês ${detail.month}`);
    const totalValues = details.map((detail) =>
      parseFloat(detail.total.replace(/[R$\s.]/g, "").replace(",", "."))
    );
    const investedValues = details.map((detail) =>
      parseFloat(detail.totalInvestido.replace(/[R$\s.]/g, "").replace(",", "."))
    );
    const interestValues = details.map((detail) =>
      parseFloat(detail.juros.replace(/[R$\s.]/g, "").replace(",", "."))
    );
  
    // Calculando o total de juros acumulados ao longo do tempo
    let accumulatedInterest = 0;
    const accumulatedInterestValues = interestValues.map((value) => {
      accumulatedInterest += value;
      return accumulatedInterest;
    });
  
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Valor Total",
          data: totalValues,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          yAxisID: "y",
          font: {
            family: "Inter",
            size: 16,
            weight: "bold",
          },
        },
        {
          label: "Total Investido",
          data: investedValues,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          yAxisID: "y",
          font: {
            family: "Inter",
            size: 16,
            weight: "bold",
          },
        },
        {
          label: "Juros Acumulados (Mês)",
          data: interestValues,
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          yAxisID: "y1",
          font: {
            family: "Inter",
            size: 16,
            weight: "bold",
          },
        },
        {
          label: "Juros Totais Acumulados",
          data: accumulatedInterestValues,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          yAxisID: "y1",
          font: {
            family: "Inter",
            size: 16,
            weight: "bold",
          },
        },
      ],
    };
  
    new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              font: {
                family: "Inter",
                size: 16,
              },
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Valor (R$)",
              font: {
                family: "Inter",
                size: 16,
              },
            },
            ticks: {
              font: {
                family: "Inter",
                size: 16,
              },
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Juros (R$)",
              font: {
                family: "Inter",
                size: 16,
              },
            },
            ticks: {
              font: {
                family: "Inter",
                size: 16,
              },
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: 15,
              boxHeight: 15,
              font: {
                family: "Inter",
                size: 16,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "rgba(255, 255, 255, 1)",
            bodyColor: "rgba(255, 255, 255, 1)",
            borderColor: "rgba(255, 255, 255, 1)",
            borderWidth: 1,
            titleFont: {
              family: "Inter",
              size: 16,
              weight: "bold",
            },
            bodyFont: {
              family: "Inter",
              size: 16,
              weight: "normal",
            },
            padding: {
              top: 10,
              right: 15,
              bottom: 10,
              left: 15,
            },
            itemSpacing: 10, // Adiciona espaçamento entre os itens do tooltip
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.dataset.label === "Juros Acumulados (Mês)") {
                  const totalInterest =
                    accumulatedInterestValues[context.dataIndex];
                  label += context.parsed.y.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  });
                  label += ` (Total: ${totalInterest.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })})`;
                } else {
                  label += context.parsed.y.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  });
                }
                return label;
              },
            },
          },
          zoom: {
            pan: {
              enabled: true,
              mode: "xy",
            },
            zoom: {
              wheel: {
                enabled: true, // Habilita zoom com a roda do mouse
              },
              drag: {
                enabled: false, // Desabilita zoom com arrasto
              },
              pinch: {
                enabled: true, // Habilita zoom com pinça
              },
              mode: "xy",
            },
          },
        },
      },
    });
  }
  