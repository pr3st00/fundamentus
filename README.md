# fundamentus

Retrieves market data for Brazilian stocks and fiis.

## Description

Retrieves Brazilian stocks & Fiis (Brazilian reits counterparts) financial data.

## Endpoints

| URI                    | Method | Description                                     |
|------------------------|--------|-------------------------------------------------|
| /fii/#ticker#          | GET    | Returns data for the FII with ticker <ticker>   |
| /fii?ticker=#ticker#   | GET    | Returns data for the FII with ticker <ticker>   |
| /stock/#ticker#        | GET    | Returns data for the stock with ticker <ticker> |
| /stock?ticker=#ticker# | GET    | Returns data for the stock with ticker <ticker> |

## Sample responses

- FII Data

```javascript
    {
      "ticker": "hglg11",
      "value": "166.58",
      "price": "157.23",
      "pvp": "0.94",
      "dy": "0.70",
      "dy12m": "8.40",
      "vacancy": "0.02",
      "tax": "0.60",
      "sector": "Logístico / Indústria / Galpões",
      "cnpj": "11.728.688/0001-47",
      "properties": "28"
    } 
```
  
- Stock Data

```javascript
    {
      "ticker": "abev3",
      "dy": "6.9",
      "roe": "17.6",
      "roic": "19.8",
      "eve": "8.93",
      "pl": "16.44",
      "pvp": "2.90",
      "lpa": "0.98",
      "price": "16.17"
   }
```

## License
MIT

## Author
[Fernando Almeida] (fernando.c.almeida@gmail.com)
