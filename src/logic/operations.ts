import { Agent, Operation, DateRange, OperationType } from './types';
import { readFromCSV } from './utils';

function filterByDateRange(dateRange: DateRange | undefined, operations: Operation[]): Operation[] {
  if (!dateRange) return operations;
  const { startDate, endDate } = dateRange;
  return operations.filter((op) => {
    const opDate = new Date(op.date);
    return opDate >= startDate && opDate <= endDate;
  });
}

async function getOperations(file: string, dateRange?: DateRange): Promise<Operation[]> {
  const operations = await readFromCSV(file);
  return filterByDateRange(dateRange, operations);
}

export function getIssuance(dateRange?: DateRange): Promise<Operation[]> {
  return getOperations('../resources/issuance.csv', dateRange);
}

export function getClaims(dateRange?: DateRange): Promise<Operation[]> {
  return getOperations('../resources/claims.csv', dateRange);
}

export function calculateIssuance(agent: Agent, operations: Operation[]): number {
  return operations
    .filter((op) => op.agent === agent.id)
    .reduce((sum, op) => sum + Number(op.amount), 0);
}

export function calculateClaims(agent: Agent, operations: Operation[]): number {
  const agentOps = operations.filter((op) => op.agent === agent.id);
  const sum = (type: OperationType) =>
    agentOps.filter((op) => op.operation === type).reduce((s, op) => s + Number(op.amount), 0);

  return (
    sum(OperationType.Reserve) +
    sum(OperationType.Adjust) -
    sum(OperationType.Deductible) -
    sum(OperationType.Recovery)
  );
}

export function calculateBonus(agent: Agent): number {
  if (agent.issuance === 0) return 0;
  const sinister = (agent.claims / agent.issuance) * 100;
  const sinisterLow = sinister <= 65;
  let bonusPercentage = 0;

  switch (true) {
    case agent.issuance <= 3500:
      bonusPercentage = sinisterLow ? 4 : 0;
      break;
    case agent.issuance <= 5000:
      bonusPercentage = sinisterLow ? 5 : 0;
      break;
    case agent.issuance <= 5500:
      bonusPercentage = sinisterLow ? 6 : 1;
      break;
    case agent.issuance > 6000:
      bonusPercentage = sinisterLow ? 8 : 1;
      break;
    default:
      bonusPercentage = sinisterLow ? 10 : 3;
      break;
  }

  return (agent.issuance * bonusPercentage) / 100;
}
