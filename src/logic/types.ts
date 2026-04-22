export type Agent = {
  id: number
  name: string
  lastName: string
  issuance: number
  claims: number
  bonus: number
}

export type Operation = {
  agent: number
  operation: string
  date: string
  amount: number
}

export type DateRange = {
  startDate: Date
  endDate: Date
}

export enum OperationType {
  Reserve = 'reserve',
  Adjust = 'adjust',
  Deductible = 'deductible',
  Recovery = 'recovery'
}
