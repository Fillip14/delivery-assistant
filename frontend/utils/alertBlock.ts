import { Alert } from 'react-native';

type AlertBlockProps = {
  title?: string;
  message: string;
  isToConfirm?: boolean;
};
/**
 * Mostra um alerta nativo (iOS/Android).
 *
 * - Se `isToConfirm` for `true`, retorna uma Promise que resolve `true` ou `false`
 *   dependendo da escolha do usuário.
 * - Caso contrário, apenas exibe a mensagem e resolve `false`.
 *
 * @param title       Título opcional do alerta
 * @param message     Mensagem a ser exibida (obrigatória)
 * @param isToConfirm Define se o alerta será de confirmação (true/false)
 * @returns           Promise<boolean> com a resposta do usuário
 */
const alertBlock = async ({ title, message, isToConfirm }: AlertBlockProps): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isToConfirm) {
      Alert.alert(title ?? '', message, [
        { text: 'Cancelar', style: 'destructive', onPress: () => resolve(false) },
        { text: 'Sim', style: 'default', onPress: () => resolve(true) },
      ]);
      return;
    }
    Alert.alert(title ?? '', message, [
      { text: 'OK', style: 'default', onPress: () => resolve(true) },
    ]);
  });
};

export default alertBlock;
