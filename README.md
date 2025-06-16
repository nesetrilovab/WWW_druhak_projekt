# 🌤️ Weather Compare

**Weather Compare** je moderní React + TypeScript aplikace na počasí, která umožňuje svým uživatelům:

- 🔍 Vyhledat a zhlédnout počasí ve městech po celém světě
- ⭐ Uložit si oblíbené lokace a zhlédnout je na samostatné stránce
- 📊 Porovnávat předpověď počasí pro více lokalit

Aplikace používá `WeatherAPI.com` pro "live" informace o počasí. Pro ukládání oblíbených lokací používá Local Storage.

---

## 🧭 Stránky & Featury

### `/` Home Page
- Zhlédnout karty s informacemi o počasí pro více měst najednou
- Dynamické přidávání nových karet
- Označit lokaci jako oblíbenou
- Přesměrovat na oblíbené a předpovědi

### `/favorites` Favorites Page
- Zhlédnout "live" informace o počasí pro oblíbená města
- Karty se updatují skrz API 
- Každý "oblíbenec" je schovaný v `localStorage`

### `/forecast` Forecast Page
- Dynamické přidávání nových karet
- Zhlédnout předpověď pro libovolná města (průměrná teplota)

### Základní logika
- Na každé stránce jsou navigační tlačítka, která přesměrují uživatele
- Neomezený počet karet pro porovnání počasí
- Ve vyhledávacím řádku funguje tzv. "suggestion completion", tedy aplikace uživateli nabízí platné možnosti
- tzn. je zde event handler onKeyDown(), který po každém úhozu zavolá metodu, která fetchuje návrhy
- Po stisknutí tlačítka "search" nebo klávesy enter se fetchnou data z api podle zadané lokace
- Předpověď počasí funguje obdobně