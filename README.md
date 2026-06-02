# Vibe Focus Panel (Focus Cockpit)

A calm, protective mission control dashboard for focused development work.

## v0.2 Manual Remote Cockpit Lifecycle

We have migrated to a fully manual, un-gamified lifecycle for managing remote tasks and cognitive operations.

### Key Concepts

- **Manual Remote Cockpit Lifecycle**: You have full control over the progression of a mission through states: `created`, `delegated`, `running`, `blocked`, `returned`, `reviewing`, `parked`, `closed`, and `abandoned`.
- **Returned is AI Done, Closed is Human Done**: When automated work is finished, it enters `returned`. It does not clear from your budget until you explicitly review it and move it to `closed` with a detailed Close Note.
- **Focus Window & Focus Budget**: The cockpit imposes limits to maintain a calm working rhythm:
  - Max Active Projects: 3
  - Max Running Jobs: 5
  - Max Review Debt: 2
- **Review Debt**: Returned tasks generate review debt. If the budget is exceeded, a calm reminder prompts you to review, park, or close work before taking on more.
- **Activity History**: All manual state changes and mission updates are logged in a calm, chronological user-action history.
- **`cockpit_state_v2`**: All states, budgets, tasks, and history are saved into a single robust `localStorage` key.

## Technical Details
Built with React, TypeScript, and Vite. Designed to operate completely client-side without backend, auth, or active AI integrations during this beta phase.


Next session:
Start v0.3 by improving multi-mission support.
Current v0.2 still feels like one main mission plus task stack. The next product step is to make Review Debt and Focus Budget work across multiple missions, while keeping the Remote Cockpit calm and manual-first.