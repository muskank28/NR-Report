// Register Data Labels plugin globally
Chart.register(ChartDataLabels);

// Utility: Scroll to table
function scrollToTable(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Utility: Format date to DD/MM/YYYY
function formatDate(date) {
  return date.toLocaleDateString("en-GB");
}

// Generate table row entry
function generateEntry(i, tableId = "") {
  const reg = `BNP ${100 * parseInt(tableId.replace('table', '')) + i}`;
  const name = 'Ali';
  const make = "Honda Civic";
  const engine = `Q${100000 + i}`;
  const chassis = `ZRE${1000000 + i}`;
  const model = "2018";
  const nrDate = new Date(2018, 11, (1 + (i % 28)));
  const aging = 28 - nrDate.getDate();

  return `
        <tr>
          <td>${i}</td>
          <td>${reg}</td>
          <td>${name}</td>
          <td>${make}</td>
          <td>${engine}</td>
          <td>${chassis}</td>
          <td>${model}</td>
          <td>${formatDate(nrDate)}</td>
          <td>${aging}</td>
        </tr>`;
}

// Populate mock table data
function populateTables() {
  const mockData = {
    table1: 30,
    table2: 2,
    table3: 28,
    table4: 40,
    table5: 7,
    table6: 1
  };

  Object.entries(mockData).forEach(([tableId, count]) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    let rows = "";
    for (let i = 1; i <= count; i++) {
      rows += generateEntry(i, tableId);
    }
    tbody.innerHTML = rows;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll("button").forEach(btn => {
    if (btn.textContent.includes("Home Page")) {
      btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });

  populateTables();

  const pieOptions = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const data = context.chart.data.datasets[0].data;
          const total = data.reduce((sum, val) => sum + val, 0);
          return ((value / total) * 100).toFixed(1) + '%';
        },
        color: '#fff',
        font: { weight: 'bold' }
      }
    }
  };

  const chartConfigs = [
    {
      id: 'chart1',
      type: 'doughnut',
      data: {
        labels: ['Reporting', 'Not Reporting'],
        datasets: [{
          data: [2061, 115],
          backgroundColor: ['#2196f3', '#9e9e9e'],
          borderWidth: 0
        }]
      },
      options: pieOptions
    },
    {
      id: 'chart2',
      type: 'doughnut',
      data: {
        labels: ['Configure', 'Total', 'Pending'],
        datasets: [{
          data: [3224, 159082, 65643],
          backgroundColor: ['#00e676', '#2196f3', '#9e9e9e'],
          borderWidth: 0
        }]
      },
      options: pieOptions
    },
    {
      id: 'nrPortfolioChart',
      type: 'pie',
      data: {
        labels: [
          'NO CONTACT / NON-COOPERATIVE',
          'LOW GSM/NON GSM AREA',
          'PARKED FOR PROLONGED PERIOD',
          'SCHEDULED FOR REDO',
          'TOTAL LOSS / UNDER REPAIR',
          'THIRD PARTY SOLD'
        ],
        datasets: [{
          data: [30, 2, 28, 7, 47, 1],
          backgroundColor: [
            '#8e24aa', '#43a047', '#fb8c00', '#1e88e5', '#f44336', '#6d4c41'
          ],
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        layout: {
          padding: 30
        },
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percent = ((value / total) * 100).toFixed(1);
              return `${percent}%`;
            },
            color: '#000',
            font: {
              size: 12,
              weight: 'bold'
            },
            anchor: 'end',
            align: 'start',
            offset: -28,
            backgroundColor: 'transparent',
            borderWidth: 0,
            callout: {
              display: true,
              borderColor: '#999',
              borderWidth: 1,
              side: 'bottom',
              length: 15
            },
            clamp: true,
            padding: 0,
            clip: false
          }
        }
      },
      plugins: [ChartDataLabels]
    }
  ];

  chartConfigs.forEach(config => {
    const ctx = document.getElementById(config.id);
    if (ctx) {
      new Chart(ctx, {
        type: config.type,
        data: config.data,
        options: config.options,
        plugins: config.plugins || [ChartDataLabels]
      });
    }
  });

  const barCanvas = document.getElementById('barChart');
  if (barCanvas) {
    new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: ['30 Days Earlier', 'Today'],
        datasets: [
          { label: 'Total Portfolio', data: [2076, 2176], backgroundColor: '#2196f3' },
          { label: 'NR Count', data: [123, 115], backgroundColor: '#f44336' }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'NR Monthly Comparative Analysis' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
});

// Generate PDF
// function generatePDF() {
//     document.body.classList.add('generate-pdf');
//   const element = document.getElementById("content");

//   const opt = {
//     margin: [10, 10, 10, 10],
//     filename: "NR-Portfolio-Report.pdf",
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: {
//       scale: 2,
//       logging: true,
//       useCORS: true,
//       allowTaint: true,
//       scrollY: 0,
//       windowWidth: document.body.scrollWidth
//     },
//     jsPDF: {
//       unit: "mm",
//       format: "a4",
//       orientation: "portrait"
//     },
//     pagebreak: {
//       mode: ['avoid-all', 'css', 'legacy'],
//       before: '.page-break-before',
//       after: '.page-break-after',
//       avoid: '.no-break'
//     }
//   };
// html2pdf().set(opt).from(document.getElementById("content")).save().then(() => {
//     document.body.classList.remove('generate-pdf');
//   });
//   html2pdf().set(opt).from(element).save();
// }

function generatePDF() {
  // Convert bar chart to image
  const barCanvas = document.getElementById('barChart');
  const barContainer = barCanvas?.parentElement;
  let barImage;

  if (barCanvas && barContainer) {
    const imgData = barCanvas.toDataURL('image/png');
    barImage = new Image();
    barImage.src = imgData;
    barImage.style.maxWidth = "100%";
    barImage.style.display = "block";
    barCanvas.style.display = "none";
    barContainer.insertBefore(barImage, barCanvas);
  }

  // Add PDF styling class
  document.body.classList.add('generate-pdf');

  const element = document.getElementById("content");

  const opt = {
    margin: [10, 10, 10, 10],
    filename: "NR-Portfolio-Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      logging: true,
      useCORS: true,
      allowTaint: true,
      scrollY: 0,
      windowWidth: document.body.scrollWidth
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: '.no-break'
    }
  };

  // First PDF render pass
  html2pdf().set(opt).from(document.getElementById("content")).save().then(() => {
    // Restore original bar chart
    if (barCanvas && barImage) {
      barImage.remove();
      barCanvas.style.display = "block";
    }
    document.body.classList.remove('generate-pdf');
  });

  // Second PDF render pass (as per your original logic)
}
