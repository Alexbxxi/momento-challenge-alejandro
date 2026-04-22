import { Agent } from './types'
import { readFromCSV } from './utils'

export async function getAgents () {
  const agents = await readFromCSV('../resources/agents.csv')
  return agents
}

function col(value: string | number, width: number, align: 'left' | 'right' = 'left'): string {
  const str = String(value);
  return align === 'right' ? str.padStart(width) : str.padEnd(width);
}

export function showList(agents: Agent[]) {
  const sep = '  ';
  const header = [
    col('ID',        4,  'right'),
    col('NOMBRE',    10, 'left'),
    col('APELLIDO',  12, 'left'),
    col('EMISIÓN',   12, 'right'),
    col('SINIESTROS',12, 'right'),
    col('BONO',      10, 'right'),
  ].join(sep);

  const line = '-'.repeat(header.length);
  console.log(line);
  console.log(header);
  console.log(line);

  for (const agent of agents) {
    console.log([
      col(agent.id,                          4,  'right'),
      col(agent.name,                        10, 'left'),
      col(agent.lastName,                    12, 'left'),
      col(agent.issuance.toFixed(2),         12, 'right'),
      col(agent.claims.toFixed(2),           12, 'right'),
      col(agent.bonus.toFixed(2),            10, 'right'),
    ].join(sep));
  }

  console.log(line);
}
