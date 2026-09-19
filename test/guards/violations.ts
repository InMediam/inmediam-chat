export type ViolationKind = 'network' | 'warning'

export interface Violation {
  kind: ViolationKind
  detail: string
}

const violations: Violation[] = []

export function recordViolation(violation: Violation) {
  violations.push(violation)
}

export function takeViolations() {
  const found = [...violations]

  violations.length = 0

  return found
}
