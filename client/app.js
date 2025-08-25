// Simple client for the Flask API
// Adjust base URL if your backend runs elsewhere
const API_BASE = 'http://127.0.0.1:5000';

function getBathValue() {
  const selected = document.querySelector('input[name="uiBathrooms"]:checked');
  return selected ? parseInt(selected.value) : -1;
}

function getBHKValue() {
  const selected = document.querySelector('input[name="uiBHK"]:checked');
  return selected ? parseInt(selected.value) : -1;
}

function onClickedEstimatePrice() {
  const sqftEl = document.getElementById('uiSqft');
  const bhk = getBHKValue();
  const bathrooms = getBathValue();
  const locationEl = document.getElementById('uiLocations');
  const estPrice = document.getElementById('uiEstimatedPrice');

  const sqft = parseFloat(sqftEl.value);
  const location = locationEl.value;

  if (!sqft || sqft <= 0 || bhk <= 0 || bathrooms <= 0 || !location) {
    estPrice.innerHTML = '<span style="color:#b91c1c">Please provide valid inputs.</span>';
    return;
  }

  const url = API_BASE + '/predict_home_price';

  $.post(
    url,
    {
      total_sqft: sqft,
      bhk: bhk,
      bath: bathrooms,
      location: location,
    },
    function (data, status) {
      if (status === 'success' && data && typeof data.estimated_price !== 'undefined') {
        estPrice.innerHTML = '<h2>' + data.estimated_price.toString() + ' Lakh</h2>';
      } else {
        estPrice.innerHTML = '<span style="color:#b91c1c">Failed to get estimate.</span>';
      }
    }
  ).fail(function () {
    estPrice.innerHTML = '<span style="color:#b91c1c">Server error. Is the backend running?</span>';
  });
}

function onPageLoad() {
  const url = API_BASE + '/get_location_names';
  $.get(url, function (data, status) {
    if (status === 'success' && data && Array.isArray(data.locations)) {
      const uiLocations = document.getElementById('uiLocations');
      $('#uiLocations').empty();
      data.locations.forEach(function (loc) {
        const opt = new Option(loc, loc);
        $('#uiLocations').append(opt);
      });
    }
  }).fail(function () {
    console.warn('Could not load locations. Check if backend is running.');
  });
}

window.onload = onPageLoad;


