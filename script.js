 var startDateInput = document.getElementById("startDate");
    var endDateInput = document.getElementById("endDate");
    let principle = document.getElementById("principle");
    let outputBox = document.getElementById("output");
    let rate = document.getElementById("rate");
    let mm = document.querySelector("[data-month]");
    let dd = document.querySelector("[data-day]");
    let intout = document.querySelector("[data-intrest]");
    let totalout = document.querySelector("[data-total]");
    let acuday = document.querySelector("[data-accuday]");
    let acuout = document.querySelector("[data-accu]");
    let chartBox = document.querySelector('.chart')


    function startMe() {
      document.getElementById('hidden').click()
    }

    document.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      calculateDays()
    })
    function calculateDays() {
      var startDate = new Date(startDateInput.value);
      var endDate = new Date(endDateInput.value);


      var timeDifference = endDate.getTime() - startDate.getTime();

      var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      if (daysDifference < 0) {
        alert("INVALID DATE ")
        return
      }
      let month = Math.floor(daysDifference / 30);
      let days = daysDifference % 30;
      mm.innerHTML = month;
      dd.innerHTML = days;
      acuday.innerHTML = `(${days} days)`;
      calculateIntrest(principle.value, rate.value, month, days);
    }
    let oneMonthIntrest
    function calculateIntrest(p, r, m, d) {
      p = convertToNumber(removeCommas(p));
      let int = Math.floor((p * r * m) / 100);
      let oneDayIntrest = Math.abs((p * r) / 100 / 30);
      oneMonthIntrest = Math.abs(p * r / 100)
     
      intout.innerHTML = formatNumberWithCommas(int);
      totalout.innerHTML = formatNumberWithCommas(Math.floor(int + p));
      acuout.innerHTML = formatNumberWithCommas(
        Math.floor(oneDayIntrest * d + int)
      );

      outputBox.classList.add("expand");

     getAllMonthsAndYears(startDateInput.value, endDateInput.value)
    }

    function getAllMonthsAndYears(startDate, endDate) {
      var currentDate = new Date(startDate);
      var end = new Date(endDate);
      var monthsAndYears = [];
      let i = -1
      while (currentDate <= end) {
        i++
        let intt = Math.abs(i * oneMonthIntrest + convertToNumber(removeCommas(principle.value)))
        var month = currentDate.toLocaleString('default', {month: 'long'});
        var year = currentDate.getFullYear();

        monthsAndYears.push({month: month, year: year, Intrest: intt});

        // Move to the next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      dataMain = monthsAndYears
      generateChart(monthsAndYears);
      chartBox.classList.add('show')
      return monthsAndYears;
    }




    var lineChart;
    function generateChart(data, chartType) {
      var labels = data.map(entry => entry.month + ' ' + entry.year);
      var interestData = data.map(entry => entry.Intrest);

      var chartData = {
        labels: labels,
        datasets: [{
          label: 'Interest',
          data: interestData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: '#4545fe',
          borderWidth: 1
        }]
      };

      var chartOptions = {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

      // Get the selected chart type from the select input
      var selectedChartType = chartType || document.getElementById('chartTypeSelect').value;

      if (lineChart) {
        lineChart.data = chartData;
        lineChart.options = chartOptions;
        lineChart.config.type = selectedChartType; // Change the chart type dynamically
        lineChart.update();
      } else {
        var ctx = document.getElementById('chart').getContext('2d');
        lineChart = new Chart(ctx, {
          type: selectedChartType,
          data: chartData,
          options: chartOptions
        });
      }
    }

    // Event listener for select input change
    // Event listener for select input change
    document.getElementById('chartTypeSelect').addEventListener('change', function () {
      var selectedChartType = this.value;
      updateChart(selectedChartType);
    });


    function updateChart(chartType) {
      if (lineChart) {
        lineChart.config.type = chartType;
        lineChart.update();
      }
    }


    //Helper functions 

    function removeCommas(number) {
      return number.replace(/,/g, "");
    }

    function convertToNumber(string) {
      return parseInt(string);
    }


    function formatNumberWithCommas(number) {
      return number.toLocaleString();
    }


    rate.addEventListener('input', function () {
      var inputValue = this.value;
      inputValue = inputValue.replace(/^0+/, '');
      inputValue = inputValue.slice(0, 2);
      this.value = inputValue;
    });



if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(function(error) {
        console.log('Service Worker registration failed:', error);
      });
  });
}
