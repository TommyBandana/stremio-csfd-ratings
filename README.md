# Stremio CSFD.cz Ratings Addon

Tento addon zobrazuje hodnocení filmů a seriálů z [ČSFD.cz](https://www.csfd.cz) přímo ve Stremio.

- ⭐ Hodnocení se zobrazí jako hvězdičkové skóre na dlaždici filmu
- 📝 V detailu filmu uvidíte CSFD procenta a odkaz na CSFD stránku

---

## Instalace (1 krok)

1. Otevřete **Stremio**
2. Jděte do **Nastavení** (ikona ozubeného kolečka) → **Addony**
3. Do pole pro URL addonu vložte:
   ```
   https://csfd-ratings.tommybandana.workers.dev/manifest.json
   ```
4. Klikněte na **Nainstalovat**

Hotovo! Při procházení filmů a seriálů uvidíte CSFD hodnocení.

---

## Jak to funguje

Když ve Stremio otevřete film nebo seriál:

1. Addon zjistí název filmu podle IMDb ID
2. Vyhledá film na ČSFD.cz
3. Stáhne hodnocení (v procentech)
4. Zobrazí ho ve Stremio jako hvězdičkové skóre (85% → 8.5) a v popisu filmu

Hodnocení se ukládá do cache na 24 hodin, takže opakované zobrazení je okamžité.

---

## Lokální spuštění (pro vývojáře)

Pokud chcete addon spustit lokálně:

```bash
git clone https://github.com/TommyBandana/stremio-csfd-ratings.git
cd stremio-csfd-ratings
npm install
node index.js
```

Addon poběží na `http://localhost:7000`. Pro instalaci do Stremio potřebujete HTTPS tunel (např. `cloudflared tunnel --url http://localhost:7000`).

---

## Řešení problémů

| Problém | Řešení |
|---------|--------|
| Stremio nevidí addon | Zkontrolujte, že URL je správná |
| Žádné hodnocení u filmu | Film nemusí být na ČSFD.cz, nebo nebyl nalezen |
| CSFD hodnocení se nezobrazuje | Addon musí být nad Cinemeta v seznamu addonů (viz níže) |

### CSFD hodnocení se nezobrazuje

Stremio používá metadata z prvního addonu, který odpoví. Pokud je **Cinemeta** nad naším addonem, Stremio použije jeho data a CSFD hodnocení se nezobrazí.

**Řešení — přesuňte CSFD Ratings nad Cinemeta:**

1. Jděte na [stremio-addon-manager.vercel.app](https://stremio-addon-manager.vercel.app/)
2. Přihlaste se svým Stremio účtem
3. Přetáhněte **CSFD Ratings** nad **Cinemeta** v seznamu addonů
4. Uložte změny

Po přeuspořádání bude Stremio dotazovat náš addon jako první a zobrazí CSFD hodnocení v popisu filmu i jako hvězdičkové skóre.
