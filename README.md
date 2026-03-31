# 🥤 Cola Notiser

Webbapp som automatiskt bevakar Coca-Cola och Pepsi Max-erbjudanden hos svenska butiker.

**👉 [moorrss.github.io/cola-notiser](https://moorrss.github.io/cola-notiser)**

## Butiker
- 🔵 Lidl
- 🟠 Supergrossen

## Hur det fungerar
- GitHub Actions kontrollerar Tjek-API:t varje timme
- Nya erbjudanden sparas i `offers.json`
- Sidan visar alla aktiva erbjudanden
- Webbnotiser skickas när nya erbjudanden hittas (kräver att notiser är aktiverade i webbläsaren)
