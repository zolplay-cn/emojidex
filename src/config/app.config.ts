import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  production: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT || '4000', 10),
  timezone: process.env.TZ || 'Asia/Shanghai',
  debug: process.env.DEBUG === 'true',
}))
