# comediq sheet ingest

`comediq-ingest.json` is an auditable plan derived from the public comediq.us
Google Sheet (the NYC subset), reconciled against the mic snapshot. It drives
`scripts/ingest-comediq.mts`.

It contains:

- `time_updates` — start/end time fixes for existing mics, by id. Each carries
  the snapshot value it was diffed against, so an apply can detect drift.
- `new_mics` — mics not already in our data, with geocoded coordinates.
- `*_held` — items deliberately **not** applied, with reasons (venue-only
  low-confidence matches, a protected unverified time, blank names, non-NYC,
  sheet dupes).

## Why this was applied to the snapshot, not the DB

When this was prepared, **Neon was over quota and refusing all connections**
(reads and writes). The DB could not be updated and the snapshot could not be
rebuilt from it. Because the site serves from `lib/data/mics-snapshot.json`
while Neon is down, the 65 time fixes and 55 new mics were written **directly
into the snapshot** so they would be live. The new mics carry synthetic ids
(`900001+`) and `confirmed: "... (pending Neon sync)"`.

## Replaying into Neon once quota is restored

The snapshot edit is a bridge, not the source of truth. When Neon is reachable:

```sh
npx tsx scripts/ingest-comediq.mts            # dry-run: review the plan vs live
npx tsx scripts/ingest-comediq.mts --apply    # write time fixes + new mics to Neon
npx tsx scripts/build-mics-snapshot.mts        # rebuild snapshot from the DB
```

The ingest is idempotent (new mics are deduped by name/venue + day; time fixes
skip rows whose live value has since drifted), so running it after the snapshot
was hand-edited is safe. The rebuild then replaces the synthetic-id records with
real DB rows.
