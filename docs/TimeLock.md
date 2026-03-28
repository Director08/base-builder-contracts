# TimeLock

Time-locked transaction execution with mandatory delay.

## Constants
- `MIN_DELAY`: 1 hour
- `MAX_DELAY`: 30 days
- `GRACE_PERIOD`: 14 days

## Functions
- `queue(target, value, data, executeAfter)` - Queue transaction
- `execute(target, value, data, executeAfter)` - Execute after delay
- `cancel(txId)` - Cancel queued transaction
- `transferAdmin(newAdmin)` - Transfer admin role
- `getTxId(...)` - Compute transaction hash
