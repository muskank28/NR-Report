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

function generateEntry(i, tableId = "") {
  const reg = `BNP ${100 * parseInt(tableId.replace('datatable', '')) + i}`;
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

function populateTables() {
  const mockData = {
    datatable1: 30,
    datatable2: 2,
    datatable3: 28,
    datatable4: 47,
    datatable5: 7,
    datatable6: 1
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
});
// Chart rendering
document.addEventListener("DOMContentLoaded", () => {
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
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          size: 11,
          weight: 'bold'
        },
        anchor: 'end',
        align: 'end',
        formatter: (value, context) => {
          return value.toLocaleString(); // e.g. "3,224"
        }
      }
    },
    layout: {
      padding: 10
    }
  }
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
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#000',
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: 15
        }
      },
      datalabels: {
        color: '#000',
        font: {
          weight: 'bold',
          size: 11
        },
        anchor: 'end',
        align: 'end',
        formatter: (value) => value.toLocaleString()  // e.g. 65,643
      }
    },
    layout: {
      padding: 10
    },
    cutout: '60%' // creates the doughnut hole
  }
},
    {
      id: 'nrPortfolioChart',
      type: 'pie',
      data: {
        datasets: [
          {
            data: [35, 2, 1, 8, 54],
            backgroundColor: ['#f44336', '#ff9800', '#9c27b0', '#4caf50', '#3f51b5']
          }
        ]
      }
    }
  ];

  chartConfigs.forEach(config => {
    const ctx = document.getElementById(config.id);
    if (ctx) {
      new Chart(ctx, {
        type: config.type,
        data: config.data,
        options: pieOptions
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

// Scroll to top for Home Page button
document.querySelectorAll("button").forEach(btn => {
  if (btn.textContent.includes("Home Page")) {
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// To generate PDF with proper page breaks
function generatePDF() {
  const element = document.getElementById("content");

  // Expand all tables before PDF
  const tables = document.querySelectorAll('.display');
  tables.forEach(table => {
    if ($.fn.DataTable.isDataTable(table)) {
      const dt = $(table).DataTable();
      dt.responsive.recalc(); // force expansion
      dt.page.len(-1).draw(); // show all rows
    }
  });

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

  // Allow rendering to settle before download
  setTimeout(() => {
    html2pdf().set(opt).from(element).save().then(() => {
      // Restore original pagination after export
      tables.forEach(table => {
        const dt = $(table).DataTable();
        dt.page.len(25).draw(); // restore original page length
      });
    });
  }, 1000); // wait for table redraw
}
