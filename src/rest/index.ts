import { TypeOf, z } from "zod";
import { flashVarsSchema, authenticateResponseSchema, playerSessionDataSchema } from "./schema";

export type Config = {
  web: string,
  auth: string,
  session: string,
};

export const defaultConfig: Config = {
  web: "https://www.animaljam.com",
  auth: "https://authenticator.animaljam.com",
  session: "https://player-session-data.animaljam.com"
}

function effectiveConfig(config?: Partial<Config>): Config {
  return Object.assign({ ...defaultConfig }, config);
}

export async function getFlashVars(config?: Partial<Config>): Promise<z.TypeOf<typeof flashVarsSchema>> {
  const response = await fetch(`${effectiveConfig(config).web}/flashvars`);

  return await flashVarsSchema.parseAsync(await response.json());
}

export type AuthenticateOptions = ({
  username: string,
  password: string,
} | {
  refresh_token: string,
}) & {
  otp?: string,
  domain?: "flash",
  df: string,
};

const ERRORS = {
  [100]: "Refresh token expired",
  [101]: "Incorrect credentials",
  [102]: "Banned",
  [103]: "Suspended",
}

export async function authenticate(options: AuthenticateOptions, config?: Partial<Config>): Promise<z.TypeOf<typeof authenticateResponseSchema>> {
  options.domain ??= "flash";

  const response = await fetch(`${effectiveConfig(config).auth}/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options)
  });

  const resp = await response.json();

  if ("error_code" in resp)
    if (resp.error_code in ERRORS) {
      throw new Error(ERRORS[resp.error_code as keyof typeof ERRORS]);
    } else {
      throw new Error("Login Error: " + resp.error_code)
    }

  return await authenticateResponseSchema.parseAsync(resp);
}

export async function getPlayerSessionData(authToken: string, flashVars: z.TypeOf<typeof flashVarsSchema>, config?: Partial<Config>): Promise<z.TypeOf<typeof playerSessionDataSchema>> {
  const response = await fetch(`${effectiveConfig(config).session}/player?domain=flash&client_version=${encodeURIComponent(flashVars.deploy_version)}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Authorization": `Bearer ${authToken}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("AUTH_TOKEN_EXPIRED");
  }

  const responseData = await response.json();

  if (responseData.rename_required) {
    throw new Error("USER_RENAME_NEEDED");
  }

  return await playerSessionDataSchema.parseAsync(responseData);
}

// Converts internal domains to public domains
// .stage.animaljam.internal -> -stage.animaljam.com
// .prod.animaljam.internal -> -prod.animaljam.com
export function fixInternalAddress(address: string): string {
  return "lb-" + address.replace(/\.(stage|prod)\.animaljam\.internal$/g, "-$1.animaljam.com");
}

export type SimpleAuthenticateResponse = {
  authToken: string;
  refreshToken?: string;
  sessionData: z.TypeOf<typeof playerSessionDataSchema>,
  flashVars: z.TypeOf<typeof flashVarsSchema>
};

export async function simpleAuthenticate(authOptions: AuthenticateOptions | string, config?: Partial<Config>): Promise<SimpleAuthenticateResponse> {
  let authRes: z.TypeOf<typeof authenticateResponseSchema> | undefined;
  let authToken: string;
  if (typeof authOptions !== "string") {
    authRes = await authenticate(authOptions, config);
    authToken = authRes.auth_token;
  } else {
    authToken = authOptions;
  }

  const flashVars = await getFlashVars(config);
  const sessionData = await getPlayerSessionData(authToken, flashVars, config);

  return {
    authToken: authToken,
    refreshToken: authRes?.refresh_token,
    flashVars,
    sessionData
  }
}
