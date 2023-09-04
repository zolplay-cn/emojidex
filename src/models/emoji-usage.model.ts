import {
  BeforeCreate,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { createId } from '@paralleldrive/cuid2'

@Table({
  tableName: 'EmojiUsage',
  timestamps: false,
})
export class EmojiUsage extends Model<EmojiUsage> {
  @PrimaryKey
  @Column
  id!: string

  @Column
  slackId!: string

  @Column
  emoji!: string

  @Column(DataType.STRING)
  method!: 'REACTION' | 'MESSAGE'

  @Column
  channel!: string

  @Default(false)
  @Column
  owned!: boolean

  @CreatedAt
  @Default(DataType.NOW)
  @Column
  createdAt!: Date

  @BeforeCreate
  static generateUUID(instance: EmojiUsage) {
    instance.id = createId()
  }
}
