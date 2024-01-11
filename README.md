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
      "value": "152.83",
      "price": "160.79",
      "pvp": "1.05",
      "dy": "0.68",
      "dy12m": "9.17",
      "vacancy": "0.10",
      "sector": "Logístico / Indústria / Galpões",
      "cnpj": "11.728.688/0001-47",
      "properties": "N/A"
    }
```
  
- Stock Data

```javascript
    {
      "ticker": "ABEV3",
      "dy": "5.4",
      "roe": "16.7",
      "roic": "16.5",
      "eve": "9.00",
      "pl": "14.71",
      "pvp": "2.46",
      "lpa": "0.96",
      "price": "14.08"
    }
```

## License
MIT

## Author
[Fernando Almeida] (fernando.c.almeida@gmail.com)
