import { Column, Default, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({
  tableName: 'MonthlyEmojiUsage',
  timestamps: false,
})
export class MonthlyEmojiUsage extends Model<MonthlyEmojiUsage> {
  @PrimaryKey
  @Column
  emoji!: string

  @PrimaryKey
  @Column
  month!: string

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
