import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'SecretEmojiEvent',
  timestamps: false,
})
export class SecretEmoji extends Model<SecretEmoji> {
  @PrimaryKey
  @Column
  slackId!: string

  @PrimaryKey
  @Column
  emoji!: string

  @Default(0)
  @Column
  used!: number

  @AllowNull
  @Column
  bustedBy?: string

  @AllowNull
  @Column
  firstUsedAt?: Date

  @UpdatedAt
  @Default(DataType.NOW)
  @Column
  updatedAt!: Date
}
