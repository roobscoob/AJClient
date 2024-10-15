import { C2SCustomLogin, Language } from "./src/protocol/customSmartFoxMessages/C2SLogin";
import { fixInternalAddress, simpleAuthenticate } from "./src/rest";
import { Client, ExtensionMessageType } from "smartfox"
import { uuid } from 'uuidv4';
import "./global";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { deserializeMessage, serializeMessage } from "./src/protocol";
import { C2SRequestGenericList } from "./src/protocol/messages/c2s/genericList/requestGenericList";
import { AnimalJamClient, LoginConfig } from "./src/client";
import { DefType } from "./src/utils/defType";

interface LoginMethods {
  authToken?: string,
  refreshToken?: string,
  credentials?: { username: string, password: string },
  df?: string
}

async function getClient(methods: LoginMethods, loginConfig?: LoginConfig) {
  const config = loginConfig ?? {};

  if (methods.authToken)
    try {
      return await AnimalJamClient.login(methods.authToken, config);
    } catch (err) {
      if (!(err instanceof Error) || err.message !== "AUTH_TOKEN_EXPIRED")
        throw err;
    }

  if (methods.refreshToken)
    try {
      return await AnimalJamClient.login(methods.refreshToken, config)
    } catch(err) {
      if (!(err instanceof Error) || err.message !== "Refresh token expired")
        throw err;
    }

  if (methods.credentials)
    return await AnimalJamClient.login(methods.credentials.username, methods.credentials.password, config);

  throw new Error("No working login methods");
}

(async () => {
  const store = JSON.parse(readFileSync("./session.json", "utf-8"));

  const client = await getClient({
    ...store,
    credentials: { /* your credentials here */ },
  });

  writeFileSync("./session.json", JSON.stringify({ authToken: client.getAuthToken(), refreshToken: client.getRefreshToken() }));

  console.log(await client.getItemList("fjihgijdhfewhfuihrkrj", 3));
})();
