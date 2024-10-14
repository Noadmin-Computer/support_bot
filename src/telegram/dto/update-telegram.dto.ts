export class UpdateTelegramDto {
  readonly chatId: number;
  readonly isConnectedToSupport: boolean;
  readonly connectedSupporterId?: number;
}
