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

Stremio vyžaduje HTTPS adresu pro instalaci addonu. Použijeme **Cloudflare Tunnel**, který zdarma vytvoří HTTPS adresu pro váš lokální addon.

#### Instalace cloudflared

**macOS (přes Homebrew):**
```
brew install cloudflared
```

**Windows:** Stáhněte z [github.com/cloudflare/cloudflared/releases](https://github.com/cloudflare/cloudflared/releases/latest) — soubor `cloudflared-windows-amd64.exe`.

**Linux:**
```
sudo apt install cloudflared
```

#### Spuštění tunelu

Otevřete **druhý terminál** (první nechte běžet s addonem) a spusťte:

```
cloudflared tunnel --url http://localhost:7000
```

Po několika sekundách se v terminálu zobrazí HTTPS adresa, hledejte řádek obsahující `.trycloudflare.com`, například:

```
https://something-random-words.trycloudflare.com
```

Tuto adresu si zkopírujte.

### 6. Přidejte addon do Stremio

1. Otevřete **Stremio**
2. Jděte do **Nastavení** (ikona ozubeného kolečka) → **Addony**
3. Do pole pro URL addonu vložte vaši HTTPS adresu z předchozího kroku s `/manifest.json` na konci, například:
   ```
   https://something-random-words.trycloudflare.com/manifest.json
   ```
   (použijte svou vlastní adresu, kterou vám cloudflared zobrazil)
4. Klikněte na **Nainstalovat**

Hotovo! Při procházení filmů a seriálů uvidíte CSFD hodnocení.

**Důležité:** Musíte mít otevřené oba terminály — jeden s `node index.js` a druhý s `cloudflared tunnel`. Po restartu se HTTPS adresa změní a budete muset addon ve Stremio přeinstalovat s novou adresou.

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
