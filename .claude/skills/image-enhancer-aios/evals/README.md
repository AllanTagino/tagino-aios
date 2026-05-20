# image-enhancer-aios eval set

Trigger evaluation set used to validate the SKILL.md `description` field — i.e. whether Claude consults this skill when it should, and ignores it when it shouldn't.

## Contents

- `trigger_eval_set.json` — 20 realistic queries (10 should-trigger, 10 should-not-trigger), each grounded in Allan's actual Brazilian arch-viz workflow with real client names, mixed English/Portuguese, and tricky near-misses (cabinet-pdf-to-prompts, klingai, image format conversion, etc.)

## Validation status

**Validated on 2026-05-18 against the v1.0.0 description: 20/20 correct (100% recall, 100% specificity).**

Manual validation used `claude -p --model claude-opus-4-7` with the current SKILL.md description and a YES/NO trigger question. The `skill-creator` `run_loop.py` optimization framework was attempted first but failed due to a Windows-specific subprocess socket error (WinError 10038, ~300 instances) that broke every evaluation — every query returned the default "no trigger" instantly, producing meaningless 50%-accuracy numbers across all 5 iterations. The manual eval bypassed this by invoking `claude -p` directly from PowerShell.

## How to re-validate

```powershell
& "C:\Users\GaialabsPC2\AllanSkills\image-enhancer-aios-workspace\manual_eval.ps1"
```

(Or replicate the pattern: pipe a prompt containing `Available skill: <name>. Description: <desc>. User query: <q>. Should this query trigger the skill? Reply YES or NO and nothing else.` to `claude -p --model <model>` for each query in the eval set.)

## When to refresh

Refresh the eval set and re-validate if:

- The skill description in `SKILL.md` changes meaningfully.
- New scene types or workflows are added to the skill (e.g., expanding beyond residential into commercial/hospitality).
- Real-world usage surfaces missed triggers (skill not activating when it should) or false triggers (skill activating when another tool fits better) — add the offending query to the eval set and re-tune.

This folder is excluded from `.skill` packaging (per `package_skill.py` `ROOT_EXCLUDE_DIRS`) but tracked in the repo for reproducibility.
