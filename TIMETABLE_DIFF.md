# Timetable diff: current (in script) vs new (your JSON)

## To Aoto (platform 2)

| Schedule | Current (script) | New (your JSON) | Difference |
|----------|------------------|-----------------|------------|
| **Weekday** | 150 times (05:19 … 23:50, 00:07, 00:22, 00:37) | Same list | **No change** |
| **Weekend**  | 109 times (05:19 … 23:56, 00:07, 00:22, 00:37) | Same list | **No change** |

Aoto data is already correct; no update needed.

---

## To Keisei-Ueno (platform 1)

### Counts and last departure

| Schedule | Current (script) | New (your JSON) |
|----------|------------------|-----------------|
| **Weekday** | 84 departures, last **00:37** (plus 00:07, 00:22) | **120** departures, last **23:59** (no past-midnight) |
| **Weekend**  | 84 departures, last **00:37** (plus 00:07, 00:22) | **120** departures, last **23:59** (no past-midnight) |

So Ueno changes: **more departures** and **no 00:07 / 00:22 / 00:37** in the new data.

### Weekday Ueno – sample of differences

Current script uses a **regular ~12‑minute pattern** (placeholder). New data uses **real irregular times** and **variable durationMin** (15–24 min).

| Time window | Current (script) – example | New (your JSON) – example |
|-------------|---------------------------|----------------------------|
| Early       | 05:40, **05:52**, 06:04, **06:16**, 06:28 | 05:40, **05:47**, 05:58, **06:06**, 06:12, **06:19**, 06:26, 06:30, 06:37, 06:42, 06:48, 06:53, **07:00** |
| Morning     | 08:04, 08:16, 08:28, 08:40, 08:52 | 08:00, **08:07**, **08:11**, **08:18**, 08:26, **08:31**, **08:39**, 08:48, **08:53**, **08:59** |
| Evening     | 17:04, 17:16, 17:28, 17:40, 17:52 | **17:01**, **17:08**, **17:18**, **17:26**, **17:38**, **17:42**, 17:48 |
| Late        | 23:40, 23:52, **00:07**, 00:22, 00:37 | 23:38, **23:59** (no trains after midnight) |

### Weekend Ueno – sample of differences

Same idea: current = regular intervals; new = real times, last 23:59.

| Time window | Current (script) – example | New (your JSON) – example |
|-------------|---------------------------|----------------------------|
| Early       | 05:34, 05:46, 05:58, 06:10, 06:22 | 05:34, **05:47**, **05:59**, **06:10**, **06:20**, **06:30**, **06:41**, 06:46, 06:57, **07:05** |
| Late        | 23:46, 23:58, **00:07**, 00:22, 00:37 | **23:39**, **23:59** (no trains after midnight) |

### durationMin (Ueno only)

- **Current:** every departure has `durationMin: 16`.
- **New:** varies by trip, e.g. 15, 16, 17, 18, 19, 20, 21, 22, 23, 24.  
  (Script only uses `depart` for “next train”; duration is not used in the message.)

---

## Summary

| Part | Action |
|------|--------|
| **toAoto** (weekday & weekend) | **Keep as is** – already matches your JSON. |
| **toKeiseiUeno weekday** | **Replace** with new 120-entry list (real times, last 23:59, variable durationMin). |
| **toKeiseiUeno weekend**  | **Replace** with new 120-entry list (real times, last 23:59, variable durationMin). |

After updating, “next train to Keisei-Ueno” will use the real timetable and will no longer suggest 00:07/00:22/00:37; after the last train (23:59) the script will wrap to the first departure of the day (04:59 weekday, 04:59 weekend).
