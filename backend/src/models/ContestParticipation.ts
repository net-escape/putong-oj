import type { Document, Types } from 'mongoose'
import mongoose from '../config/db'
import constants from '../utils/constants'

export interface ContestParticipationEntity {
  contest: Types.ObjectId
  user: Types.ObjectId
  status: typeof constants.participationStatus[keyof typeof constants.participationStatus]
}

export interface ContestParticipationDocument extends Document<Types.ObjectId>, ContestParticipationEntity {
  createdAt: Date
  updatedAt: Date
}

const contestParticipationSchema = new mongoose.Schema({
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  status: {
    type: Number,
    enum: Object.values(constants.participationStatus),
    default: constants.participationStatus.Active,
  },
}, {
  collection: 'ContestParticipation',
  timestamps: true,
})

// Compound index to ensure unique participation per user per contest
contestParticipationSchema.index({ contest: 1, user: 1 }, { unique: true })

const ContestParticipation = mongoose.model<ContestParticipationDocument>(
  'ContestParticipation', contestParticipationSchema,
)

export default ContestParticipation
