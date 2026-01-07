import type { Types } from 'mongoose'
import ContestParticipation from '../models/ContestParticipation'
import constants from '../utils/constants'

/**
 * Create or update contest participation record
 */
export async function createParticipation (
  contestId: Types.ObjectId,
  userId: Types.ObjectId,
): Promise<void> {
  await ContestParticipation.findOneAndUpdate(
    { contest: contestId, user: userId },
    {
      contest: contestId,
      user: userId,
      status: constants.participationStatus.Active,
    },
    { upsert: true, new: true },
  )
}

/**
 * Check if user is participating in a contest
 */
export async function isParticipating (
  contestId: Types.ObjectId,
  userId: Types.ObjectId,
): Promise<boolean> {
  const participation = await ContestParticipation.findOne({
    contest: contestId,
    user: userId,
    status: constants.participationStatus.Active,
  }).lean().exec()
  return participation !== null
}

/**
 * Remove participation record
 */
export async function removeParticipation (
  contestId: Types.ObjectId,
  userId: Types.ObjectId,
): Promise<void> {
  await ContestParticipation.findOneAndUpdate(
    { contest: contestId, user: userId },
    { status: constants.participationStatus.Inactive },
  )
}

const contestParticipationService = {
  createParticipation,
  isParticipating,
  removeParticipation,
} as const

export default contestParticipationService
