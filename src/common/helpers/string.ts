export class StringHelpers {
  // static alphaReqExp = /^[-\sa-zA-Z]+$/;

  // static alphaReqExp = /^[A-Za-z]+$/;

  static alphaReqExp = /^[a-zA-Z]+[\s|-]?[a-zA-Z]+[\s|-]?[a-zA-Z]+$/;

  static alphaNumRegExp = /^\d+$/;

  static passwordRegExp =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  static isAlphaChar(str: string): boolean {
    return StringHelpers.alphaReqExp.test(str);
  }

  static mustBeAlphaChar(input: string, errorMsg?: string): string {
    if (!StringHelpers.isAlphaChar(input)) {
      throw new Error(errorMsg);
    }
    return input;
  }

  static removeWhiteSpace = (str: string): string => str.replace(/\s/g, '');
}
