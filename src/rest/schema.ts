import { z } from "zod"

export const flashVarsSchema = z.object({
  content: z.string(),
  blueboxPort: z.preprocess(a => parseInt(z.string().parse(a), 10), z.number().int()),
  website: z.string(),
  build_version: z.preprocess(a => parseInt(z.string().parse(a), 10), z.number().int()),
  mdUrl: z.string(),
  deploy_version: z.preprocess(a => parseInt(z.string().parse(a), 10), z.number().int()),
  sbStatTrackerIp: z.string(),
  sbStatModulator: z.preprocess(a => parseInt(z.string().parse(a), 10), z.number().int()),
  smoke_version: z.preprocess(a => parseInt(z.string().parse(a), 10), z.number().int()),
  playerWallHost: z.string(),
  smartfoxPort: z.preprocess(a => parseInt(z.string().parse(a), 10), z.number().int()),
  smartfoxServer: z.string(),
  blueboxServer: z.string(),
  clientURL: z.string(),
  currentTimestamp: z.number().int(),
  country: z.string(),
  locale: z.string(),
});

export const authenticateResponseSchema = z.object({
  auth_token: z.string(),
  refresh_token: z.string(),
});

export const playerSessionDataSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  screen_name: z.string(),
  language: z.string(),
  game_account_type: z.number(),
  immortal: z.boolean(),
  country: z.string(),
  user: z.object({
    email: z.string().email(),
    id: z.number(),
  }).optional().nullable(),
  game_server: z.string(),
  rename_required: z.boolean(),
  domains: z.object({
    flash: z.object({
      chat_type: z.string(),
      account_status: z.string(),
      player_wall: z.string(),
    }),
  }),
  buddies: z.number(),
  questing: z.number(),
  chat: z.number(),
  jags: z.number(),
  gifting: z.number(),
  trading: z.number(),
  pvp_games: z.number(),
  mp_games: z.number(),
  two_fa_auth: z.number(),
  days_until_sub_expiration: z.number(),
});
