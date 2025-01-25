export function excelSerialToDate(serial: number): string {
  // O Excel começa a contagem de datas em 1 de janeiro de 1900
  const baseDate = new Date(1900, 0, 1);

  // Subtrair 1 do serial porque o Excel considera 1 de janeiro de 1900 como 1
  const daysOffset = serial - 1;

  // Adicionar o número de dias ao baseDate
  const resultDate = new Date(
    baseDate.setDate(baseDate.getDate() + daysOffset)
  );

  // Retornar a data em formato ISO 8601, preservando milissegundos
  const isoDateString = resultDate.toISOString();

  return isoDateString;
}

export function isExcelDate(serial: number): boolean {
  // Verifica se o valor é um número inteiro positivo
  if (!Number.isInteger(serial) || serial <= 0) {
    return false;
  }

  // Define um intervalo razoável para datas no Excel
  const minSerialDate = 1; // Corresponde a 1 de janeiro de 1900
  const maxSerialDate = 73050; // Aproximadamente 1 de janeiro de 2100

  // Verifica se o serial está dentro do intervalo
  if (serial >= minSerialDate && serial <= maxSerialDate) {
    return true;
  }

  return false;
}
