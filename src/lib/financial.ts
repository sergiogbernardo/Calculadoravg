// Financial helpers, ported from the Python `calculate_financial` endpoint.

export type FinancialType =
  | 'simple_interest'
  | 'compound_interest'
  | 'percentage'
  | 'percentage_change';

export interface FinancialInput {
  principal?: number;
  rate?: number;
  time?: number;
  value?: number;
  percentage?: number;
}

function format(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return parseFloat(value.toFixed(10)).toString();
}

export function computeFinancial(type: FinancialType, input: FinancialInput): string {
  const { principal, rate, time, value, percentage } = input;

  switch (type) {
    case 'simple_interest':
      if (principal == null || rate == null || time == null)
        throw new Error('Informe principal, taxa e tempo');
      return format(principal * (1 + (rate / 100) * time));

    case 'compound_interest':
      if (principal == null || rate == null || time == null)
        throw new Error('Informe principal, taxa e tempo');
      return format(principal * (1 + rate / 100) ** time);

    case 'percentage':
      if (value == null || percentage == null) throw new Error('Informe valor e porcentagem');
      return format(value * (percentage / 100));

    case 'percentage_change':
      if (value == null || percentage == null) throw new Error('Informe valor e porcentagem');
      return format(value * (1 + percentage / 100));
  }
}
