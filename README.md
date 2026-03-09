# Stremio CSFD.cz Ratings Addon

Tento addon zobrazuje hodnocení filmů a seriálů z [ČSFD.cz](https://www.csfd.cz) přímo ve Stremio.

- ⭐ Hodnocení se zobrazí jako hvězdičkové skóre na dlaždici filmu
- 📝 V detailu filmu uvidíte CSFD procenta a odkaz na CSFD stránku

---

## Jak nainstalovat

### 1. Nainstalujte Node.js

Addon běží na Node.js (verze 18 nebo novější). Pokud ho ještě nemáte:

1. Jděte na [nodejs.org](https://nodejs.org)
2. Stáhněte verzi **LTS** (doporučená)
3. Nainstalujte — stačí proklikat instalátor

Ověření, že máte Node.js nainstalovaný — otevřete Terminál (macOS/Linux) nebo Příkazový řádek (Windows) a napište:

```
node --version
```

Mělo by se zobrazit číslo verze (např. `v20.11.0`).

### 2. Stáhněte addon

**Varianta A — přes Git:**

```
git clone https://github.com/TommyBandana/stremio-csfd-ratings.git
cd stremio-csfd-ratings
```

**Varianta B — bez Gitu:**

1. Na této stránce klikněte na zelené tlačítko **Code** → **Download ZIP**
2. Rozbalte ZIP soubor kamkoliv na disk
3. Otevřete Terminál/Příkazový řádek a přejděte do rozbalené složky:
   ```
   cd cesta/ke/složce/stremio-csfd-ratings
   ```

### 3. Nainstalujte závislosti

Ve složce s addonem spusťte:

```
npm install
```

Počkejte, než se instalace dokončí.

### 4. Spusťte addon

```
node index.js
```

Uvidíte zprávu:

```
CSFD Ratings addon running on http://localhost:7000
```

**Důležité:** Tento terminál nechte otevřený! Addon běží, dokud ho nezavřete.

### 5. Vytvořte HTTPS tunel

Stremio vyžaduje HTTPS adresu pro instalaci addonu. Použijeme **localtunnel**, který zdarma vytvoří HTTPS adresu pro váš lokální addon.

Otevřete **druhý terminál** (první nechte běžet s addonem) a spusťte:

```
npx localtunnel --port 7000
```

Při prvním spuštění se vás zeptá, zda chcete nainstalovat `localtunnel` — potvrďte **y** (ano).

Po spuštění se zobrazí HTTPS adresa, například:

```
your url is: https://nice-fish-42.loca.lt
```

**Poznámka:** Při prvním otevření localtunnel URL v prohlížeči se může zobrazit stránka s tlačítkem "Click to Continue". Stačí kliknout a pokračovat.

### 6. Přidejte addon do Stremio

1. Otevřete **Stremio**
2. Jděte do **Nastavení** (ikona ozubeného kolečka) → **Addony**
3. Do pole pro URL addonu vložte vaši HTTPS adresu z předchozího kroku s `/manifest.json` na konci, například:
   ```
   https://nice-fish-42.loca.lt/manifest.json
   ```
   (použijte svou vlastní adresu, kterou vám localtunnel zobrazil)
4. Klikněte na **Nainstalovat**

Hotovo! Při procházení filmů a seriálů uvidíte CSFD hodnocení.

**Důležité:** Musíte mít otevřené oba terminály — jeden s `node index.js` a druhý s `npx localtunnel`. Po restartu se HTTPS adresa změní a budete muset addon ve Stremio přeinstalovat s novou adresou.

---

## Jak to funguje

Když ve Stremio otevřete film nebo seriál:

1. Addon zjistí název filmu podle IMDb ID
2. Vyhledá film na ČSFD.cz
3. Stáhne hodnocení (v procentech)
4. Zobrazí ho ve Stremio jako hvězdičkové skóre (85% → 8.5) a v popisu filmu

Hodnocení se ukládá do paměti na 24 hodin, takže opakované zobrazení je okamžité.

---

## Zastavení addonu

V terminálu, kde addon běží, stiskněte `Ctrl + C`.

---

## Řešení problémů

| Problém | Řešení |
|---------|--------|
| `command not found: node` | Nainstalujte Node.js (viz krok 1) |
| `npm install` hlásí chybu | Zkuste `sudo npm install` (macOS/Linux) |
| Stremio nevidí addon | Zkontrolujte, že addon běží a URL je správná |
| Žádné hodnocení u filmu | Film nemusí být na ČSFD.cz, nebo nebyl nalezen |
