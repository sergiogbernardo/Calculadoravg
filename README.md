# Calculadoravg

A calculator that thinks in lines. The GitHub Pages version of the local
`calculadora` project, rebuilt around a **notepad** powered by
[math.js](https://mathjs.org/) — everything runs in the browser, no backend.

Part of the [project hub](https://sabion.io/).

## Modes

- **Notepad** (the headline) — a multi-line scratchpad. Each line is evaluated
  and its result shown in the margin. Define variables and reuse them across
  lines, declare functions, mix in units, and even do symbolic algebra.

  ```
  preco = 1200            1200
  desc  = 10% de preco     120
  preco - desc           1080
  parcelas = 12             12
  (preco - desc)/parcelas   90
  5 km + 300 m in miles  3.293 miles
  derivative("x^2", "x")    2 x
  ```

- **Teclado** — a classic keypad (basic + scientific) with memory (MC/MR/M+/M-).
- **Financeira** — simple interest, compound interest, percentage and percentage
  change.
- **Gráfico** — plot a function `f(x)` over a range on a canvas.

## Power features

- **Units & conversions** — `60 mph to m/s`, `2 GB in MB`, `5 km + 300 m`.
- **Variables & functions** — `preco = 1200`, `f(x) = x^2 + 1` then `f(3)`.
- **Symbolic algebra** — `derivative(...)`, `simplify(...)`, `rationalize(...)`.
- **Percentages in words** — `10% de 1290`, or a plain `20%`.

## How it works

A single math.js instance evaluates expressions; the Notepad shares one parser
scope so variables and functions persist line to line. There is no backend and
no network call — calculations never leave your machine. History is kept in
`localStorage`.

## Stack

React + TypeScript + Vite + Tailwind + math.js. No backend, no tracking.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview
```

The Vite `base` is `/Calculadoravg/` to match GitHub Pages. Deployment is
automated by `.github/workflows/deploy.yml` on every push to `main`.
