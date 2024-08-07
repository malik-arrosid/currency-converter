document.addEventListener('DOMContentLoaded', () => {
  const amountInput = document.getElementById('amount-input');
  const fromCurrencySelect = document.getElementById('from-currency');
  const toCurrencySelect = document.getElementById('to-currency');
  const resultParagraph = document.getElementById('result');
  const convertButton = document.getElementById('convert-button');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'IDR', 'AUD'];
  let amount = 1;
  let fromCurrency = 'USD';
  let toCurrency = 'IDR';
  let conversionResult = null;

  // Populate currency options
  currencies.forEach(currency => {
    const fromOption = document.createElement('option');
    fromOption.value = currency;
    fromOption.textContent = currency;
    fromCurrencySelect.appendChild(fromOption);

    const toOption = document.createElement('option');
    toOption.value = currency;
    toOption.textContent = currency;
    toCurrencySelect.appendChild(toOption);
  });

  // Set default values
  fromCurrencySelect.value = fromCurrency;
  toCurrencySelect.value = toCurrency;

  // Function to format numbers with thousand separators
  function formatCurrency(number) {
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(number);
  }

  // Update amount and format
  function updateAmount(value) {
    // Clean the input value
    const cleanValue = value.replace(/\./g, '').replace(/,/g, '.');
    const floatAmount = parseFloat(cleanValue);
    if (!isNaN(floatAmount)) {
      amount = floatAmount;
      amountInput.value = formatCurrency(floatAmount);
    } else {
      amountInput.value = ''; // Clear input if not a number
    }
    // Clear result when input changes
    resultParagraph.textContent = '';
  }

  // Fetch exchange rate and convert
  async function convert() {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      const data = await response.json();
      const rate = data.rates[toCurrency];
      conversionResult = (amount * rate).toFixed(2);
      resultParagraph.textContent = `${formatCurrency(amount)} ${fromCurrency} = ${formatCurrency(parseFloat(conversionResult))} ${toCurrency}`;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      resultParagraph.textContent = 'Error fetching exchange rate';
    }
  }

  // Event listeners
  amountInput.addEventListener('input', (e) => updateAmount(e.target.value));
  fromCurrencySelect.addEventListener('change', (e) => {
    fromCurrency = e.target.value;
    resultParagraph.textContent = ''; // Clear result when currency changes
  });
  toCurrencySelect.addEventListener('change', (e) => {
    toCurrency = e.target.value;
    resultParagraph.textContent = ''; // Clear result when currency changes
  });
  convertButton.addEventListener('click', convert);

  // Initial view
  amountInput.value = ''; // Clear initial amount
  resultParagraph.textContent = ''; // Ensure result is clear on page load
});
