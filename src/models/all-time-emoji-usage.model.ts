import {
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript'

@Table({
  tableName: 'AllTimeEmojiUsage',
  timestamps: false,
})
export class AllTimeEmojiUsage extends Model<AllTimeEmojiUsage> {
  @Unique
  @PrimaryKey
  @Column
  emoji!: string

  @Default(0)
  @Column
  count!: number

  static top(limit = 10) {
    return this.findAll({
      order: [['count', 'DESC']],
      limit,
    })
  }
}
