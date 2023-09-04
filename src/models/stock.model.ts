import {
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { User } from '~/models/user.model'

@Table({
  tableName: 'EmojiStock',
  timestamps: false,
})
export class Stock extends Model<Stock> {
  @PrimaryKey
  @Column
  slackId!: string

  @PrimaryKey
  @Column
  emoji!: string

  @Default(0)
  @Column(DataType.BIGINT)
  shares!: number

  @Default(0)
  @Column(DataType.BIGINT)
  spent!: number

  @BelongsTo(() => User, {
    foreignKey: 'slackId',
    targetKey: 'slackId',
  })
  owner!: User
}
