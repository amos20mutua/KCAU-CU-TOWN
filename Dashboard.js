import { useEffect, useState } from 'react'
import { teamService } from '../services/teams'
import { contributionService } from '../services/contributions'

function Dashboard() {
  const [teams, setTeams] = useState([])
  const [contributions, setContributions] = useState([])

  useEffect(() => {
    // Fetch teams
    async function fetchTeams() {
      const { data, error } = await teamService.getAllTeams()
      if (!error) setTeams(data)
    }

    // Fetch contributions
    async function fetchContributions() {
      const { data, error } = await contributionService.getAllContributions()
      if (!error) setContributions(data)
    }

    fetchTeams()
    fetchContributions()
  }, [])

  return (
    <div>
      {/* Display your data here */}
    </div>
  )
}

export default Dashboard 