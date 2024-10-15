import { CDataNode, DefaultElement, FragmentElement, ManagedElement, Node } from "typed-xml";
import crypto from "node:crypto";

export enum Language {
  English,
  Spanish,
  Portuguese,
  French,
  Deutsch,
  Unknown = -1,
}

export class C2SCustomLogin extends ManagedElement {
  static new(attributes: Record<string, string>, children: Node[]) {
    throw new Error("Never constructed");
  }

  constructor( 
    public key: string,
    public authToken: string,
    public username: string,
    public sessionId: string | undefined,
    public language: Language,
    public deployVersion: number,
    public clientPlatform: string,
    public clientPlatformVersion: string,
    public operatingSystem: string,
    public df: string,
  ) { super() }

  render(): FragmentElement {
    const MESSAGE = (<login z='sbiLogin'>
      <nick>{new CDataNode([this.username, this.sessionId ?? "", this.language, this.deployVersion, this.clientPlatform, this.clientPlatformVersion, this.operatingSystem, this.df].join("%"))}</nick>
      <pword>{new CDataNode(this.authToken)}</pword>
    </login>).getChildren()[0] as DefaultElement;

    const hash = crypto.createHmac("sha256", this.key).update(MESSAGE.toString({ spaceBeforeSelfClosingTag: true, attributeQuoteType: "'" })).digest("base64");

    return <msg t="sys" h={hash}>
      <body action="login" r="0">
        {MESSAGE}
      </body>
    </msg>
  }
}
