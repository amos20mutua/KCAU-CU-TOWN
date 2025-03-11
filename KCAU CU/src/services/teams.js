import { supabase } from '../config/supabase'

export const teamService = {
  // Create team
  async createTeam(name, description, leaderId) {
    return await supabase
      .from('teams')
      .insert([{ name, description, leader_id: leaderId }])
      .select()
  },

  // Get all teams
  async getAllTeams() {
    return await supabase
      .from('teams')
      .select(`
        *,
        leader:users(full_name),
        team_members(
          user:users(full_name)
        )
      `)
  },

  // Add member to team
  async addTeamMember(teamId, userId) {
    return await supabase
      .from('team_members')
      .insert([{ team_id: teamId, user_id: userId }])
  },
} 