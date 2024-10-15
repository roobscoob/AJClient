import { uuid } from 'uuidv4';
import { AuthenticateOptions, fixInternalAddress, simpleAuthenticate } from '../rest';
import { Client as SmartFoxClient, ExtensionMessageType, ExtensionMessage } from 'smartfox';
import { C2SCustomLogin, Language } from '../protocol/customSmartFoxMessages/C2SLogin';
import { getLanguageIdForLocale } from './getLanguageIdForLocale';
import { loginSchema } from './loginSchema';
import Emittery from 'emittery';
import { deserializeMessage, serializeMessage } from '../protocol';
import { C2SRequestGenericList } from '../protocol/messages/c2s/genericList/requestGenericList';
import { MessageInstance } from '../protocol/message';
import { S2CGenericList } from '../protocol/messages/s2c/genericList/genericList';
import { C2SRequestItemList } from '../protocol/messages/c2s/item/requestItemList';
import { S2CItemList } from '../protocol/messages/s2c/item/itemList';
import { MinigameProviders } from '../protocol/minigames';

export enum OperatingSystem {
  Windows = "WIN",
  MacOS = "MAC",
  Linux = "LNX",
  Android = "AND",
  ChomeOS = "CHROMEOS",
  Puffin = "PUFFIN",
}

export interface LoginConfig {
  df: string,
  clientPlatform: string,
  clientPlatformVersion: string,
  operatingSystem: OperatingSystem,
  sessionId: string,
}

export interface ConnectConfig {
  gameServer: string,
  gamePort: number,
  df?: string,
  authToken: string,
  screenName: string,
  sessionId?: string,
  languageId?: number,
  deployVersion?: number,
  clientPlatform?: string,
  clientPlatformVersion?: string,
  operatingSystem?: OperatingSystem,
}

export interface AnimalJamEvents {

}

export class AnimalJamClient extends Emittery<AnimalJamEvents> {
  static async login(refreshToken: string, config?: Partial<LoginConfig>): Promise<AnimalJamClient>
  static async login(authToken: string, config?: Partial<LoginConfig>): Promise<AnimalJamClient>
  static async login(username: string, password: string, config?: Partial<LoginConfig>): Promise<AnimalJamClient>
  static async login(usernameOrAuthTokenOrRefreshToken: string, passwordOrConfig?: string | Partial<LoginConfig>, maybeConfig?: Partial<LoginConfig>): Promise<AnimalJamClient> {
    const config = typeof passwordOrConfig === "object" ? passwordOrConfig : maybeConfig ?? {}

    const df = config.df ?? uuid();
    const clientPlatform = config.clientPlatform ?? "electron";
    const clientPlatformVersion = config.clientPlatformVersion ?? "1.5.7";
    const operatingSystem = config.operatingSystem ?? OperatingSystem.Windows;
    const sessionId = config.sessionId ?? undefined;

    let arg: AuthenticateOptions | string;

    if (typeof passwordOrConfig === "string")
      arg = { username: usernameOrAuthTokenOrRefreshToken, password: passwordOrConfig, df };
    else {
      if (usernameOrAuthTokenOrRefreshToken.includes("."))
        arg = usernameOrAuthTokenOrRefreshToken;
      else
        arg = { refresh_token: usernameOrAuthTokenOrRefreshToken, df };
    }

    const { authToken, refreshToken, sessionData, flashVars } = await simpleAuthenticate(arg);

    return await AnimalJamClient.connect({
      gameServer: fixInternalAddress(sessionData.game_server), 
      gamePort: flashVars.smartfoxPort,
      authToken,
      clientPlatform,
      clientPlatformVersion,
      deployVersion: flashVars.deploy_version,
      df,
      languageId: getLanguageIdForLocale(flashVars.locale),
      operatingSystem,
      screenName: sessionData.screen_name,
      sessionId,
    }, refreshToken)
  }

