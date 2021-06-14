export function isSnowflake(value: string): boolean {
    if (16 <= value.length && value.length <= 21) {
      return !!parseInt(value);
    }
    return false;
  }  