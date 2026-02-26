README - Cleaning Pricing DB Export (TSV)
Doc set:
- D001: Cleaning_Times_Production_Rates.doc (DOC)

Contents:
- INVENTORY.tsv, DOC_META.tsv
- RAW_TASK_SNIPPETS.tsv, RAW_VALUES.tsv
- DIM_UNIT.tsv, DIM_UNIT_CONVERSION.tsv, DIM_TASK.tsv, MAP_TASK_VARIANTS.tsv, DIM_SOURCE.tsv, BRIDGE_TASK_SOURCE.tsv
- FACT_TASK_RATES.tsv, FACT_TASK_PRICES.tsv (empty in this doc set)
- DIM_FREQUENCY.tsv (skeleton), DIM_ASSUMPTIONS.tsv (skeleton)
- QA_SUMMARY.tsv, QA_TASKS.tsv
- MANIFEST.tsv

BENCHMARK PACK (OPTIONAL)
- Files: BENCH_TASK_PRICES.tsv, BENCH_TASK_RATES.tsv, BENCH_TASK_RULES.tsv
- Purpose: Keep US benchmark pricing/rates AVAILABLE without contaminating Ontario core rates/prices.
- Rules:
  * Treat all BENCH rows as Region=US_BENCHMARK and CurrencyCode=USD.
  * Do NOT pre-convert USD->CAD in these tables; conversion happens in the motor using DIM_ASSUMPTIONS.FX_USD_to_CAD.
  * Tasks created from benchmarks are ActiveFlag=FALSE in DIM_TASK, so core QA remains stable.
- Import order (if you want benchmarks):
  1) Load core tables first (same order as before).
  2) Load BENCH_* tables last.
  3) In your motor UI, add a toggle: UseBenchmarks=TRUE to allow selecting Region=US_BENCHMARK rows.
