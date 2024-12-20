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
        },
        {
          label: "Total Investido",
          data: investedValues,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          yAxisID: "y",
        },
        {
          label: "Juros Acumulados (Mês)",
          data: interestValues,
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          yAxisID: "y1",
        },
        {
          label: "Juros Totais Acumulados",
          data: accumulatedInterestValues,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          yAxisID: "y1",
        },
      ],
    };
  
    function createChartConfig(isMobile) {
      return {
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
                maxRotation: isMobile ? 90 : 0,
                minRotation: isMobile ? 90 : 0,
                font: {
                  family: "Inter", // Define the font family to Inter
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
                  size: 14, // Increase the font size
                },
              },
              ticks: {
                font: {
                  family: "Inter", // Define the font family to Inter
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
                  size: 14, // Increase the font size
                },
              },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                font: {
                  family: "Inter", // Define the font family to Inter
                },
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
                  family: "Inter", // Define the font family to Inter
                  size: 14, // Increase the font size
                },
                padding: isMobile ? 10 : 0,
              },
              // Adicione as classes CSS aos labels
              generateLabels: function (chart) {
                const labels =
                  Chart.defaults.plugins.legend.labels.generateLabels(chart);
                labels.forEach((label, index) => {
                  switch (label.text) {
                    case "Valor Total":
                      label.text = "Valor Total";
                      label.fillStyle = "#4bc0c0";
                      break;
                    case "Total Investido":
                      label.text = "Total Investido";
                      label.fillStyle = "#9966ff";
                      break;
                    case "Juros Acumulados (Mês)":
                      label.text = "Juros Acumulados (Mês)";
                      label.fillStyle = "#ff9f40";
                      break;
                    case "Juros Totais Acumulados":
                      label.text = "Juros Totais Acumulados";
                      label.fillStyle = "#36a2eb";
                      break;
                  }
                  // Adicionar espaçamento entre os labels
                  if (index > 0) {
                    label.y += 10; // Ajuste o valor conforme necessário
                  }
                });
                return labels;
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "rgba(255, 255, 255, 1)",
              bodyColor: "rgba(255, 255, 255, 1)",
              borderColor: "rgba(255, 255, 255, 1)",
              borderWidth: 1,
              padding: {
                top: 10,
                right: 15,
                bottom: 10,
                left: 15,
              },
              itemSpacing: 10,
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
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "xy",
              },
            },
          },
        },
      };
    }
  
    let chartInstance = new Chart(
      ctx,
      createChartConfig(window.innerWidth <= 768)
    );
  
    window.addEventListener("resize", function () {
      const isMobile = window.innerWidth <= 768;
      chartInstance.destroy();
      chartInstance = new Chart(ctx, createChartConfig(isMobile));
    });
  }