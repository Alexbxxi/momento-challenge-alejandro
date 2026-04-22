import { Agent, Operation, DateRange } from './types';
import { readFromCSV } from './utils';

export async function filterByDateRange(
  dateRange?: DateRange,
  operations?: Operation[],
): Promise<Operation[]> {
  const { startDate, endDate } = dateRange || {};
  const filter = startDate && endDate;

  if (!filter) {
    return operations || [];
  }

  return (
    operations?.filter((op) => {
      const opDate = new Date(op.date);
      return opDate >= startDate && opDate <= endDate;
    }) || []
  );
}

export async function getIssuance(dateRange?: DateRange): Promise<Operation[]> {
  const operations = await readFromCSV('../resources/issuance.csv');
  return filterByDateRange(dateRange, operations);
}

export async function getClaims(dateRange?: DateRange): Promise<Operation[]> {
  const operations = await readFromCSV('../resources/claims.csv');
  return filterByDateRange(dateRange, operations);
}

export function calculateIssuance(agent: Agent, operations: Operation[]): number {
  let issuance = 0;
  for (const op of operations) {
    if (op.agent === agent.id) issuance += Number(op.amount);
  }
  return issuance;
}

export function calculateClaims(agent: Agent, operations: Operation[]): number {
  let reserve = 0;
  let adjust = 0;
  let deductible = 0;
  let recovery = 0;

  for (const op of operations) {
    switch (op.operation) {
      case 'reserve':
        if (op.agent === agent.id) reserve += Number(op.amount);
        break;
      case 'adjust':
        if (op.agent === agent.id) adjust += Number(op.amount);
        break;
      case 'deductible':
        if (op.agent === agent.id) deductible += Number(op.amount);
        break;
      case 'recovery':
        if (op.agent === agent.id) recovery += Number(op.amount);
        break;
    }
  }
  return reserve + adjust - deductible - recovery;
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
