# View: podcast-guest

The guest (e.g. the clinic owner) at the studio mic, talking to an **unseen host
slightly off-camera**. Same blocks as [`podcast-host`](podcast-host.md); only the listener and
eyeline change, so the two sides cut together as a conversation. Source: HeyAnaya Scripts 1
and 2, "Person 1 – Clinic owner" clips.

Guests usually carry a separate `Voice:` line (set `voice_as: "voice_line"` on the cast entry)
and a per-line `delivery` (the reaction: surprised, candid, convinced…). A clip may hold two
of the guest's lines with a short `[PAUSE]` between them (`note: "slight pause, a brief
thoughtful beat"`); cut it apart in the edit.

```json meta
{
  "view": "podcast-guest",
  "extends": "podcast-host",
  "defaults": {
    "listener": "host",
    "listener_side": " to {{his}} right"
  }
}
```

## Slots

As [`podcast-host`](podcast-host.md#slots). `listener_side` sets the eyeline: match it to the
host's shot (host looks to frame left → guest looks to frame right).

## Blocks

Inherited from `podcast-host`.
