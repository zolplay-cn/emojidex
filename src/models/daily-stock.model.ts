import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'DailyEmojiStock',
  timestamps: false,
})
export class DailyStock extends Model<DailyStock> {
  @PrimaryKey
  @Column
  emoji!: string

  @PrimaryKey
  @Column
  day!: string

  @Column
  price!: number

  @UpdatedAt
  @Default(DataType.NOW)
  @Column
  updatedAt!: Date
}
