const getCurrentCoinQuotation = async () => {
  const response = await fetch('https://economia.awesomeapi.com.br/json/all');
  const quotation = await response.json();

  return quotation;
};

export default getCurrentCoinQuotation;
