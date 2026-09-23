// SMS functionality disabled per user request
export async function sendReminderSms() {
  return { success: false, disabled: true };
}
