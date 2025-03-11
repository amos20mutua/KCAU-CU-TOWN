import { supabase } from '../config/supabase'

export const contributionService = {
  // Record new contribution
  async createContribution(userId, amount, paymentMethod, transactionId, campaignName) {
    return await supabase
      .from('contributions')
      .insert([{
        user_id: userId,
        amount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        campaign_name: campaignName
      }])
  },

  // Get all contributions
  async getAllContributions() {
    return await supabase
      .from('contributions')
      .select(`
        *,
        user:users(full_name)
      `)
      .order('created_at', { ascending: false })
  },
} 