  static async connect(config: ConnectConfig, refreshToken?: string) {
    const sfClient = await SmartFoxClient.connect(config.gameServer, config.gamePort);
    const key = await sfClient.getRandomKey();

    sfClient.socket.sendXml(new C2SCustomLogin(
      key,
      config.authToken,
      config.screenName,
      config.sessionId,
      config.languageId ?? Language.English,
      config.deployVersion ?? 1658,
      config.clientPlatform ?? "electron",
      config.clientPlatformVersion ?? "1.5.7",
      config.operatingSystem ?? OperatingSystem.Windows,
      config.df ?? uuid(),
    ));

    const { kind, command, dataObject, roomId } = await sfClient.once("extensionMessage");

    if (command !== "login" || kind !== ExtensionMessageType.JSON)
      throw new Error("Failed to get expected login extension message");

    console.log({ kind, command, dataObject, roomId })

    const { params } = loginSchema.parse(dataObject);

    return new AnimalJamClient(sfClient, params, config.authToken, refreshToken);
  }

  private constructor(
    private sfClient: SmartFoxClient,
    private params: Zod.infer<typeof loginSchema>["params"],
    private authToken: string,
    private refreshToken?: string,
  ) {
    super();

    this.sfClient.on("extensionMessage", e => this.handleExtensionMessage(e))
  }

  private privateEmitter = new Emittery<{ extensionMessage: MessageInstance }>();

  private handleExtensionMessage(e: ExtensionMessage) {
    console.log(e);

    if (e.kind !== ExtensionMessageType.STR)
      throw new Error("Recieved non-string extension message: " + ExtensionMessageType[e.kind] + ": " + e.command);

    const message = deserializeMessage(e.command, e.dataObject, true, this);

    this.privateEmitter.emit("extensionMessage", message);
  }

  private sendExtensionMessage(m: MessageInstance, inWorld = true) {
    this.sfClient.sendStrExtensionMessage(inWorld ? "o" : "e", ...serializeMessage(m));
  }

  private async expectExtensionMessage<T extends { deserialize (...args: any[]): MessageInstance }>(m: T[], filter?: (msg: ReturnType<T["deserialize"]>) => boolean): Promise<ReturnType<T["deserialize"]>> {
    for await (const message of this.privateEmitter.events("extensionMessage")) {
      if (m.some(klass => message instanceof (klass as any))) {
        if (filter === undefined || filter(message as any) === true)
          return message as any;
      }
    }

    throw new Error("Never.")
  }

  private async expectExtensionMessageWithTimeout<T extends { deserialize(...args: any[]): MessageInstance }>(m: T[], timeout: number, filter?: (msg: ReturnType<T["deserialize"]>) => boolean): Promise<ReturnType<T["deserialize"]>> {
    let events = this.privateEmitter.events("extensionMessage");

    const ntimeout = setTimeout(() => {
      events.return?.();
    }, timeout);

    for await (const message of events) {
      if (m.some(klass => message instanceof (klass as any))) {
        if (filter === undefined || filter(message as any) === true) {
          clearTimeout(ntimeout);
          return message as any;
        }
      }
    }

    throw new Error("Timed out.")
  }

  async getGenericList(listId: number, timeout: number = 2500) {
    this.sendExtensionMessage(new C2SRequestGenericList(listId));

    return await this.expectExtensionMessageWithTimeout([ S2CGenericList ], timeout, l => l.listId === listId);
  }

  async getItemList(username: string, perUserAvatarId: number, getFullList: boolean = true, timeout: number = 2500) {
    this.sendExtensionMessage(new C2SRequestItemList(username, perUserAvatarId, getFullList));

    return await this.expectExtensionMessageWithTimeout([ S2CItemList ], timeout, i => i.userName.toLowerCase() === username.toLowerCase() && i.perUserAvatarId === perUserAvatarId);
  }

  getUserName() {
    return this.params.userName;
  }

  getAuthToken() {
    return this.authToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  private currentMinigameMessageProvider?: MinigameProviders;

  setCurrentMinigameMessageProvider(minigameProvider: MinigameProviders) {
    this.currentMinigameMessageProvider = minigameProvider;
  }

  removeCurrentMinigameMessageProvider() {
    this.currentMinigameMessageProvider = undefined;
  }

  getCurrentMinigameMessageProvider() {
    return this.currentMinigameMessageProvider;
  }
}
