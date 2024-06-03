import { TokenPayload } from '../dto/token.dto';

export type Token = {
  encode: (payload: TokenPayload) => string;
  decode?: (token: string) => any;
};
