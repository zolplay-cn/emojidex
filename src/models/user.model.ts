import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  HasOne,
  IsDate,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript'
import { Stock } from '~/models/stock.model'
import { SecretEmoji } from '~/models/secret-emoji.model'

@Table({
  tableName: 'User',
  timestamps: false,
})
export class User extends Model<User> {
  @Unique
  @Column
  readonly slackId!: string

  @Default(0)
  @Column(DataType.BIGINT)
  bucks!: number

  @IsDate
  @Column
  lastSentAt?: Date

  @AllowNull
  @Column
  name?: string

  @HasMany(() => Stock, {
    foreignKey: 'slackId',
    sourceKey: 'slackId',
  })
  stocks!: Stock[]

  @HasOne(() => SecretEmoji, {
    foreignKey: 'slackId',
    sourceKey: 'slackId',
  })
  secretEmoji?: SecretEmoji
}
