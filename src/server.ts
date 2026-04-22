import { getAgents, showList } from './logic/agents'
import { getIssuance, getClaims, calculateIssuance, calculateClaims, calculateBonus } from './logic/operations'

async function main () {
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-06-30');
  const agents = await getAgents()
  const issuance = await getIssuance({ startDate, endDate });
  const claims = await getClaims({ startDate, endDate });

  for (const agent of agents) {
    agent.issuance = calculateIssuance(agent, issuance)
    agent.claims = calculateClaims(agent, claims)
    agent.bonus = calculateBonus(agent)
  }

  showList(agents)
}

main()
