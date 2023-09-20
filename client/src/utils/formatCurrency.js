const currencyFormat = new Intl.NumberFormat('en-us', {
  currency: 'USD',
  style: 'currency',

})

export function formatCurrency(number)
{
  return currencyFormat.format(number)
}
//you can specify the parameter in front of the numberformat as undefined and dont give currency type so 
//it can pick the currency of the person region