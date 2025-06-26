// Register Chart.js Data Labels plugin globally
Chart.register(ChartDataLabels);

// Scroll to table
function scrollToTable(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Format date
function formatDate(date) {
  return date.toLocaleDateString("en-GB");
}

// Generate mock table entry
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

// Populate all tables with mock data
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
    if (tbody) tbody.innerHTML = rows;
  });
}

// Replace chart canvas with image before exporting
function replaceCanvasWithImage(canvas) {
  const img = new Image();
  img.src = canvas.toDataURL("image/png");
  img.style.maxWidth = "100%";
  img.style.display = "block";
  const parent = canvas.parentElement;
  canvas.style.display = "none";
  parent.insertBefore(img, canvas);
  return img;
}

// Generate PDF and handle chart replacement
function generatePDF() {
  const barCanvas = document.getElementById('barChart');
  const barImage = barCanvas ? replaceCanvasWithImage(barCanvas) : null;

  document.body.classList.add('generate-pdf');

  const opt = {
    margin: [10, 10, 10, 10],
    filename: "NR-Portfolio-Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      logging: false,
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

  html2pdf().set(opt).from(document.getElementById("content")).save().then(() => {
    if (barCanvas && barImage) {
      barImage.remove();
      barCanvas.style.display = "block";
    }
    document.body.classList.remove('generate-pdf');
  });
}

// DOM Ready: initialize everything

document.addEventListener('DOMContentLoaded', () => {
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
      type: 'pie',
      data: {
        labels: ['Reporting', 'Not Reporting'],
        datasets: [{
          data: [2061, 115],
          backgroundColor: ['#5087bb', '#95b7df'],
          borderWidth: 0
        }]
      },
      options: pieOptions
    },
    {
      id: 'chart2',
      type: 'pie',
      data: {
        datasets: [{
          data: [3224, 159082],
          backgroundColor: ['#3c66b1', '#a3a3a3'],
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
          'SCHEDULED FOR REDO',
          'TOTAL LOSS / UNDER REPAIR',
          'THIRD PARTY SOLD'
        ],
        datasets: [{
          data: [35, 2, 54, 8, 1],
          backgroundColor: [
            '#ed7d31', '#ffc000', '#70ad47', '#9e480e', '#997300'
          ],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        layout: { padding: 30 },
        plugins: {
          legend: { display: false },
          datalabels: {
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              return ((value / total) * 100).toFixed(1) + '%';
            },
            color: '#000',
            font: { size: 12, weight: 'bold' },
            anchor: 'end',
            align: 'start',
            offset: -28,
            backgroundColor: 'transparent',
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
          {
            label: 'Total Portfolio',
            data: [2076, 2176],
            backgroundColor: '#3a6cc6'
          },
          {
            label: 'NR Count',
            data: [123, 115],
            backgroundColor: '#ee7420'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'NR Monthly Comparative Analysis' },
          datalabels: {
            anchor: 'end',
            align: 'start',
            offset: -22,
            color: '#44546a',
            font: { size: 10, weight: 'bold' }
          }
        },
        scales: { y: { beginAtZero: true } }
      },
      plugins: [ChartDataLabels]
    });
  }

  // Auto-download after delay
  setTimeout(() => {
    generatePDF();
  }, 1000);
});
